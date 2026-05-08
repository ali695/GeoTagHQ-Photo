'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCcw, RotateCw, Check, Wand2, Info, Tag, FileText, Type, Image as ImageIcon } from 'lucide-react';
import { ImageFile, ImageMetadata } from '@/types/image';
import { generateSeoMetadata } from '@/lib/gemini';

interface ImageEditorModalProps {
  file: ImageFile | null;
  onClose: () => void;
  onSave: (editedBlob: Blob, previewUrl: string, metadata?: Partial<ImageMetadata>) => void;
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Metadata overrides state
  const [localMeta, setLocalMeta] = useState<Partial<ImageMetadata>>({});
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleAiSuggest = async () => {
    setIsGeneratingAi(true);
    try {
      const data = await generateSeoMetadata({
        businessName: localMeta.businessName || globalMetadata.businessName,
        serviceCategory: localMeta.serviceCategory || globalMetadata.serviceCategory,
        city: globalMetadata.city,
        country: globalMetadata.country,
        businessType: localMeta.businessType || 'general',
        language: 'en' // Default or passed prop
      });

      if (data) {
        setLocalMeta(prev => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          suggestedAltText: data.suggestedAltText || prev.suggestedAltText,
          keywords: data.keywords || prev.keywords
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMeta({
        title: file.metadata.title || '',
        description: file.metadata.description || '',
        keywords: file.metadata.keywords || '',
        serviceCategory: file.metadata.serviceCategory || '',
        suggestedAltText: file.metadata.suggestedAltText || '',
        businessName: file.metadata.businessName || '',
        websiteUrl: file.metadata.websiteUrl || '',
        businessType: file.metadata.businessType || 'general',
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
      ctx.filter = 'contrast(1.05) saturate(1.05) sharpen(1)'; // Basic enhancement
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
      fullCtx.filter = 'contrast(1.05) saturate(1.1) brightness(1.02)';
    }

    fullCtx.scale(enhanceScale, enhanceScale);
    fullCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    fullCtx.rotate((rotation * Math.PI) / 180);
    fullCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
    fullCtx.drawImage(image, 0, 0);

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
        onSave(blob, previewUrl, localMeta);
      }
    }, 'image/jpeg', exportQuality);
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-semibold text-slate-800">{d.editCropImage || "Edit & Crop Image"}</h3>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow p-6 flex flex-col md:flex-row items-center md:items-stretch justify-center overflow-auto bg-slate-100 gap-6">
          <div className="flex-grow flex items-center justify-center min-h-[300px]">
            {imgSrc && (
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
                  style={{ transform: `rotate(${rotation}deg)`, maxHeight: '60vh', transition: 'transform 0.2s' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            )}
          </div>

          <div className="w-full md:w-80 bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-y-auto">
             <div className="flex items-center justify-between mb-4">
               <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                 <Info className="w-4 h-4 text-blue-500" /> Individual SEO Meta
               </h4>
               <button 
                 onClick={handleAiSuggest}
                 disabled={isGeneratingAi}
                 className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-100 transition-colors disabled:opacity-50"
               >
                 <Wand2 className={`w-3 h-3 ${isGeneratingAi ? 'animate-pulse' : ''}`} />
                 {isGeneratingAi ? '...' : 'Suggest'}
               </button>
             </div>
             
             <div className="space-y-4">
                 <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                      <Tag className="w-3 h-3" /> Business Type Preset
                    </label>
                    <select 
                      value={localMeta.businessType || 'general'} 
                      onChange={(e) => handleMetaChange('businessType', e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded-md px-2 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                      <option value="pest_control">Pest Control</option>
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
                      <option value="architect">Architecture Firm</option>
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

                <div>
                   <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                     <Type className="w-3 h-3" /> Business Name
                   </label>
                   <input 
                     type="text" 
                     value={localMeta.businessName || ''} 
                     onChange={(e) => handleMetaChange('businessName', e.target.value)}
                     placeholder="Your Company Name"
                     className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                   />
                </div>

                <div>
                   <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                     <Wand2 className="w-3 h-3" /> Website URL
                   </label>
                   <input 
                     type="text" 
                     value={localMeta.websiteUrl || ''} 
                     onChange={(e) => handleMetaChange('websiteUrl', e.target.value)}
                     placeholder="https://example.com"
                     className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                   />
                </div>

                <div>
                   <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                     <Type className="w-3 h-3" /> Service Category
                   </label>
                   <input 
                     type="text" 
                     value={localMeta.serviceCategory || ''} 
                     onChange={(e) => handleMetaChange('serviceCategory', e.target.value)}
                     placeholder="e.g. Roofing Contractors"
                     className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                   />
                </div>

                <div>
                   <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                     <Type className="w-3 h-3" /> Image Title
                   </label>
                   <input 
                     type="text" 
                     value={localMeta.title || ''} 
                     onChange={(e) => handleMetaChange('title', e.target.value)}
                     placeholder="e.g. Roof Repair Service"
                     className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                   />
                </div>

                <div>
                   <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                     <Tag className="w-3 h-3" /> Service / Description
                   </label>
                   <textarea 
                     rows={3}
                     value={localMeta.description || ''} 
                     onChange={(e) => handleMetaChange('description', e.target.value)}
                     placeholder="e.g. Professional roof repair and maintenance..."
                     className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                   />
                </div>

                <div>
                   <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                     <FileText className="w-3 h-3" /> Keywords / Tags
                   </label>
                   <input 
                     type="text" 
                     value={localMeta.keywords || ''} 
                     onChange={(e) => handleMetaChange('keywords', e.target.value)}
                     placeholder="roofing, repair, local"
                     className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                   />
                </div>

                <div>
                   <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1.5">
                     <ImageIcon className="w-3 h-3" /> Alt Text
                   </label>
                   <input 
                     type="text" 
                     value={localMeta.suggestedAltText || ''} 
                     onChange={(e) => handleMetaChange('suggestedAltText', e.target.value)}
                     placeholder="Image description for accessibility"
                     className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                   />
                </div>

                <div className="pt-2">
                  <p className="text-[10px] text-slate-500 leading-tight italic">
                    Note: These values will override global settings only for this image.
                  </p>
                </div>
             </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row gap-4 justify-between items-center w-full">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="flex flex-wrap bg-slate-100 rounded-lg p-1 gap-1">
                <button
                  onClick={() => handleAspectChange(undefined)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!aspect ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  {d.cropFree || "Free"}
                </button>
                <button
                  onClick={() => handleAspectChange(1)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 1 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  1:1
                </button>
                <button
                  onClick={() => handleAspectChange(4/3)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 4/3 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  4:3
                </button>
                <button
                  onClick={() => handleAspectChange(3/4)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 3/4 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  3:4
                </button>
                <button
                  onClick={() => handleAspectChange(16/9)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 16/9 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  16:9
                </button>
                <button
                  onClick={() => handleAspectChange(9/16)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 9/16 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  9:16
                </button>
                <button
                  onClick={() => handleAspectChange(3/2)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 3/2 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  3:2
                </button>
                <button
                  onClick={() => handleAspectChange(2/3)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 2/3 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  2:3
                </button>
                <button
                  onClick={() => handleAspectChange(5/4)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 5/4 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  5:4
                </button>
                <button
                  onClick={() => handleAspectChange(4/5)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${aspect === 4/5 ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  4:5
                </button>
              </div>
            </div>
            
            <div className="flex gap-2 items-center flex-wrap">
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 pr-2">
                 <button onClick={() => setEnhanceQuality(!enhanceQuality)} className={`p-1.5 px-3 rounded-md flex items-center gap-2 text-sm font-medium transition-colors ${enhanceQuality ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'}`}>
                   <Wand2 className="w-4 h-4" /> Enhance
                 </button>
                 <select 
                    value={enhanceResolution} 
                    onChange={(e) => setEnhanceResolution(e.target.value as any)}
                    className="text-xs bg-transparent font-medium border-l border-slate-300 pl-2 ml-1 outline-none text-slate-700 cursor-pointer"
                 >
                    <option value="Original">Original Res</option>
                    <option value="HD">HD (720p)</option>
                    <option value="FHD">1K / FHD (1080p)</option>
                    <option value="2K">2K / QHD</option>
                    <option value="4K">4K / UHD</option>
                 </select>
              </div>
              <button title="Rotate Left" onClick={() => handleRotate(-90)} className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button title="Rotate Right" onClick={() => handleRotate(90)} className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-2 font-medium transition-colors">
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center">
            <Check className="w-5 h-5" /> {d.applyEdits || "Apply Edits"}
          </button>
        </div>
      </div>
    </div>
  );
}
