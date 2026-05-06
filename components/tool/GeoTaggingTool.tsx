'use client';

import { useState, useCallback } from 'react';
import UploadDropzone from './UploadDropzone';
import { readImageMetadata, writeGeoToJpeg } from '@/lib/exif';
import { ImageFile, ImageMetadata } from '@/types/image';
import { GeoCoordinates } from '@/types/geo';
import MetadataPanel from './MetadataPanel';
import MapPicker from './MapPicker';
import CoordinateInput from './CoordinateInput';
import LocationSearch from './LocationSearch';
import BatchImageList from './BatchImageList';
import ImageEditorModal from './ImageEditorModal';
import JSZip from 'jszip';
import { MapPin, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import SelectedLocationCard from './SelectedLocationCard';

export default function GeoTaggingTool() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [coords, setCoords] = useState<GeoCoordinates | undefined>();
  const [selectedLoc, setSelectedLoc] = useState<import('@/lib/location').SelectedLocation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [processingMode, setProcessingMode] = useState<'best' | 'keep'>('best');
  
  const [editingFileIndex, setEditingFileIndex] = useState<number | null>(null);
  const [globalMetadataEdits, setGlobalMetadataEdits] = useState<Partial<ImageMetadata>>({});

  const handleLocationChange = useCallback((newCoords: GeoCoordinates, source: import('@/lib/location').SelectedLocation['source'], displayName?: string, provider?: string) => {
    setCoords(newCoords);
    if (displayName) {
      setSelectedLoc({
        displayName,
        lat: newCoords.lat,
        lon: newCoords.lng,
        source,
        provider
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
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            setSelectedLoc({
              displayName: data.result.displayName,
              lat: newCoords.lat,
              lon: newCoords.lng,
              source,
              provider: data.result.provider
            });
          } else {
            setSelectedLoc({
              displayName: "Custom coordinates selected",
              lat: newCoords.lat,
              lon: newCoords.lng,
              source,
              provider
            });
          }
        })
        .catch(() => {
          setSelectedLoc({
            displayName: "Custom coordinates selected",
            lat: newCoords.lat,
            lon: newCoords.lng,
            source,
            provider
          });
        });
    }
  }, []);

  const handleDrop = async (acceptedFiles: File[]) => {
    setErrorInfo(null);
    
    // Validate batch size
    if (files.length + acceptedFiles.length > 10) {
      setErrorInfo("Maximum batch size is 10 images.");
      return;
    }

    const validFiles: File[] = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/avif', 'image/tiff'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB

    for (const file of acceptedFiles) {
      if (!file.type.startsWith('image/')) {
        setErrorInfo("Please upload images only.");
        return;
      }
      if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().match(/\.(jpg|jpeg|png|webp|avif|heic|heif|tiff)$/)) {
        setErrorInfo("This file type is not supported.");
        return;
      }
      if (file.size > maxSizeBytes) {
        setErrorInfo("This image is too large. Maximum file size is 10 MB.");
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

    // If first file has GPS, optionally use it as initial map point
    if (newFiles.length > 0 && newFiles[0].metadata?.gps && !coords) {
      handleLocationChange(newFiles[0].metadata.gps, 'map');
    }
  };

  const handleApplyCoordinates = async () => {
    if (files.length === 0) {
      setErrorInfo("Please upload at least one image before writing metadata.");
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
          const isJpg = ['image/jpeg', 'image/jpg'].includes(file.type) || ['.jpg', '.jpeg'].includes(extName.toLowerCase());

          // We'll use the server-side API for all files now to support all the new SEO tags properly using exiftool.
          // Because writeGeoToJpeg in browser only supports GPS and maybe basic EXIF.
          // Let's force server processing for now since we need to write IPTC and XMP.
          const formData = new FormData();
          formData.append("file", standardFile);
          if (coords) {
            formData.append("lat", coords.lat.toString());
            formData.append("lng", coords.lng.toString());
          }
          formData.append("bestCompatibility", processingMode === 'best' ? "true" : "false");
          
          if (globalMetadataEdits.cameraMake) formData.append("cameraMake", globalMetadataEdits.cameraMake);
          if (globalMetadataEdits.cameraModel) formData.append("cameraModel", globalMetadataEdits.cameraModel);
          if (globalMetadataEdits.dateTaken) formData.append("dateTaken", globalMetadataEdits.dateTaken);

          const seoFields = ['title', 'description', 'keywords', 'businessName', 'serviceCategory', 'city', 'district', 'country', 'streetAddress', 'postalCode', 'stateRegion', 'countryCode', 'websiteUrl'] as const;
          
          seoFields.forEach(field => {
            if (globalMetadataEdits[field]) {
              formData.append(field, globalMetadataEdits[field]!);
            }
          });

          const res = await fetch("/api/geotag-image", { method: "POST", body: formData });
          
          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            throw new Error(errData?.error || "Server processing failed");
          }
          
          const processedBlob = await res.blob();
          const wasConverted = res.headers.get("X-Converted-To-Jpg") === "true";
          
          let finalName = file.name;
          if (wasConverted) {
             finalName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
          }

          updatedFiles[i] = { 
            ...file, 
            name: finalName,
            processedBlob, 
            status: 'done', 
            error: undefined 
          };
          successCount++;
        } catch (error: any) {
          console.error("Error writing EXIF:", error);
          updatedFiles[i] = { ...file, status: 'error', error: error.message || 'Failed to write data' };
          failCount++;
        }
    }

    setFiles([...updatedFiles]);
    setIsProcessing(false);

    if (successCount > 0 && failCount === 0) {
      setSuccessInfo(`Successfully processed ${successCount} photo${successCount > 1 ? 's' : ''}.`);
    } else if (successCount > 0 && failCount > 0) {
      setSuccessInfo(`Successfully processed ${successCount} photo${successCount > 1 ? 's' : ''}, but ${failCount} failed.`);
    } else if (successCount === 0 && failCount > 0) {
      const firstError = updatedFiles.find(f => f.status === 'error')?.error;
      setErrorInfo(`Failed to process ${failCount} photo${failCount > 1 ? 's' : ''}. ${firstError ? 'Reason: ' + firstError : ''}`);
    }
  };

  const downloadAll = async () => {
    const doneFiles = files.filter(f => f.status === 'done' && f.processedBlob);
    
    if (doneFiles.length === 0) return;

    if (doneFiles.length === 1) {
      // Download single
      const file = doneFiles[0];
      const url = URL.createObjectURL(file.processedBlob!);
      const a = document.createElement('a');
      a.href = url;
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      a.download = `${baseName}-geotagged${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // Download zip
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    doneFiles.forEach(file => {
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      zip.file(`${baseName}-geotagged${ext}`, file.processedBlob!);
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
      {/* Left Column: Upload & Map */}
      <div className="flex-1 space-y-6 flex flex-col">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">1. Upload Photos</h2>
          <UploadDropzone onDropAccepted={handleDrop} />
          
          <BatchImageList 
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
          <h2 className="text-xl font-bold text-slate-900 mb-4">2. Pin Location</h2>
          
          <div className="space-y-4 flex-grow flex flex-col">
            <LocationSearch onSelectCallback={(c, name, provider) => handleLocationChange(c, 'search', name, provider)} />
            
            <SelectedLocationCard location={selectedLoc} />
            
            <div className="flex-grow min-h-[400px] border border-slate-200 rounded-lg overflow-hidden relative">
               <MapPicker initialCoords={coords} onChange={(c) => handleLocationChange(c, 'map')} />
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
                      <MapPin className="w-4 h-4" /> Use My Current Location
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

      {/* Right Column: Metadata & Action */}
      <div className="w-full lg:w-[400px] space-y-6">
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">3. Apply Geotag</h2>
          
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
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Processing Mode</h3>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setProcessingMode('best')}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${processingMode === 'best' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Best Compatibility
              </button>
              <button
                onClick={() => setProcessingMode('keep')}
                className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-md transition-colors ${processingMode === 'keep' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Keep Original Format
              </button>
            </div>
            <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-3 text-xs">
              <p className="mb-1 font-medium text-amber-900">Compatibility Note:</p>
              <p>JPG/JPEG offers the best compatibility for GPS and SEO metadata. PNG, WebP, AVIF and HEIC may have limited metadata support depending on the platform where the image is uploaded.</p>
              {processingMode === 'keep' && (
                <p className="mt-2 font-medium text-amber-900 bg-amber-200/50 inline-block px-1.5 py-0.5 rounded">For maximum metadata compatibility, JPG is recommended.</p>
              )}
            </div>
          </div>

          <div className="mb-6">
             <MetadataPanel 
               metadata={files[0] ? { ...files[0].metadata, ...globalMetadataEdits } as ImageMetadata : undefined} 
               onMetadataChange={(changes) => {
                 setGlobalMetadataEdits(prev => ({ ...prev, ...changes }));
               }}
             />
             {files.length > 1 && (
               <p className="text-xs text-slate-500 mt-2 text-center">Showing metadata for first photo only</p>
             )}
          </div>

          <button
            onClick={handleApplyCoordinates}
            disabled={isProcessing || files.length === 0}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2 mb-4"
          >
            {isProcessing ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              'Write GPS & Metadata'
            )}
          </button>

          {files.some(f => f.status === 'done') && (
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={downloadAll}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> 
                {files.filter(f => f.status === 'done').length > 1 ? 'Download All as ZIP' : 'Download Photo'}
              </button>
            </div>
          )}
        </section>
      </div>

      {editingFileIndex !== null && files[editingFileIndex] && (
        <ImageEditorModal
          file={files[editingFileIndex]}
          onClose={() => setEditingFileIndex(null)}
          onSave={(editedBlob, previewUrl) => {
            const newFiles = [...files];
            if (newFiles[editingFileIndex].preview && newFiles[editingFileIndex].preview?.startsWith('blob:')) {
               URL.revokeObjectURL(newFiles[editingFileIndex].preview as string);
            }
            newFiles[editingFileIndex] = {
              ...newFiles[editingFileIndex],
              editedBlob,
              preview: previewUrl,
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
