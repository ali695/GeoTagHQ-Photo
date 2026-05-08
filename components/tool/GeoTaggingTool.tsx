'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import UploadDropzone from './UploadDropzone';
import { readImageMetadata, writeGeoToJpeg } from '@/lib/exif';
import { ImageFile, ImageMetadata } from '@/types/image';
import { GeoCoordinates } from '@/types/geo';
import MetadataPanel from './MetadataPanel';
import MapPicker from './MapPicker';
import CoordinateInput from './CoordinateInput';
import BatchImageList from './BatchImageList';
import ExtractImagesSection from './ExtractImagesSection';
import ImageEditorModal from './ImageEditorModal';
import JSZip from 'jszip';
import { MapPin, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SelectedLocationCard from './SelectedLocationCard';
import { toolDict } from '@/lib/toolDict';

export default function GeoTaggingTool({ messages }: { messages?: any }) {
  const params = useParams();
  const lang = (typeof params?.lang === 'string' ? params.lang : 'en');
  
  const d = { ...toolDict['en'], ...toolDict[lang], ...(messages?.tool || {}) };

  const [files, setFiles] = useState<ImageFile[]>([]);
  const [coords, setCoords] = useState<GeoCoordinates | undefined>();
  const [zoomLevel, setZoomLevel] = useState<number | undefined>();
  const [selectedLoc, setSelectedLoc] = useState<import('@/lib/location').SelectedLocation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'original' | 'jpg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif'>('original');
  const [compressionMode, setCompressionMode] = useState<'none' | 'low' | 'medium' | 'high'>('none');
  
  const [editingFileIndex, setEditingFileIndex] = useState<number | null>(null);
  const [globalMetadataEdits, setGlobalMetadataEdits] = useState<Partial<ImageMetadata>>({});

  const handleLocationChange = useCallback((newCoords: GeoCoordinates, source: import('@/lib/location').SelectedLocation['source'], displayName?: string, provider?: string, fullSuggestion?: import('@/lib/location').LocationSuggestion) => {
    setCoords(newCoords);
    
    // Determine zoom level
    let zoom = 13; // default
    if (fullSuggestion?.type === 'address' || fullSuggestion?.houseNumber) {
      zoom = 17;
    } else if (fullSuggestion?.type === 'street' || fullSuggestion?.type === 'highway') {
      zoom = 15;
    } else if (fullSuggestion?.type === 'landmark' || fullSuggestion?.type === 'park') {
      zoom = 16;
    } else if (fullSuggestion?.district || fullSuggestion?.type === ' suburb' || fullSuggestion?.type === 'quarter') {
      zoom = 13;
    } else if (fullSuggestion?.city || fullSuggestion?.type === 'city' || fullSuggestion?.type === 'village') {
      zoom = 11;
    } else if (fullSuggestion?.country || fullSuggestion?.type === 'country') {
      zoom = 5;
    }
    setZoomLevel(zoom);

    if (displayName) {
      setSelectedLoc({ 
          displayName, 
          lat: newCoords.lat, 
          lon: newCoords.lng, 
          source, 
          provider,
          ...fullSuggestion
      });
    } else {
      setSelectedLoc(prev => prev ? { ...prev, lat: newCoords.lat, lon: newCoords.lng, source, provider } : {
        displayName: "Loading location...",
        lat: newCoords.lat,
        lon: newCoords.lng,
        source,
        provider
      });
      fetch(`/api/reverse-geocode?lat=${newCoords.lat}&lon=${newCoords.lng}`)
        .then(async res => {
          let data;
          try {
            data = await res.json();
          } catch (e) {
            throw new Error('Invalid JSON response');
          }
          return { res, data };
        })
        .then(({ res, data }) => {
          if (res.ok && data.result) {
            setSelectedLoc({ 
                displayName: data.result.displayName, 
                lat: newCoords.lat, 
                lon: newCoords.lng, 
                source, 
                provider: data.result.provider,
                ...data.result 
            });
          } else {
            setSelectedLoc({ displayName: "Custom coordinates selected", lat: newCoords.lat, lon: newCoords.lng, source, provider });
          }
        })
        .catch(() => {
          setSelectedLoc({ displayName: "Custom coordinates selected", lat: newCoords.lat, lon: newCoords.lng, source, provider });
        });
    }
  }, []);

  const handleDrop = async (acceptedFiles: File[]) => {
    setErrorInfo(null);
    const errs = d.errors || {};
    if (files.length + acceptedFiles.length > 10) {
      setErrorInfo(errs.batchSizeExceeded || "Maximum batch size is 10 images.");
      return;
    }
    const validFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif', 'image/tiff'];
    const maxSizeBytes = 10 * 1024 * 1024;
    for (const file of acceptedFiles) {
      if (!file.type.startsWith('image/')) {
        setErrorInfo(errs.invalidFormat || "Please upload images only.");
        return;
      }
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|avif|heic|heif|tiff)$/)) {
        setErrorInfo(errs.invalidFormat || "This file type is not supported.");
        return;
      }
      if (file.size > maxSizeBytes) {
        setErrorInfo(errs.fileTooLarge || "This image is too large. Maximum file size is 10 MB.");
        return;
      }
      validFiles.push(file);
    }
    const newFiles: ImageFile[] = await Promise.all(
      validFiles.map(async (file) => {
        const metadata = await readImageMetadata(file);
        return {
          id: Math.random().toString(36).substring(7),
          originalFile: file,
          preview: URL.createObjectURL(file),
          metadata,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'pending'
        };
      })
    );
    setFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0 && newFiles[0].metadata?.gps && !coords) {
      handleLocationChange(newFiles[0].metadata.gps, 'map');
    }
  };

  const handleApplyCoordinates = async () => {
    if (files.length === 0) {
      setErrorInfo("Please upload at least one image before writing metadata.");
      return;
    }
    if (!coords) {
      setErrorInfo(d.errorNoLoc || "Please pin a location on the map before applying the geotag.");
      return;
    }
    setIsProcessing(true);
    setErrorInfo(null);
    setSuccessInfo(null);

    const updatedFiles = [...files];
    let successCount = 0;
    let failCount = 0;
    for (let i = 0; i < updatedFiles.length; i++) {
        let file = updatedFiles[i];
        updatedFiles[i] = { ...file, status: 'processing' };
        setFiles([...updatedFiles]);
        file = updatedFiles[i];
        try {
          const targetBlob = file.editedBlob || file.originalFile;
          const extName = file.name.substring(file.name.lastIndexOf('.'));
          const standardFile = new File([targetBlob], file.name, { type: file.type || 'application/octet-stream' });
          const formData = new FormData();
          formData.append("file", standardFile);
          if (coords) {
            formData.append("lat", coords.lat.toString());
            formData.append("lng", coords.lng.toString());
          }
          formData.append("exportFormat", exportFormat);
          formData.append("compressionMode", compressionMode);
          if (globalMetadataEdits.cameraMake) formData.append("cameraMake", globalMetadataEdits.cameraMake);
          if (globalMetadataEdits.cameraModel) formData.append("cameraModel", globalMetadataEdits.cameraModel);
          if (globalMetadataEdits.dateTaken) formData.append("dateTaken", globalMetadataEdits.dateTaken);
          const seoFields = [
            'title', 'description', 'keywords', 'businessName', 'serviceCategory', 
            'city', 'district', 'country', 'streetAddress', 'postalCode', 
            'stateRegion', 'countryCode', 'websiteUrl', 'schemaMarkup', 
            'ogTags', 'hreflang', 'semanticClusters'
          ] as const;
          seoFields.forEach(field => {
            // Priority Check: Individual Edit exists and is NOT undefined
            // If the user explicitly cleared a field in the individual editor, it should stay empty.
            if (file.editedMetadata && Object.prototype.hasOwnProperty.call(file.editedMetadata, field)) {
              const val = file.editedMetadata[field];
              if (val !== undefined) {
                formData.append(field, val as string);
              }
            } else if (globalMetadataEdits[field] !== undefined) {
              formData.append(field, globalMetadataEdits[field] as string);
            }
          });
          const res = await fetch("/api/geotag-image", { method: "POST", body: formData });
          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.error || d.errors?.exifWriteFailed || "Server processing failed");
          }
          const disposition = res.headers.get("Content-Disposition");
          let finalName = file.name;
          if (disposition && disposition.indexOf("filename=") !== -1) {
             const match = disposition.match(/filename="?([^"]+)"?/);
             if (match && match[1]) {
                finalName = match[1];
             }
          } else {
             const wasConverted = res.headers.get("X-Converted") === "true";
             if (wasConverted) {
                const ext = exportFormat === 'original' ? 'jpg' : exportFormat; // fallback assumption
                finalName = file.name.replace(/\.[^/.]+$/, "") + "." + ext;
             }
          }
          let mimeType = res.headers.get("Content-Type") || "application/octet-stream";
          const processedBlob = new Blob([await res.blob()], { type: mimeType });
          updatedFiles[i] = { ...file, name: finalName, type: mimeType, processedBlob, status: 'done', error: undefined };
          successCount++;
        } catch (error: any) {
          updatedFiles[i] = { ...file, status: 'error', error: error.message || 'Failed to write data' };
          failCount++;
        }
    }
    setFiles([...updatedFiles]);
    setIsProcessing(false);
    if (successCount > 0 && failCount === 0) {
      setSuccessInfo(`${successCount} ${d.successFiles || 'files processed successfully!'}`);
    } else if (successCount > 0 && failCount > 0) {
      setSuccessInfo(`${successCount} ${d.successFiles || 'files processed successfully!'}, but ${failCount} failed.`);
    } else if (successCount === 0 && failCount > 0) {
      setErrorInfo(`${d.errorGeneral || 'An error occurred. Please try again.'} (${failCount} failed)`);
    }
  };

  const downloadAll = async () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.processedBlob);
    if (doneFiles.length === 0) return;
    if (doneFiles.length === 1) {
      const file = doneFiles[0];
      const url = URL.createObjectURL(file.processedBlob!);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    doneFiles.forEach(file => {
      zip.file(file.name, file.processedBlob!);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'geotagged-photos.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      <div className="flex-1 space-y-6 flex flex-col">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{d.step1Drop || "1. Drop Photos"}</h2>
          <UploadDropzone onDropAccepted={handleDrop} messages={messages} />
          <ExtractImagesSection messages={messages} onImport={async (acceptedFiles) => {
            const newArray = Array.from(acceptedFiles);
            await handleDrop(newArray);
          }} />
          <BatchImageList 
            messages={messages}
            files={files} 
            onRemove={(idx) => {
              const newFiles = [...files];
              newFiles.splice(idx, 1);
              setFiles(newFiles);
            }} 
            onClearAll={() => setFiles([])} 
            onEdit={(idx) => setEditingFileIndex(idx)}
          />
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex-grow flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{d.step2Pin || "2. Pin Location"}</h2>
          <div className="space-y-4 flex-grow flex flex-col">
            <SelectedLocationCard 
               location={selectedLoc} 
               onAutoFillMetadata={(details) => {
                  const newEdits: Partial<ImageMetadata> = {};
                  
                  const addr = details.houseNumber ? `${details.street} ${details.houseNumber}` : details.street;
                  if (addr) newEdits.streetAddress = addr;
                  if (details.city) newEdits.city = details.city;
                  if (details.district) newEdits.district = details.district;
                  if (details.country) newEdits.country = details.country;
                  if (details.countryCode) newEdits.countryCode = details.countryCode;
                  if (details.postcode) newEdits.postalCode = details.postcode;
                  if (details.state) newEdits.stateRegion = details.state;
                  
                  if (Object.keys(newEdits).length > 0) {
                     setGlobalMetadataEdits(prev => ({ ...prev, ...newEdits }));
                  }
               }} 
            />
            <div className="flex-grow min-h-[500px] border border-slate-200 rounded-lg overflow-hidden relative shadow-inner flex flex-col">
               <MapPicker initialCoords={coords} zoomLevel={zoomLevel} onChange={(c) => handleLocationChange(c, 'map')} />
            </div>
            <CoordinateInput coords={coords} onChange={(c) => handleLocationChange(c, 'manual')} />
            <div className="flex justify-end pt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => handleLocationChange({ lat: pos.coords.latitude, lng: pos.coords.longitude }, 'current-location'),
                            () => alert('Could not get your location. Please check browser permissions.')
                          );
                        }
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
                    >
                      <MapPin className="w-4 h-4" /> {d.useCurrentLocation || "Use My Current Location"}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Get GPS coordinates from your device</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </section>
      </div>

      <div className="w-full lg:w-[400px] space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{d.step3Apply || "3. Apply Geotag"}</h2>
          {errorInfo && (
            <div className="mb-4 p-3 flex items-start gap-2 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{errorInfo}</p>
            </div>
          )}
          {successInfo && (
            <div className="mb-4 p-3 flex items-start gap-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <p>{successInfo}</p>
            </div>
          )}
          <div className="mb-6">
             <MetadataPanel 
               metadata={(files[0] || Object.keys(globalMetadataEdits).length > 0 || coords) ? { ...(files[0]?.metadata || { format: 'image/jpeg', fileSize: 0 } as any), ...globalMetadataEdits, gps: coords || files[0]?.metadata?.gps } as ImageMetadata : undefined} 
               onMetadataChange={(changes) => {
                 setGlobalMetadataEdits(prev => ({ ...prev, ...changes }));
               }}
             />
          </div>
          
          <div className="mb-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 mb-3 uppercase tracking-wide">{d.exportFormat || "Export Format"}</h3>
            <div className="flex flex-wrap gap-2">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as any)}
                className="w-full text-sm font-medium border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 hover:bg-slate-100 transition-colors shadow-sm appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
              >
                <option value="original">Autodetect / Original</option>
                <option value="jpg">JPG / JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
                <option value="tiff">TIFF</option>
                <option value="gif">GIF</option>
              </select>
            </div>
            {exportFormat !== 'original' && exportFormat !== 'jpg' && (
              <p className="text-[11px] text-slate-500 mt-2.5 leading-tight bg-slate-50 p-2 border border-slate-100 rounded">Conversion to <strong className="font-semibold">{exportFormat.toUpperCase()}</strong> preserves EXIF tags via backend processing.</p>
            )}
          </div>

          <div className="mb-6 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-[13px] font-bold text-slate-900 mb-3 uppercase tracking-wide">{d.compressPhotos || "Compress Photos"}</h3>
            <div className="flex bg-slate-100/80 rounded-lg border border-slate-200/60 p-1">
              <button
                onClick={() => setCompressionMode('none')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${compressionMode === 'none' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {d.compressNone || "None"}
              </button>
              <button
                onClick={() => setCompressionMode('high')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${compressionMode === 'high' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {d.compressLow || "Low"}
              </button>
              <button
                onClick={() => setCompressionMode('medium')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${compressionMode === 'medium' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {d.compressMedium || "Medium"}
              </button>
              <button
                onClick={() => setCompressionMode('low')}
                className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all duration-200 ${compressionMode === 'low' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                {d.compressHigh || "High"}
              </button>
            </div>
            {compressionMode !== 'none' && (
              <div className="mt-3 text-[11px] text-amber-700 bg-amber-50 border border-amber-200/60 rounded-md p-2.5 flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div className="leading-tight">
                  <span className="font-semibold block mb-0.5">{d.noteOnReduction || "Note on reduction:"}</span> 
                  {compressionMode === 'low' && (d.compressNoteLow || "Maximum compression may affect image clarity. File sizes will be heavily reduced.")}
                  {compressionMode === 'medium' && (d.compressNoteMedium || "Moderate compression. Good balance of visual quality and file size.")}
                  {compressionMode === 'high' && (d.compressNoteHigh || "Light compression. Largest file size, highest visual fidelity.")}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleApplyCoordinates}
            disabled={isProcessing || files.length === 0}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2 mb-4"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> {d.processing || 'Processing...'}</>
            ) : (
              d.writeTags || 'Write GPS & Metadata'
            )}
          </button>
          {files.some(f => f.status === 'done') && (
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={downloadAll}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> 
                Download
              </button>
            </div>
          )}
        </section>
      </div>

      {editingFileIndex !== null && files[editingFileIndex] && (
        <ImageEditorModal
          file={files[editingFileIndex]}
          d={d}
          globalMetadata={globalMetadataEdits}
          onClose={() => setEditingFileIndex(null)}
          onSave={(editedBlob, previewUrl, metadata) => {
            const newFiles = [...files];
            if (newFiles[editingFileIndex].preview && newFiles[editingFileIndex].preview?.startsWith('blob:')) {
               URL.revokeObjectURL(newFiles[editingFileIndex].preview as string);
            }
            newFiles[editingFileIndex] = {
              ...newFiles[editingFileIndex],
              editedBlob,
              preview: previewUrl,
              editedMetadata: metadata ? { ...newFiles[editingFileIndex].editedMetadata, ...metadata } : newFiles[editingFileIndex].editedMetadata,
              status: 'pending',
            };
            setFiles(newFiles);
            setEditingFileIndex(null);
          }}
        />
      )}
    </div>
  );
}
