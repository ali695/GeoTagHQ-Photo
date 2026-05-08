'use client';

import { useState, useRef } from 'react';
import { Loader2, Image as ImageIcon, Link, Check, Plus, AlertCircle, Info } from 'lucide-react';

interface ExtractedImage {
  url: string;
  alt: string;
  source: string;
}

interface ExtractImagesSectionProps {
  onImport: (files: File[]) => Promise<void>;
  messages?: any;
}

export default function ExtractImagesSection({ onImport, messages }: ExtractImagesSectionProps) {
  const m = messages?.extract || {};
  
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string, code?: string } | null>(null);
  const [images, setImages] = useState<ExtractedImage[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExtract = async () => {
    if (!url) return;
    try {
      new URL(url); // basic validation
    } catch {
      setError({ message: m.extractInvalidUrl || 'Please enter a valid URL.', code: 'INVALID_URL' });
      return;
    }

    setIsLoading(true);
    setError(null);
    setImages([]);
    setSelectedUrls(new Set());

    try {
      const res = await fetch('/api/extract-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      
      if (!data.success) {
        if (data.errorCode === 'WEBSITE_BLOCKED') {
          setError({ 
            message: m.extractErrorBlocked || 'We could not extract images from this page. Some websites, such as stock photo platforms, social media sites, or protected CDNs, block external image extraction. Try uploading the image manually or paste a direct image URL.', 
            code: data.errorCode 
          });
        } else {
          setError({ message: data.error || m.extractErrorDefault || 'We could not extract images from this URL.', code: data.errorCode });
        }
        return;
      }
      
      if (data.images.length === 0) {
        setError({ message: m.extractNoImages || 'No images were found on this page.', code: 'NO_IMAGES_FOUND' });
        return;
      }
      
      setImages(data.images);
    } catch (err) {
      setError({ message: m.extractErrorDefault || 'An error occurred during extraction. The site may be unreachable.', code: 'FETCH_FAILED' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (imageUrl: string) => {
    const newSelection = new Set(selectedUrls);
    if (newSelection.has(imageUrl)) {
      newSelection.delete(imageUrl);
    } else {
      newSelection.add(imageUrl);
    }
    setSelectedUrls(newSelection);
  };

  const fetchImageWithProxy = async (imageUrl: string): Promise<Blob> => {
    try {
      // Try direct fetch first
      const res = await fetch(imageUrl);
      if (res.ok) {
        return await res.blob();
      }
      throw new Error('Direct fetch failed');
    } catch (err) {
      // Use proxy if direct fetch fails (CORS etc)
      const proxyRes = await fetch('/api/proxy-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageUrl })
      });
      if (!proxyRes.ok) {
        throw new Error('This image could not be imported. It might be blocked or unsupported.');
      }
      return await proxyRes.blob();
    }
  };

  const handleImport = async (all = false) => {
    const urlsToImport = all ? images.map(img => img.url) : Array.from(selectedUrls);
    if (urlsToImport.length === 0) return;

    setIsImporting(true);
    setError(null);

    try {
      const files: File[] = [];
      for (const imgUrl of urlsToImport) {
        try {
          const blob = await fetchImageWithProxy(imgUrl);
          
          let fileName = 'extracted-image.jpg';
          try {
            const urlObj = new URL(imgUrl);
            const pathSegments = urlObj.pathname.split('/');
            const lastSegment = pathSegments[pathSegments.length - 1];
            if (lastSegment && lastSegment.includes('.')) {
              fileName = lastSegment.split('?')[0]; // simple cleanup
            }
          } catch (e) {
            // fallback
          }

          const fileType = blob.type || 'image/jpeg';
          const file = new File([blob], fileName, { type: fileType });
          files.push(file);
        } catch (fetchErr) {
          console.error('Import failed for', imgUrl, fetchErr);
        }
      }

      if (files.length === 0) {
        setError({ message: m.extractImportFailed || 'Failed to import any of the selected images. They may be blocked or unsupported.', code: 'IMAGE_IMPORT_FAILED' });
      } else {
        await onImport(files);
        // Deselect imported
        if (!all) {
          setImages(prev => prev.filter(img => !urlsToImport.includes(img.url)));
          setSelectedUrls(new Set());
        } else {
          setImages([]);
          setSelectedUrls(new Set());
        }
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <Link className="h-5 w-5 text-indigo-500" />
        {m.extractPhotosHeader || 'Extract Photos from URL'}
      </h3>
      
      <div className="flex gap-2 mb-2">
        <input
          ref={inputRef}
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={m.extractPhotosPlaceholder || "Paste a webpage URL or a direct image URL"}
          className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
        />
        <button
          onClick={handleExtract}
          disabled={isLoading || !url}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors font-medium shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          {m.extractPhotosBtn || 'Extract'}
        </button>
      </div>

      {!error && !isLoading && images.length === 0 && (
        <p className="text-sm text-slate-500 mt-2 mb-4">
          {m.extractWorksBest || 'Works best with public webpages and direct image URLs. Some stock photo, social media, or protected websites may block extraction.'}
        </p>
      )}
      
      {error && (
        <div className="mt-3 mb-4 space-y-3">
          <div className="flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 p-3 rounded-md">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error.message}</p>
          </div>
          
          {(error.code === 'WEBSITE_BLOCKED' || error.code === 'FETCH_FAILED') && (
            <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-2 text-sm text-slate-600">
                <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Tip:</strong> {m.extractTryDirectUpload || 'If this page blocks extraction, open the image directly, copy the direct image URL, and paste it here.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setUrl('');
                  inputRef.current?.focus();
                  setError(null);
                }}
                className="shrink-0 px-3 py-1.5 text-sm font-medium bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 transition-colors"
              >
                {m.extractTryDirectUrlBtn || 'Try Direct Image URL'}
              </button>
            </div>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">
              {m.extractExtractedImages || 'Found'} {images.length} ({selectedUrls.size})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleImport(false)}
                disabled={selectedUrls.size === 0 || isImporting}
                className="px-3 py-1.5 text-sm bg-slate-900 text-white rounded hover:bg-slate-800 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
              >
                {isImporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                {m.extractImportSelected || 'Import Selected Images'}
              </button>
              <button
                onClick={() => handleImport(true)}
                disabled={isImporting}
                className="px-3 py-1.5 text-sm border border-slate-300 bg-white text-slate-700 rounded hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                {m.extractImportAll || 'Import All Images'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
            {images.map((img, i) => {
              const isSelected = selectedUrls.has(img.url);
              return (
                <div 
                  key={i}
                  className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden h-24 bg-slate-100 ${isSelected ? 'border-indigo-600' : 'border-transparent'}`}
                  onClick={() => toggleSelection(img.url)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  
                  <div className={`absolute top-1 right-1 h-5 w-5 rounded-full flex items-center justify-center transition-opacity ${isSelected ? 'bg-indigo-600 text-white outline outline-2 outline-white shadow-sm' : 'bg-black/20 text-transparent opacity-0 group-hover:opacity-100 border border-white'}`}>
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-1">
                    <div className="text-[10px] text-white truncate px-1" title={img.url}>
                      {new URL(img.url).hostname.replace('www.', '')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

