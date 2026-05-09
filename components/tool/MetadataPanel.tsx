'use client';

import { useState, useEffect } from 'react';
import { ImageMetadata } from '@/types/image';
import { Camera, Calendar, HardDrive, FileType, Map, Wand2, Copy, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { generateSeoMetadata } from '@/lib/gemini';
import { UI_LABELS } from '@/lib/constants';

interface MetadataPanelProps {
  metadata?: ImageMetadata;
  onMetadataChange?: (changes: Partial<ImageMetadata>) => void;
  d?: any;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MetadataPanel({ metadata, onMetadataChange, d = {} }: MetadataPanelProps) {
  const [copied, setCopied] = useState(false);
  const [editState, setEditState] = useState<Partial<ImageMetadata>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [seoLang, setSeoLang] = useState('en');
  const [businessType, setBusinessType] = useState('general');

  const getLocationLabels = (country?: string) => {
    const c = country?.toLowerCase().trim() || '';
    
    // USA
    if (c === 'usa' || c === 'united states' || c === 'united states of america' || c === 'us') {
      return { state: d.stateLabel || 'State', postal: d.zipCodeLabel || 'ZIP Code', district: 'Neighborhood / Area' };
    }
    // UK
    if (c === 'united kingdom' || c === 'uk' || c === 'britain' || c === 'england' || c === 'scotland' || c === 'wales') {
      return { state: d.countyLabel || 'County', postal: d.postcodeLabel || 'Postcode', district: 'Borough' };
    }
    // Canada
    if (c === 'canada' || c === 'ca') {
      return { state: d.provinceLabel || 'Province', postal: d.postalCodeLabel || 'Postal Code', district: 'Neighborhood' };
    }
    // Australia
    if (c === 'australia' || c === 'au') {
      return { state: d.stateLabel || 'State', postal: d.postcodeLabel || 'Postcode', district: 'Suburb' };
    }
    // Germany
    if (c === 'germany' || c === 'deutschland' || c === 'de') {
      return { state: d.bundeslandLabel || 'State / Bundesland', postal: d.plzLabel || 'Postleitzahl (PLZ)', district: 'Bezirk' };
    }
    // France
    if (c === 'france' || c === 'fr') {
      return { state: d.stateRegionLabel || 'Region / Department', postal: d.postalCodeLabel || 'Code Postal', district: 'Arrondissement' };
    }
    // India
    if (c === 'india' || c === 'in') {
      return { state: d.stateLabel || 'State', postal: d.postalCodeLabel || 'PIN Code', district: 'Locality / Area' };
    }
    // Pakistan
    if (c === 'pakistan' || c === 'pk') {
      return { state: d.stateLabel || 'Province / State', postal: d.postalCodeLabel || 'Zip / Postal Code', district: 'Area / Sector' };
    }

    return { state: d.stateRegionLabel || 'State / Region', postal: d.postalCodeLabel || 'Postal Code', district: 'District / Area' };
  };

  const currentLabels = UI_LABELS[seoLang] || UI_LABELS.en;
  const labels = getLocationLabels(editState.country);

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
        language: metadata.language || 'en',
      });
      setSeoLang(metadata.language || 'en');
    }
  }, [metadata]);

  const handleChange = (field: keyof ImageMetadata, value: string) => {
    const newState = { ...editState, [field]: value };
    setEditState(newState);
    if (onMetadataChange) {
      onMetadataChange(newState);
    }

    if (field === 'serviceCategory') {
      const lower = value.toLowerCase();
      if (lower.includes('plumb')) setBusinessType('plumber');
      else if (lower.includes('roof')) setBusinessType('roofing');
      else if (lower.includes('hvac') || lower.includes('heating') || lower.includes('air cond')) setBusinessType('hvac');
      else if (lower.includes('clean') || lower.includes('maid')) setBusinessType('cleaning');
      else if (lower.includes('landscap') || lower.includes('lawn') || lower.includes('garden')) setBusinessType('landscaping');
      else if (lower.includes('auto') || lower.includes('car repair') || lower.includes('mechanic')) setBusinessType('automotive');
      else if (lower.includes('hotel') || lower.includes('motel') || lower.includes('hostel')) setBusinessType('hotel');
      else if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food')) setBusinessType('restaurant');
      else if (lower.includes('salon') || lower.includes('spa') || lower.includes('hair') || lower.includes('barber')) setBusinessType('salon');
      else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('yoga')) setBusinessType('fitness');
      else if (lower.includes('real estate') || lower.includes('realtor')) setBusinessType('real_estate');
      else if (lower.includes('dentist') || lower.includes('dental')) setBusinessType('dentist');
      else if (lower.includes('law') || lower.includes('legal') || lower.includes('attorney')) setBusinessType('legal');
      else if (lower.includes('account') || lower.includes('cpa') || lower.includes('tax')) setBusinessType('accounting');
      else if (lower.includes('tree')) setBusinessType('tree_service');
      else if (lower.includes('pest')) setBusinessType('pest_control');
      else if (lower.includes('tow')) setBusinessType('towing');
      else if (lower.includes('locksmith')) setBusinessType('locksmith');
      else if (lower.includes('junk')) setBusinessType('junk_removal');
      else if (lower.includes('fence') || lower.includes('fencing')) setBusinessType('fencing');
      else if (lower.includes('concrete') || lower.includes('epoxy')) setBusinessType('concrete');
      else if (lower.includes('mold') || lower.includes('water damag')) setBusinessType('remediation');
      else if (lower.includes('paint')) setBusinessType('painting');
      else if (lower.includes('electrician') || lower.includes('electrical')) setBusinessType('electrician');
    }
  };

  const handlePresetChange = (type: string) => {
    setBusinessType(type);
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

    if (type !== 'general' && presetToCategory[type]) {
      handleChange('serviceCategory', presetToCategory[type]);
    }
  };

  const handleGenerateSEO = async () => {
    setIsGenerating(true);
    try {
      const data = await generateSeoMetadata({
        businessName: editState.businessName,
        serviceCategory: editState.serviceCategory,
        city: editState.city,
        district: editState.district,
        country: editState.country,
        businessType: businessType,
        language: seoLang,
        streetAddress: editState.streetAddress,
        postalCode: editState.postalCode,
        stateRegion: editState.stateRegion,
        countryCode: editState.countryCode
      });

      if (data) {
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
          schemaMarkup: typeof data.schemaMarkup === 'string' ? data.schemaMarkup : JSON.stringify(data.schemaMarkup, null, 2),
          ogTags: JSON.stringify(data.ogTags, null, 2),
          hreflang: JSON.stringify(data.hreflang, null, 2),
          semanticClusters: Array.isArray(data.semanticClusters) ? data.semanticClusters.join(', ') : '',
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

      <div className="w-full">
        <section className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-blue-50 pb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Map className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 leading-none">Address & Local Info</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Global settings for all images</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-2">
                  {currentLabels.language}
                </label>
                <select 
                  value={seoLang} 
                  onChange={(e) => {
                    setSeoLang(e.target.value);
                    handleChange('language', e.target.value);
                  }}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner cursor-pointer"
                >
                  <option value="en">English (US/UK)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="fr">French (Français)</option>
                  <option value="es">Spanish (Español)</option>
                  <option value="it">Italian (Italiano)</option>
                  <option value="pt">Portuguese (Português)</option>
                  <option value="tr">Turkish (Türkçe)</option>
                  <option value="ar">Arabic (العربية)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="ja">Japanese (日本語)</option>
                  <option value="zh">Chinese (中文)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-2">
                  {currentLabels.businessType}
                </label>
                <select 
                  value={businessType} 
                  onChange={(e) => handlePresetChange(e.target.value)}
                  className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner cursor-pointer"
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-2">
                   {currentLabels.businessName}
                 </label>
                 <input 
                   type="text" 
                   value={editState.businessName || ''} 
                   onChange={(e) => handleChange('businessName', e.target.value)} 
                   placeholder={currentLabels.businessNamePlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
                 />
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5 flex items-center gap-2">
                   {currentLabels.serviceCategory}
                 </label>
                 <input 
                   type="text" 
                   value={editState.serviceCategory || ''} 
                   onChange={(e) => handleChange('serviceCategory', e.target.value)} 
                   placeholder={currentLabels.serviceCategoryPlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
                 />
              </div>
            </div>

            <div>
               <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{currentLabels.streetAddress}</label>
               <input 
                 type="text" 
                 maxLength={120} 
                 value={editState.streetAddress || ''} 
                 onChange={(e) => handleChange('streetAddress', e.target.value)} 
                 placeholder={currentLabels.streetPlaceholder} 
                 className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
               />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{currentLabels.city}</label>
                 <input 
                   type="text" 
                   value={editState.city || ''} 
                   onChange={(e) => handleChange('city', e.target.value)} 
                   placeholder={currentLabels.cityPlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
                 />
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{seoLang !== 'en' ? currentLabels.district : (labels.district || "District")}</label>
                 <input 
                   type="text" 
                   value={editState.district || ''} 
                   onChange={(e) => handleChange('district', e.target.value)} 
                   placeholder={currentLabels.districtPlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
                 />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{seoLang !== 'en' ? currentLabels.stateRegion : labels.state}</label>
                 <input 
                   type="text" 
                   maxLength={80} 
                   value={editState.stateRegion || ''} 
                   onChange={(e) => handleChange('stateRegion', e.target.value)} 
                   placeholder={currentLabels.statePlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
                 />
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{seoLang !== 'en' ? currentLabels.postalCode : labels.postal}</label>
                 <input 
                   type="text" 
                   maxLength={20} 
                   value={editState.postalCode || ''} 
                   onChange={(e) => handleChange('postalCode', e.target.value)} 
                   placeholder={currentLabels.postalPlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
                 />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{currentLabels.country}</label>
                 <input 
                   type="text" 
                   value={editState.country || ''} 
                   onChange={(e) => handleChange('country', e.target.value)} 
                   placeholder={currentLabels.countryPlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
                 />
              </div>
              <div>
                 <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{currentLabels.countryCode}</label>
                 <input 
                   type="text" 
                   maxLength={2} 
                   value={editState.countryCode || ''} 
                   onChange={(e) => handleChange('countryCode', e.target.value)} 
                   placeholder={currentLabels.countryCodePlaceholder} 
                   className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner uppercase" 
                 />
              </div>
            </div>

            <div>
               <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">{currentLabels.websiteUrl}</label>
               <input 
                 type="url" 
                 value={editState.websiteUrl || ''} 
                 onChange={(e) => handleChange('websiteUrl', e.target.value)} 
                 placeholder={currentLabels.websitePlaceholder} 
                 className="w-full text-sm font-medium border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 focus:bg-white transition-all shadow-inner" 
               />
            </div>

            <div className="pt-2">
              <p className="text-[10px] text-blue-600 font-bold bg-blue-50 p-3 rounded-lg border border-blue-100 uppercase tracking-tight text-center">
                {currentLabels.addressNote}
              </p>
            </div>
          </div>
        </section>
      </div>

      <details className="mt-2 border-t border-slate-200 pt-6 group">
        <summary className="font-bold text-slate-900 text-sm mb-4 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          {currentLabels.aiSeoTitle}
          <svg className="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">

            {/* AI Generated Advanced SEO */}
            {editState.schemaMarkup && (
              <div className="col-span-2 mt-4 space-y-4">
                <div className="bg-slate-900 rounded-lg p-4 relative group">
                   <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentLabels.schemaLabel}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(editState.schemaMarkup || '');
                        alert(currentLabels.copySchema);
                      }}
                      className="text-xs bg-slate-800 text-slate-300 hover:text-white px-2 py-1 rounded transition-colors"
                    >
                      {currentLabels.copySchema}
                    </button>
                   </div>
                   <pre className="text-[11px] text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap max-h-40">
                    {editState.schemaMarkup}
                   </pre>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h6 className="text-xs font-bold text-slate-900">{currentLabels.ogLabel}</h6>
                    <button 
                      onClick={() => {
                        const tags = JSON.parse(editState.ogTags || '{}');
                        const metaStr = Object.entries(tags).map(([k, v]) => `<meta property="${k}" content="${v}" />`).join('\n');
                        navigator.clipboard.writeText(metaStr);
                        alert(currentLabels.copyOg);
                      }}
                      className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors"
                    >
                      {currentLabels.copyOg}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {editState.ogTags && Object.entries(JSON.parse(editState.ogTags)).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex items-center justify-between text-[11px] py-1 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-500">{key}:</span>
                        <span className="text-slate-900 truncate ml-4 max-w-[200px]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {editState.semanticClusters && (
                  <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                    <h6 className="text-xs font-bold text-purple-900 mb-2">{currentLabels.semanticLabel}</h6>
                    <p className="text-[11px] text-purple-800 leading-relaxed italic">
                      {editState.semanticClusters}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </details>
    </div>
  );
}
