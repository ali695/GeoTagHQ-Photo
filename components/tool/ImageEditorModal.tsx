'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCcw, RotateCw, Check, Wand2, Info, Tag, FileText, Type, Image as ImageIcon } from 'lucide-react';
import { ImageFile, ImageMetadata } from '@/types/image';
import { generateSeoMetadata } from '@/lib/gemini';
import { UI_LABELS } from '@/lib/constants';

interface ImageEditorModalProps {
  file: ImageFile | null;
  onClose: () => void;
  onSave: (editedBlob: Blob, previewUrl: string, metadata?: Partial<ImageMetadata>, fileName?: string) => void;
  d?: any;
  globalMetadata?: Partial<ImageMetadata>;
}

// Helper to center crop initially
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageEditorModal({ file, onClose, onSave, d = {}, globalMetadata = {} }: ImageEditorModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [hueRotate, setHueRotate] = useState(0);
  const [textOverlay, setTextOverlay] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [textX, setTextX] = useState(50); // percentage
  const [textY, setTextY] = useState(80); // percentage
  const [activeTab, setActiveTab] = useState<'transform' | 'filters' | 'text'>('transform');
  const [mobileTab, setMobileTab] = useState<'edit' | 'seo'>('edit');
  const imgRef = useRef<HTMLImageElement>(null);

  // Metadata overrides state
  const [localMeta, setLocalMeta] = useState<Partial<ImageMetadata>>({});
  const [fileName, setFileName] = useState(file?.name || '');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAiSuggest = async () => {
    setIsGeneratingAi(true);
    try {
      const data = await generateSeoMetadata({
        businessName: localMeta.businessName || globalMetadata.businessName,
        serviceCategory: localMeta.serviceCategory || globalMetadata.serviceCategory,
        city: localMeta.city || globalMetadata.city,
        country: localMeta.country || globalMetadata.country,
        businessType: localMeta.businessType || 'general',
        language: localMeta.language || 'en',
        streetAddress: localMeta.streetAddress || globalMetadata.streetAddress,
        postalCode: localMeta.postalCode || globalMetadata.postalCode,
        stateRegion: localMeta.stateRegion || globalMetadata.stateRegion,
        countryCode: localMeta.countryCode || globalMetadata.countryCode,
        district: localMeta.district || globalMetadata.district
      });

      if (data) {
        setLocalMeta(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          suggestedAltText: data.suggestedAltText || prev.suggestedAltText,
          keywords: data.keywords || prev.keywords,
          schemaMarkup: typeof data.schemaMarkup === 'string' ? data.schemaMarkup : JSON.stringify(data.schemaMarkup, null, 2),
          ogTags: JSON.stringify(data.ogTags),
          hreflang: JSON.stringify(data.hreflang),
          semanticClusters: Array.isArray(data.semanticClusters) ? data.semanticClusters.join(', ') : data.semanticClusters,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  useEffect(() => {
    if (file && file.editedMetadata) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMeta(file.editedMetadata);
    } else if (file && file.metadata) {
      // Initialize with existing if any, or empty
      setLocalMeta({
        title: file.metadata.title || '',
        description: file.metadata.description || '',
        keywords: file.metadata.keywords || '',
        serviceCategory: file.metadata.serviceCategory || '',
        suggestedAltText: file.metadata.suggestedAltText || '',
        businessName: file.metadata.businessName || '',
        websiteUrl: file.metadata.websiteUrl || '',
        businessType: file.metadata.businessType || 'general',
        language: file.metadata.language || 'en',
        streetAddress: file.metadata.streetAddress || '',
        city: file.metadata.city || '',
        postalCode: file.metadata.postalCode || '',
        stateRegion: file.metadata.stateRegion || '',
        country: file.metadata.country || '',
        countryCode: file.metadata.countryCode || '',
        schemaMarkup: file.metadata.schemaMarkup || '',
        ogTags: file.metadata.ogTags || '',
        hreflang: file.metadata.hreflang || '',
        semanticClusters: file.metadata.semanticClusters || '',
      });
    }
  }, [file]);

  const handleMetaChange = (field: keyof ImageMetadata, value: string) => {
    setLocalMeta(prev => {
      const next = { ...prev, [field]: value };
      
      // If changing businessType, auto-fill serviceCategory
      if (field === 'businessType' && value !== 'general') {
        const presetToCategory: Record<string, string> = {
          'tree_service': 'Tree Service & Arborist',
          'towing': 'Towing & Roadside Assistance',
          'pest_control': 'Pest Control Services',
          'concrete': 'Concrete & Epoxy Contractors',
          'fencing': 'Fencing Installation',
          'locksmith': 'Professional Locksmith',
          'junk_removal': 'Junk Removal & Hauling',
          'remediation': 'Water Damage & Mold Remediation',
          'painting': 'Painting Contractors',
          'electrician': 'Electrical Services',
          'hotel': 'Hotel & Accommodation',
          'restaurant': 'Restaurant & Dining',
          'plumber': 'Plumbing Services',
          'real_estate': 'Real Estate Agency',
          'ecommerce': 'E-Commerce Store',
          'automotive': 'Automotive & Car Repair',
          'healthcare': 'Healthcare & Medical Clinic',
          'legal': 'Legal Services & Law Firm',
          'fitness': 'Gym & Fitness Center',
          'salon': 'Hair Salon & Beauty Spa',
          'cleaning': 'Professional Cleaning Services',
          'landscaping': 'Landscaping & Gardening',
          'hvac': 'HVAC Services',
          'roofing': 'Roofing Contractors',
          'dentist': 'Dental Care Clinic',
          'photographer': 'Professional Photography',
          'event_planning': 'Event Planning & Catering',
          'tech_support': 'IT & Tech Support',
          'accounting': 'Accounting & Tax Services',
          'marketing': 'Digital Marketing Agency',
          'jewelry': 'Luxury Jewelry',
          'fashion': 'High-end Fashion Boutique',
          'foundation_repair': 'Foundation Repair Specialist',
          'duct_cleaning': 'Air Duct Cleaning Service',
          'window_cleaning': 'Professional Window Cleaning',
          'siding': 'Siding & Gutter Installation',
          'flooring': 'Flooring Contractor',
          'garage_door': 'Garage Door Repair Service',
          'solar': 'Solar Power System Installer',
          'appliance_repair': 'Home Appliance Repair',
          'pool_service': 'Pool Cleaning & Maintenance',
          'masonry': 'Masonry & Stone Work',
          'carpentry': 'Carpentry & Custom Woodworking',
          'welding': 'Welding & Metal Fabrication',
          'architect': 'Professional Architecture Firm',
          'interior_design': 'Interior Design Studio',
          'vet': 'Veterinary Clinic',
          'pet_grooming': 'Pet Grooming & Spa',
          'construction': 'General Contractor & Construction',
          'logistics': 'Logistics & Freight Services',
          'security': 'Private Security & Guard Services',
          'tax_service': 'Tax Preparation & Strategy',
          'chiropractor': 'Chiropractic Health Center',
          'pharmacy': 'Local Pharmacy',
          'insurance': 'Insurance Agency',
          'travel_agency': 'Travel & Vacation Agency',
          'car_wash': 'Full Service Car Wash',
          'trucking': 'Trucking & Haulage',
          'moving_company': 'Local & Long Distance Moving',
          'auto_glass': 'Auto Glass Repair & Replace',
          'boat_repair': 'Marine & Boat Repair'
        };
        if (presetToCategory[value]) {
          next.serviceCategory = presetToCategory[value];
        }
      }
      return next;
    });
  };

  const getLocationLabels = (country?: string) => {
    const c = country?.toLowerCase().trim() || '';
    
    // USA
    if (c === 'usa' || c === 'united states' || c === 'united states of america' || c === 'us') {
      return { state: d.stateLabel || 'State', postal: d.zipCodeLabel || 'ZIP Code' };
    }
    // UK
    if (c === 'united kingdom' || c === 'uk' || c === 'britain' || c === 'england' || c === 'scotland' || c === 'wales') {
      return { state: d.countyLabel || 'County', postal: d.postcodeLabel || 'Postcode' };
    }
    // Canada
    if (c === 'canada' || c === 'ca') {
      return { state: d.provinceLabel || 'Province', postal: d.postalCodeLabel || 'Postal Code' };
    }
    // Australia
    if (c === 'australia' || c === 'au') {
      return { state: d.stateLabel || 'State', postal: d.postcodeLabel || 'Postcode' };
    }
    // Germany
    if (c === 'germany' || c === 'deutschland' || c === 'de') {
      return { state: d.bundeslandLabel || 'Bundesland', postal: d.plzLabel || 'Postleitzahl (PLZ)' };
    }
    // India
    if (c === 'india' || c === 'in') {
      return { state: d.stateLabel || 'State', postal: d.postalCodeLabel || 'PIN Code' };
    }
    // France
    if (c === 'france' || c === 'fr') {
      return { state: d.stateRegionLabel || 'Région', postal: d.postalCodeLabel || 'Code Postal' };
    }
    // Spain
    if (c === 'spain' || c === 'españa' || c === 'es') {
      return { state: d.provinceLabel || 'Provincia', postal: d.postalCodeLabel || 'Código Postal' };
    }
    // Italy
    if (c === 'italy' || c === 'italia' || c === 'it') {
      return { state: d.provinceLabel || 'Provincia', postal: d.postalCodeLabel || 'Codice Postale' };
    }
    // Brazil
    if (c === 'brazil' || c === 'brasil' || c === 'br') {
      return { state: d.stateLabel || 'Estado', postal: d.postalCodeLabel || 'CEP' };
    }
    // Netherlands
    if (c === 'netherlands' || c === 'nederland' || c === 'nl') {
      return { state: d.provinceLabel || 'Provincie', postal: d.postalCodeLabel || 'Postcode' };
    }
    // Indonesia
    if (c === 'indonesia' || c === 'id') {
      return { state: d.provinceLabel || 'Provinsi', postal: d.postalCodeLabel || 'Kode Pos' };
    }
    // Japan
    if (c === 'japan' || c === 'nihon' || c === 'nippon' || c === 'jp') {
      return { state: d.stateLabel || '都道府県', postal: d.postalCodeLabel || '郵便番号' };
    }
    // South Korea
    if (c === 'south korea' || c === 'korea' || c === 'kr' || c === '대한민국') {
      return { state: d.stateLabel || '도', postal: d.postalCodeLabel || '우편번호' };
    }
    // Turkey
    if (c === 'turkey' || c === 'türkiye' || c === 'tr') {
      return { state: d.provinceLabel || 'İl', postal: d.postalCodeLabel || 'Posta Kodu' };
    }

    return { state: d.stateRegionLabel || 'State / Region', postal: d.postalCodeLabel || 'Postal Code' };
  };

  const labels = getLocationLabels(localMeta.country);
  const currentLabels = UI_LABELS[localMeta.language || 'en'] || UI_LABELS.en;

  // Use preview or create one
  const imgSrc = useMemo(() => {
    if (!file) return '';
    if (file.editedBlob) return URL.createObjectURL(file.editedBlob);
    return file.preview || URL.createObjectURL(file.originalFile);
  }, [file]);

  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [enhanceQuality, setEnhanceQuality] = useState(false);
  const [enhanceResolution, setEnhanceResolution] = useState<'Original' | 'HD' | 'FHD' | '2K' | '4K'>('Original');

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = aspect ? centerAspectCrop(width, height, aspect) : centerCrop(
      { unit: '%', width: 90, height: 90 }, width, height
    );
    setCrop(initialCrop);
  }

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current) {
      if (newAspect) {
        setCrop(centerAspectCrop(imgRef.current.width, imgRef.current.height, newAspect));
      } else {
        const initialCrop = centerCrop(
          { unit: '%', width: 90, height: 90 }, imgRef.current.width, imgRef.current.height
        );
        setCrop(initialCrop);
      }
    }
  };

  const handleRotate = (deg: number) => {
    setRotation((prev) => (prev + deg) % 360);
  };

  const handleSave = async () => {
    if (!imgRef.current) return;
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    // Determine scale based on the original image vs displayed size
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    // PixelCrop uses actual image coordinates if we pass them, but react-image-crop usually returns them relative to displayed
    const cropX = completedCrop?.x || 0;
    const cropY = completedCrop?.y || 0;
    const cropWidth = completedCrop?.width || image.width;
    const cropHeight = completedCrop?.height || image.height;

    // Output canvas size based on rotation
    const isRotated90 = Math.abs(rotation) % 180 === 90;
    
    // Scale factor for enhancement based on target resolution
    const baseW = isRotated90 ? cropHeight * scaleY : cropWidth * scaleX;
    const baseH = isRotated90 ? cropWidth * scaleX : cropHeight * scaleY;
    
    let enhanceScale = 1.0;
    if (enhanceResolution !== 'Original') {
      const maxDim = Math.max(baseW, baseH);
      let targetMax = maxDim;
      if (enhanceResolution === 'HD') targetMax = 1280;
      else if (enhanceResolution === 'FHD') targetMax = 1920;
      else if (enhanceResolution === '2K') targetMax = 2560;
      else if (enhanceResolution === '4K') targetMax = 3840;
      
      if (targetMax > maxDim) {
        enhanceScale = targetMax / maxDim;
      }
    } else if (enhanceQuality) {
       enhanceScale = 1.0; // Quality only, no rescale, or maybe bump it slightly
    }

    canvas.width = baseW * enhanceScale;
    canvas.height = baseH * enhanceScale;

    if (enhanceQuality) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.filter = `brightness(${brightness * 1.05}%) contrast(${contrast * 1.15}%) saturate(${saturation * 1.15}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
    } else {
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
    }

    ctx.scale(enhanceScale, enhanceScale);
    ctx.translate(baseW / 2, baseH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    // Draw text overlay if present
    if (textOverlay) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform for text
      ctx.scale(enhanceScale, enhanceScale);
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      const tx = (baseW * textX) / 100;
      const ty = (baseH * textY) / 100;
      
      // Shadow for readability
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillText(textOverlay, tx, ty);
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    // Now slice out the cropped area using a second canvas
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    if (!cropCtx) return;

    cropCanvas.width = (isRotated90 ? cropHeight * scaleY : cropWidth * scaleX) * enhanceScale;
    cropCanvas.height = (isRotated90 ? cropWidth * scaleX : cropHeight * scaleY) * enhanceScale;

    // We draw from the first canvas into the second using crop coordinates
    const fullCanvas = document.createElement('canvas');
    const fullCtx = fullCanvas.getContext('2d');
    if(!fullCtx) return;

    const bBoxWidth = isRotated90 ? image.naturalHeight : image.naturalWidth;
    const bBoxHeight = isRotated90 ? image.naturalWidth : image.naturalHeight;
    fullCanvas.width = bBoxWidth * enhanceScale;
    fullCanvas.height = bBoxHeight * enhanceScale;

    if (enhanceQuality) {
      fullCtx.imageSmoothingEnabled = true;
      fullCtx.imageSmoothingQuality = 'high';
      fullCtx.filter = `brightness(${brightness * 1.05}%) contrast(${contrast * 1.15}%) saturate(${saturation * 1.15}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
    } else {
      fullCtx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`;
    }

    fullCtx.scale(enhanceScale, enhanceScale);
    fullCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    fullCtx.rotate((rotation * Math.PI) / 180);
    fullCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
    fullCtx.drawImage(image, 0, 0);

    if (textOverlay) {
      fullCtx.setTransform(1, 0, 0, 1, 0, 0);
      fullCtx.scale(enhanceScale, enhanceScale);
      fullCtx.font = `bold ${fontSize}px sans-serif`;
      fullCtx.fillStyle = textColor;
      fullCtx.textAlign = 'center';
      const tx = (bBoxWidth * textX) / 100;
      const ty = (bBoxHeight * textY) / 100;
      fullCtx.shadowColor = 'rgba(0,0,0,0.5)';
      fullCtx.shadowBlur = 4;
      fullCtx.shadowOffsetX = 2;
      fullCtx.shadowOffsetY = 2;
      fullCtx.fillText(textOverlay, tx, ty);
    }

    // 2. Crop from the full unscaled canvas using scaled crop coordinates
    cropCanvas.width = cropWidth * scaleX * enhanceScale;
    cropCanvas.height = cropHeight * scaleY * enhanceScale;
    cropCtx.drawImage(
      fullCanvas,
      cropX * scaleX * enhanceScale,
      cropY * scaleY * enhanceScale,
      cropWidth * scaleX * enhanceScale,
      cropHeight * scaleY * enhanceScale,
      0,
      0,
      cropWidth * scaleX * enhanceScale,
      cropHeight * scaleY * enhanceScale
    );

    const exportQuality = enhanceQuality ? 1.0 : 0.95;

    cropCanvas.toBlob((blob) => {
      if (blob) {
        const previewUrl = URL.createObjectURL(blob);
        onSave(blob, previewUrl, localMeta, fileName);
      }
    }, 'image/jpeg', exportQuality);
  };

  if (!file) return null;
  
  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setSepia(0);
    setBlur(0);
    setHueRotate(0);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-none sm:rounded-2xl w-full max-w-7xl flex flex-col h-full sm:h-auto sm:max-h-[95vh] overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <h3 className="text-xl font-bold text-slate-800">{d.editCropImage || "Edit & Crop Image"}</h3>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden bg-slate-100">
          <div className={`flex-grow p-4 md:p-6 flex items-center justify-center relative overflow-hidden ${mobileTab === 'seo' ? 'hidden md:flex' : 'flex'}`}>
            {imgSrc && (
              <div className="relative">
                <ReactCrop
                  crop={crop}
                  aspect={aspect}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imgSrc}
                    style={{ 
                      transform: `rotate(${rotation}deg)`, 
                      maxHeight: mobileTab === 'edit' ? '40vh' : '60vh', 
                      transition: 'transform 0.2s',
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) hue-rotate(${hueRotate}deg)`
                    }}
                    className="md:max-h-[60vh]"
                    onLoad={onImageLoad}
                  />
                </ReactCrop>
                {textOverlay && (
                  <div 
                    className="absolute pointer-events-none select-none text-center font-bold"
                    style={{
                      left: `${textX}%`,
                      top: `${textY}%`,
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                      transform: 'translate(-50%, -50%)',
                      maxWidth: '80%',
                      zIndex: 20
                    }}
                  >
                    {textOverlay}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Metadata Panel or Mobile Metadata View */}
          <div className={`${mobileTab === 'seo' ? 'flex' : 'hidden md:flex'} w-full md:w-[480px] bg-white border-l border-slate-200 flex flex-col overflow-hidden`}>
             <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between sticky top-0 z-10 shrink-0">
               <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                 <Info className="w-4 h-4 text-blue-500" /> {d.individualSeoMeta || "Individual SEO Meta"}
               </h4>
               <div className="flex items-center gap-2">
                 <button 
                   onClick={handleAiSuggest}
                   disabled={isGeneratingAi}
                   className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-blue-100 transition-colors disabled:opacity-50 font-bold border border-blue-100"
                 >
                   <Wand2 className={`w-3 h-3 ${isGeneratingAi ? 'animate-pulse' : ''}`} />
                   {isGeneratingAi ? '...' : currentLabels.aiSuggest}
                 </button>
               </div>
             </div>
             
             <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/30">
                 <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3 text-slate-400" /> {currentLabels.fileName}
                      </label>
                      <input 
                        type="text" 
                        value={fileName} 
                        onChange={(e) => setFileName(e.target.value)}
                       placeholder={currentLabels.fileNamePlaceholder || "image-name.jpg"}
                        className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      />
                  </div>

                  <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                        {currentLabels.language}
                      </label>
                      <select 
                        value={localMeta.language || 'en'} 
                        onChange={(e) => handleMetaChange('language', e.target.value)}
                        className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all cursor-pointer"
                      >
                        <option value="en">English (US/UK)</option>
                        <option value="de">Deutsch (German)</option>
                        <option value="fr">Français (French)</option>
                        <option value="es">Español (Spanish)</option>
                        <option value="it">Italiano (Italian)</option>
                        <option value="pt">Português (Portuguese)</option>
                        <option value="tr">Türkçe (Turkish)</option>
                        <option value="ar">العربية (Arabic)</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="ur">اردو (Urdu)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="ja">日本語 (Japanese)</option>
                        <option value="zh">中文 (Chinese)</option>
                      </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                      {currentLabels.businessType}
                    </label>
                    <select 
                      value={localMeta.businessType || 'general'} 
                      onChange={(e) => handleMetaChange('businessType', e.target.value)}
                      className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition-all cursor-pointer"
                    >
                      <option value="general">General Business</option>
                      <option disabled>--- Rank & Rent / Local SEO ---</option>
                      <option value="tree_service">Tree Service / Arborist</option>
                      <option value="towing">Towing Service</option>
                      <option value="pest_control">Pest Control</option>
                      <option value="concrete">Concrete & Epoxy</option>
                      <option value="fencing">Fencing Contractors</option>
                      <option value="locksmith">Locksmith</option>
                      <option value="junk_removal">Junk Removal</option>
                      <option value="remediation">Water Damage / Mold</option>
                      <option value="painting">Painting Services</option>
                      <option value="electrician">Electrician</option>
                      <option value="roofing">Roofing Contractors</option>
                      <option value="hvac">HVAC / Air Conditioning</option>
                      <option value="plumber">Plumber</option>
                      <option value="flooring">Flooring Contractor</option>
                      <option value="siding">Siding & Gutters</option>
                      <option value="pool_service">Pool Cleaning & Service</option>
                      <option value="garage_door">Garage Door Repair</option>
                      <option value="solar">Solar Energy Installer</option>
                      <option value="appliance_repair">Appliance Repair</option>
                      <option value="window_cleaning">Window Cleaning</option>
                      <option value="foundation_repair">Foundation Repair</option>
                      <option value="duct_cleaning">Air Duct Cleaning</option>
                      <option value="landscaping">Landscaping & Lawn Care</option>
                      <option disabled>--- Local Trades & Services ---</option>
                      <option value="automotive">Automotive Repair</option>
                      <option value="welding">Welding & Metal Fab</option>
                      <option value="carpentry">Carpentry & Woodwork</option>
                      <option value="masonry">Masonry & Brickwork</option>
                      <option value="insulation">Insulation Contractor</option>
                      <option value="drywall">Drywall & Plastering</option>
                      <option value="excavation">Excavation & Grading</option>
                      <option value="handyman">Handyman Services</option>
                      <option value="pressure_washing">Pressure Washing</option>
                      <option value="janitorial">Janitorial Services</option>
                      <option value="security_systems">Security Systems</option>
                      <option disabled>--- Hospitality & Retail ---</option>
                      <option value="hotel">Hotel / Stays</option>
                      <option value="restaurant">Restaurant / Cafe</option>
                      <option value="bar">Bar / Pub</option>
                      <option value="salon">Salon & Spa</option>
                      <option value="fitness">Gym & Fitness</option>
                      <option value="ecommerce">E-Commerce</option>
                      <option value="coffee_shop">Coffee Shop</option>
                      <option value="bakery">Bakery</option>
                      <option value="retail_clothing">Clothing Store</option>
                      <option value="grocery">Grocery Store</option>
                      <option value="pet_grooming">Pet Grooming</option>
                      <option value="veterinary">Veterinary Clinic</option>
                      <option value="flower_shop">Florist</option>
                      <option value="boutique">Boutique Store</option>
                      <option disabled>--- Professional & Medical ---</option>
                      <option value="real_estate">Real Estate</option>
                      <option value="healthcare">Medical Clinic</option>
                      <option value="dentist">Dental Clinic</option>
                      <option value="legal">Law Firm</option>
                      <option value="accounting">Accounting Services</option>
                      <option value="marketing">Digital Marketing</option>
                      <option value="tech_support">IT Support</option>
                      <option value="chiropractor">Chiropractor</option>
                      <option value="optometry">Optometry / Eyewear</option>
                      <option value="pharmacy">Pharmacy</option>
                      <option value="insurance">Insurance Agency</option>
                      <option value="travel_agency">Travel Agency</option>
                      <option value="architecture">Architect</option>
                      <option value="engineering">Engineering Firm</option>
                      <option disabled>--- Creative & Luxury ---</option>
                      <option value="photographer">Photography</option>
                      <option value="event_planning">Event Planning</option>
                      <option value="jewelry">Luxury Jewelry</option>
                      <option value="fashion">Fashion Boutique</option>
                      <option value="interior_design">Interior Design</option>
                      <option value="art_gallery">Art Gallery</option>
                      <option value="tatoo_studio">Tattoo Studio</option>
                      <option value="luxury_cars">Exotic Car Rental</option>
                      <option disabled>--- Automotive & Transport ---</option>
                      <option value="car_wash">Car Wash & Detailing</option>
                      <option value="car_rental">Car Rental</option>
                      <option value="tire_shop">Tire & Wheel Shop</option>
                      <option value="trucking">Trucking & Logistics</option>
                      <option value="moving_company">Moving Company</option>
                      <option value="auto_glass">Auto Glass Repair</option>
                      <option value="boat_repair">Boat & Marine Repair</option>
                      <option value="taxi_service">Taxi & Limo Service</option>
                      <option disabled>--- Industrial & Logistics ---</option>
                      <option value="construction">General Construction</option>
                      <option value="manufacturing">Manufacturing Plant</option>
                      <option value="logistics">Logistics & Freight</option>
                      <option value="warehouse">Warehousing Facility</option>
                      <option value="waste_management">Waste & Recycling</option>
                      <option value="security">Security Services</option>
                      <option value="oil_gas">Oil & Gas Services</option>
                      <option disabled>--- Social & Public ---</option>
                      <option value="education">School / University</option>
                      <option value="church">Place of Worship</option>
                      <option value="community_center">Community Center</option>
                      <option value="charity">Non-profit / Charity</option>
                      <option value="government">Government Office</option>
                      <option value="library">Public Library</option>
                    </select>
                  </div>

                 <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                       <Type className="w-3 h-3 text-slate-400" /> {currentLabels.businessName}
                     </label>
                     <input 
                       type="text" 
                       value={localMeta.businessName || ''} 
                       onChange={(e) => handleMetaChange('businessName', e.target.value)}
                       placeholder={currentLabels.businessNamePlaceholder}
                       className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                     />
                  </div>
 
                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                       <Wand2 className="w-3 h-3 text-slate-400" /> {currentLabels.websiteUrl}
                     </label>
                     <input 
                       type="text" 
                       value={localMeta.websiteUrl || ''} 
                       onChange={(e) => handleMetaChange('websiteUrl', e.target.value)}
                       placeholder={currentLabels.websitePlaceholder}
                       className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                     />
                  </div>
                 </div>

                 <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                       <Type className="w-3 h-3 text-slate-400" /> {currentLabels.imageTitle}
                     </label>
                     <input 
                       type="text" 
                       value={localMeta.title || ''} 
                       onChange={(e) => handleMetaChange('title', e.target.value)}
                       placeholder={currentLabels.imageTitlePlaceholder}
                       className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                       <Tag className="w-3 h-3 text-slate-400" /> {currentLabels.serviceDescription}
                     </label>
                     <textarea 
                       rows={3}
                       value={localMeta.description || ''} 
                       onChange={(e) => handleMetaChange('description', e.target.value)}
                       placeholder={currentLabels.serviceDescriptionPlaceholder}
                       className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none"
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                       <FileText className="w-3 h-3 text-slate-400" /> {currentLabels.keywordsTags}
                     </label>
                     <input 
                       type="text" 
                       value={localMeta.keywords || ''} 
                       onChange={(e) => handleMetaChange('keywords', e.target.value)}
                       placeholder={currentLabels.keywordsPlaceholder}
                       className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                     />
                  </div>

                  <div>
                     <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1.5">
                       <ImageIcon className="w-3 h-3 text-slate-400" /> {currentLabels.altText}
                     </label>
                     <input 
                       type="text" 
                       value={localMeta.suggestedAltText || ''} 
                       onChange={(e) => handleMetaChange('suggestedAltText', e.target.value)}
                       placeholder={currentLabels.altTextPlaceholder}
                       className="w-full text-xs font-medium border border-slate-200 rounded-lg px-2.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                     />
                  </div>

                  </div>
 
                  <div className="pt-2 px-1 text-center">
                    <p className="text-[10px] text-blue-600 font-bold leading-tight uppercase tracking-widest">
                      {currentLabels.priorityNote}
                    </p>
                  </div>
              </div>
          </div>
        </div>
      </div>
 
      <div className="p-4 border-t border-slate-200 bg-white flex flex-col items-stretch gap-4 w-full">
          <div className="flex flex-col gap-4">
            {/* View Switcher for Mobile only */}
            <div className="flex md:hidden bg-slate-100 p-1.5 rounded-xl w-full mb-1">
              <button 
                onClick={() => setMobileTab('edit')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${mobileTab === 'edit' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ImageIcon className="w-4 h-4" /> {d.editingTools || "Editing Tools"}
              </button>
              <button 
                onClick={() => setMobileTab('seo')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-lg transition-all ${mobileTab === 'seo' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Info className="w-4 h-4" /> {d.seoMetadata || "SEO Metadata"}
              </button>
            </div>
 
            {/* Editing Tools Tabs (visible if on editor tab on mobile, or always on desktop) */}
            <div className={`${mobileTab === 'edit' ? 'flex' : 'hidden md:flex'} items-center gap-2`}>
               <div className="md:hidden flex-grow group relative">
                 <select 
                   value={activeTab} 
                   onChange={(e) => setActiveTab(e.target.value as any)}
                   className="w-full bg-slate-100 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-700 outline-none border-none appearance-none cursor-pointer"
                 >
                   <option value="transform">{d.transformLabel || "Transform / Crop"}</option>
                   <option value="filters">{d.filtersLabel || "Filters & Color"}</option>
                   <option value="text">{d.textLabel || "Add Text Overlay"}</option>
                 </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                 </div>
               </div>
 
               <div className="hidden md:flex bg-slate-100 p-1 rounded-lg w-fit">
                 <button 
                   onClick={() => setActiveTab('transform')}
                   className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'transform' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   {d.transform || "Transform"}
                 </button>
                 <button 
                   onClick={() => setActiveTab('filters')}
                   className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'filters' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   {d.filters || "Filters"}
                 </button>
                 <button 
                   onClick={() => setActiveTab('text')}
                   className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'text' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                   {d.text || "Text"}
                 </button>
               </div>
            </div>
 
            {activeTab === 'transform' && mobileTab === 'edit' && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-1">{d.aspectRatio || "Aspect Ratio"}</span>
                <div className="flex overflow-x-auto pb-2 shrink-0 bg-slate-50 sm:bg-slate-100 rounded-lg p-1 gap-1 no-scrollbar">
                  <button
                    onClick={() => handleAspectChange(undefined)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors shrink-0 ${!aspect ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                  >
                    {d.cropFree || "Free"}
                  </button>
                  {[ [1, '1:1'], [4/3, '4:3'], [3/4, '3:4'], [16/9, '16:9'], [9/16, '9:16'], [3/2, '3:2'], [2/3, '2:3'], [5/4, '5:4'], [4/5, '4:5'] ].map(([val, label]) => (
                    <button
                      key={label as string}
                      onClick={() => handleAspectChange(val as number)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors shrink-0 ${aspect === val ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                    >
                      {label as string}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'filters' && mobileTab === 'edit' && (
              <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-xl">
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1 flex justify-between">
                       {d.brightness || "Brightness"} <span>{brightness}%</span>
                     </label>
                     <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1 flex justify-between">
                       {d.contrast || "Contrast"} <span>{contrast}%</span>
                     </label>
                     <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1 flex justify-between">
                       {d.saturation || "Saturation"} <span>{saturation}%</span>
                     </label>
                     <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1 flex justify-between">
                       {d.grayscale || "Grayscale"} <span>{grayscale}%</span>
                     </label>
                     <input type="range" min="0" max="100" value={grayscale} onChange={(e) => setGrayscale(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1 flex justify-between">
                       {d.sepia || "Sepia"} <span>{sepia}%</span>
                     </label>
                     <input type="range" min="0" max="100" value={sepia} onChange={(e) => setSepia(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1 flex justify-between">
                       {d.blur || "Blur"} <span>{blur}px</span>
                     </label>
                     <input type="range" min="0" max="10" step="0.1" value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-bold text-slate-500 uppercase px-1 flex justify-between">
                       {d.hueRotate || "Hue Rotate"} <span>{hueRotate}°</span>
                     </label>
                     <input type="range" min="0" max="360" value={hueRotate} onChange={(e) => setHueRotate(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                   </div>
                   <div className="flex items-end">
                      <button onClick={resetFilters} className="text-[10px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg w-full transition-colors">
                        {d.resetFilters || "RESET FILTERS"}
                      </button>
                   </div>
                 </div>
              </div>
            )}

            {activeTab === 'text' && mobileTab === 'edit' && (
              <div className="flex flex-col md:flex-row gap-4 bg-slate-50 p-3 rounded-xl items-start md:items-center">
                 <div className="flex-grow w-full">
                  <label className="text-[10px] font-bold text-slate-500 uppercase px-1 mb-1 block">{d.overlayText || "Overlay Text"}</label>
                  <input 
                    type="text" 
                    value={textOverlay} 
                    onChange={(e) => setTextOverlay(e.target.value)} 
                    placeholder={d.textOnImagePlaceholder || "Enter text on image..."}
                    className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div className="flex gap-4 shrink-0 overflow-x-auto no-scrollbar pb-1 w-full md:w-auto">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1 block">{d.color || "Color"}</label>
                    <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer border-none p-0 bg-transparent" />
                  </div>
                  <div className="space-y-1 min-w-[100px]">
                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1 block">{d.size || "Size"}: {fontSize}px</label>
                    <input type="range" min="10" max="100" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div className="space-y-1 min-w-[100px]">
                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1 block">{d.position || "Position"} X: {textX}%</label>
                    <input type="range" min="0" max="100" value={textX} onChange={(e) => setTextX(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                  <div className="space-y-1 min-w-[100px]">
                    <label className="text-[10px] font-bold text-slate-500 uppercase px-1 block">{d.position || "Position"} Y: {textY}%</label>
                    <input type="range" min="0" max="100" value={textY} onChange={(e) => setTextY(parseInt(e.target.value))} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
              </div>
            )}
            
            <div className={`flex gap-3 items-center flex-wrap justify-between ${mobileTab === 'edit' ? 'flex' : 'hidden md:flex'} mt-auto`}>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 pr-2 shadow-inner">
                   <button onClick={() => setEnhanceQuality(!enhanceQuality)} className={`p-1.5 px-3 rounded-md flex items-center gap-2 text-[10px] font-bold transition-all ${enhanceQuality ? 'bg-white shadow-sm text-blue-600 translate-y-[-1px]' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'}`}>
                     <Wand2 className="w-3.5 h-3.5" /> {d.enhanceQuality || "Enhance"}
                   </button>
                   <select 
                      value={enhanceResolution} 
                      onChange={(e) => setEnhanceResolution(e.target.value as any)}
                      className="text-[10px] bg-transparent font-bold border-l border-slate-300 pl-2 ml-1 outline-none text-slate-700 cursor-pointer uppercase tracking-tight"
                   >
                      <option value="Original">{d.originalRes || "Original Res"}</option>
                      <option value="HD">{d.hdRes || "HD (720p)"}</option>
                      <option value="FHD">{d.fhdRes || "1K / FHD"}</option>
                      <option value="2K">2K / QHD</option>
                      <option value="4K">4K / UHD</option>
                   </select>
                </div>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
                
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button title={d.rotateLeft || "Rotate Left"} onClick={() => handleRotate(-90)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-md flex items-center transition-all bg-transparent">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button title={d.rotateRight || "Rotate Right"} onClick={() => handleRotate(90)} className="p-2 text-slate-600 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded-md flex items-center transition-all bg-transparent">
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={onClose} className="px-4 py-2.5 text-slate-600 font-bold text-xs hover:bg-slate-100 rounded-xl transition-all flex-grow sm:flex-grow-0 active:scale-95">
                  {d.cancel || "Cancel"}
                </button>
                <button onClick={handleSave} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex-grow sm:flex-grow-0 justify-center">
                  <Check className="w-4 h-4" /> {(d.applyEdits || "APPLY EDITS").toUpperCase()}
                </button>
              </div>
            </div>

            {mobileTab === 'seo' && (
               <div className="flex md:hidden gap-2 items-center justify-between pt-2">
                 <button onClick={() => setMobileTab('edit')} className="px-4 py-2.5 text-blue-600 font-bold text-xs bg-blue-50 rounded-xl transition-all flex-grow text-center active:scale-95 border border-blue-100">
                   {d.goBackToEditor || "Go Back to Editor"}
                 </button>
                 <button onClick={handleSave} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-bold text-xs hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex-grow justify-center">
                   <Check className="w-4 h-4" /> {(d.applyEdits || "APPLY EDITS").toUpperCase()}
                 </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
