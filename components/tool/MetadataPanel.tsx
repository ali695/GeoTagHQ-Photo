'use client';

import { useState, useEffect } from 'react';
import { ImageMetadata } from '@/types/image';
import { Camera, Calendar, HardDrive, FileType, Map, Wand2, Copy, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MetadataPanelProps {
  metadata?: ImageMetadata;
  onMetadataChange?: (changes: Partial<ImageMetadata>) => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MetadataPanel({ metadata, onMetadataChange }: MetadataPanelProps) {
  const [copied, setCopied] = useState(false);
  const [editState, setEditState] = useState<Partial<ImageMetadata>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [seoLang, setSeoLang] = useState('en');
  const [businessType, setBusinessType] = useState('general');

  useEffect(() => {
    if (metadata) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditState({
        title: metadata.title || '',
        description: metadata.description || '',
        keywords: metadata.keywords || '',
        businessName: metadata.businessName || '',
        serviceCategory: metadata.serviceCategory || '',
        city: metadata.city || '',
        district: metadata.district || '',
        country: metadata.country || '',
        suggestedAltText: metadata.suggestedAltText || '',
        streetAddress: metadata.streetAddress || '',
        postalCode: metadata.postalCode || '',
        stateRegion: metadata.stateRegion || '',
        countryCode: metadata.countryCode || '',
        websiteUrl: metadata.websiteUrl || '',
      });
    }
  }, [metadata]);

  const handleChange = (field: keyof ImageMetadata, value: string) => {
    const newState = { ...editState, [field]: value };
    setEditState(newState);
    if (onMetadataChange) {
      onMetadataChange(newState);
    }
  };

  const handleGenerateSEO = async () => {
    setIsGenerating(true);
    try {
      const payload = {
        businessName: editState.businessName,
        serviceCategory: editState.serviceCategory,
        city: editState.city,
        district: editState.district,
        country: editState.country,
        businessType: businessType,
        language: seoLang
      };

      const res = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        
        // Advanced SEO defaults
        const country = editState.country;
        let genCountryCode = '';
        if (country) {
          if (country.toLowerCase() === 'germany' || country.toLowerCase() === 'deutschland') genCountryCode = 'DE';
          else if (country.toLowerCase() === 'united states' || country.toLowerCase() === 'usa') genCountryCode = 'US';
          else if (country.toLowerCase() === 'france') genCountryCode = 'FR';
          else if (country.toLowerCase() === 'spain') genCountryCode = 'ES';
          else genCountryCode = country.substring(0, 2).toUpperCase();
        }

        let genWebsite = '';
        if (editState.businessName) {
          genWebsite = `https://www.${editState.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
        }

        const updates = {
          title: data.title || '',
          description: data.description || '',
          keywords: data.keywords || [editState.serviceCategory, editState.city, editState.district, editState.businessName].filter(Boolean).join(', '),
          suggestedAltText: data.suggestedAltText || '',
          stateRegion: editState.city || '',
          countryCode: genCountryCode,
          websiteUrl: genWebsite,
        };
        
        setEditState(prev => ({ ...prev, ...updates }));
        if (onMetadataChange) {
          onMetadataChange({ ...editState, ...updates });
        }
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyAltText = () => {
    if (editState.suggestedAltText) {
      navigator.clipboard.writeText(editState.suggestedAltText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!metadata) {
    return (
      <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-6 text-center text-slate-500 text-sm">
        Upload an image to configure metadata
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Current Metadata (Read-only) */}
      <details className="bg-slate-50 border border-slate-200 rounded-lg group">
        <summary className="font-bold text-slate-900 text-sm p-5 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          Metadata Summary
          <svg className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        
        <div className="px-5 pb-5 pt-2 border-t border-slate-200 space-y-4 text-sm mt-2">
          {/* GPS Location */}
          <div>
            <h5 className="font-semibold text-slate-800 mb-1">GPS Location</h5>
            {metadata.gps ? (
              <div className="text-slate-600 ms-1 space-y-0.5">
                <p><span className="font-medium text-slate-700">Status:</span> Found</p>
                <p><span className="font-medium text-slate-700">Latitude:</span> {metadata.gps.lat >= 0 ? `${metadata.gps.lat.toFixed(6)}° N` : `${Math.abs(metadata.gps.lat).toFixed(6)}° S`}</p>
                <p><span className="font-medium text-slate-700">Longitude:</span> {metadata.gps.lng >= 0 ? `${metadata.gps.lng.toFixed(6)}° E` : `${Math.abs(metadata.gps.lng).toFixed(6)}° W`}</p>
              </div>
            ) : (
              <div className="text-slate-600 ms-1">
                <p><span className="font-medium text-slate-700">Status:</span> Not found</p>
                <p className="text-slate-500 mt-1 italic text-xs">No GPS coordinates were found in this image.</p>
              </div>
            )}
          </div>

          {/* Image Details */}
          <div>
            <h5 className="font-semibold text-slate-800 mb-1">Image Details</h5>
            <div className="text-slate-600 ms-1 space-y-0.5">
              <p><span className="font-medium text-slate-700">Format:</span> {metadata.format.split('/')[1]?.toUpperCase() || 'Unknown'}</p>
              {(metadata.width && metadata.height) ? (
                <p><span className="font-medium text-slate-700">Dimensions:</span> {metadata.width} x {metadata.height}</p>
              ) : null}
              <p><span className="font-medium text-slate-700">File Size:</span> {formatBytes(metadata.fileSize)}</p>
            </div>
          </div>

          {/* Camera Info */}
          <div>
            <h5 className="font-semibold text-slate-800 mb-1">Camera Info</h5>
            <div className="text-slate-600 ms-1 space-y-0.5">
              <p><span className="font-medium text-slate-700">Camera Make:</span> {metadata.cameraMake || 'Not available'}</p>
              <p><span className="font-medium text-slate-700">Camera Model:</span> {metadata.cameraModel || 'Not available'}</p>
              <p><span className="font-medium text-slate-700">Date Taken:</span> {metadata.dateTaken ? new Date(metadata.dateTaken).toLocaleString() : 'Not available'}</p>
            </div>
          </div>
          
          {/* Local SEO Metadata Viewer */}
          {(metadata.title || metadata.description || metadata.keywords || metadata.businessName || metadata.city || metadata.district || metadata.country) ? (
            <div>
              <h5 className="font-semibold text-slate-800 mb-1">Local SEO Metadata</h5>
              <div className="text-slate-600 ms-1 space-y-0.5 break-words">
                {metadata.title && <p><span className="font-medium text-slate-700">Title:</span> {metadata.title}</p>}
                {metadata.description && <p><span className="font-medium text-slate-700">Description:</span> {metadata.description}</p>}
                {metadata.keywords && <p><span className="font-medium text-slate-700">Keywords:</span> {metadata.keywords}</p>}
                {metadata.businessName && <p><span className="font-medium text-slate-700">Business Name:</span> {metadata.businessName}</p>}
                {metadata.city && <p><span className="font-medium text-slate-700">City:</span> {metadata.city}</p>}
                {metadata.district && <p><span className="font-medium text-slate-700">District:</span> {metadata.district}</p>}
                {metadata.country && <p><span className="font-medium text-slate-700">Country:</span> {metadata.country}</p>}
              </div>
            </div>
          ) : null}
        </div>
      </details>

      <div className="w-full flex flex-wrap items-center justify-between gap-4">
        <h4 className="font-bold text-slate-900 text-sm">Basic Local SEO Metadata</h4>
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={businessType} 
            onChange={(e) => setBusinessType(e.target.value)}
            className="text-xs border border-slate-300 rounded-md px-2 py-1 outline-none bg-white"
          >
            <option value="general">General</option>
            <option value="hotel">Hotel / Stays</option>
            <option value="restaurant">Restaurant / Cafe</option>
            <option value="plumber">Plumber / Trades</option>
            <option value="real_estate">Real Estate</option>
            <option value="ecommerce">E-Commerce</option>
          </select>
          <select 
            value={seoLang} 
            onChange={(e) => setSeoLang(e.target.value)}
            className="text-xs border border-slate-300 rounded-md px-2 py-1 outline-none bg-white"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="it">Italiano</option>
            <option value="pt">Português</option>
          </select>
          <button 
            onClick={handleGenerateSEO}
            disabled={isGenerating}
            className="text-xs flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors font-medium border border-blue-200 disabled:opacity-50"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isGenerating ? 'animate-pulse' : ''}`} />
            {isGenerating ? 'Generating...' : 'Generate SEO'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
             <input type="text" maxLength={80} value={editState.businessName || ''} onChange={(e) => handleChange('businessName', e.target.value)} placeholder="e.g. Flexofon" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1">Service / Category</label>
             <input type="text" maxLength={80} value={editState.serviceCategory || ''} onChange={(e) => handleChange('serviceCategory', e.target.value)} placeholder="e.g. Handy Reparatur" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
             <input type="text" maxLength={80} value={editState.city || ''} onChange={(e) => handleChange('city', e.target.value)} placeholder="e.g. Hamburg" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
             <input type="text" maxLength={80} value={editState.district || ''} onChange={(e) => handleChange('district', e.target.value)} placeholder="e.g. Wilhelmsburg" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
           <div>
             <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
             <input type="text" maxLength={80} value={editState.country || ''} onChange={(e) => handleChange('country', e.target.value)} placeholder="e.g. Germany" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
           </div>
        </div>

        <div>
           <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
           <input type="text" maxLength={120} value={editState.title || ''} onChange={(e) => handleChange('title', e.target.value)} placeholder="e.g. Handy Reparatur in Hamburg Wilhelmsburg" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
           <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
           <textarea rows={2} maxLength={300} value={editState.description || ''} onChange={(e) => handleChange('description', e.target.value)} placeholder="e.g. Professionelle Handy Reparatur in Hamburg Wilhelmsburg bei Flexofon." className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <div>
           <label className="block text-xs font-semibold text-slate-700 mb-1">Keywords</label>
           <input type="text" value={editState.keywords || ''} onChange={(e) => handleChange('keywords', e.target.value)} placeholder="e.g. Handy Reparatur, Hamburg, Wilhelmsburg, iPhone Reparatur" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
           <div className="flex justify-between items-start mb-2">
             <label className="block text-xs font-semibold text-blue-900">Suggested Alt Text</label>
             <button onClick={copyAltText} className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors bg-white px-2 py-1 rounded shadow-sm border border-blue-200">
               {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
               {copied ? 'Copied' : 'Copy Alt Text'}
             </button>
           </div>
           <input type="text" value={editState.suggestedAltText || ''} onChange={(e) => handleChange('suggestedAltText', e.target.value)} placeholder="e.g. Handy Reparatur Service in Hamburg Wilhelmsburg bei Flexofon" className="w-full text-sm border border-blue-200 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
           <p className="text-[10px] text-blue-700 mt-2 leading-tight">Alt text should be added directly in your website, CMS, Shopify, WordPress, or HTML image tag. Copy this suggestion when uploading the image.</p>
        </div>
      </div>

      <details className="mt-6 border-t border-slate-200 pt-6 group">
        <summary className="font-bold text-slate-900 text-sm mb-4 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          Advanced Metadata
          <svg className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
               <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
               <input type="text" maxLength={120} value={editState.streetAddress || ''} onChange={(e) => handleChange('streetAddress', e.target.value)} placeholder="e.g. Musterstraße 12" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
               <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
               <input type="text" maxLength={20} value={editState.postalCode || ''} onChange={(e) => handleChange('postalCode', e.target.value)} placeholder="e.g. 21107" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
               <label className="block text-xs font-semibold text-slate-700 mb-1">State / Region</label>
               <input type="text" maxLength={80} value={editState.stateRegion || ''} onChange={(e) => handleChange('stateRegion', e.target.value)} placeholder="e.g. Hamburg" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
               <label className="block text-xs font-semibold text-slate-700 mb-1">Country Code</label>
               <input type="text" maxLength={2} value={editState.countryCode || ''} onChange={(e) => handleChange('countryCode', e.target.value)} placeholder="e.g. DE" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 uppercase" />
            </div>
            <div className="col-span-2">
               <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
               <input type="url" value={editState.websiteUrl || ''} onChange={(e) => handleChange('websiteUrl', e.target.value)} placeholder="e.g. https://example.com" className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
