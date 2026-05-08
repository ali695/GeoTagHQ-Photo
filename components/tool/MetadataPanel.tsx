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

    if (field === 'serviceCategory') {
      const lower = value.toLowerCase();
      if (lower.includes('plumb')) setBusinessType('plumber');
      else if (lower.includes('roof')) setBusinessType('roofing');
      else if (lower.includes('hvac') || lower.includes('heating') || lower.includes('air cond') || lower.includes('ac ')) setBusinessType('hvac');
      else if (lower.includes('clean') || lower.includes('maid')) setBusinessType('cleaning');
      else if (lower.includes('landscap') || lower.includes('lawn') || lower.includes('garden') || lower.includes('yard')) setBusinessType('landscaping');
      else if (lower.includes('auto') || lower.includes('car') || lower.includes('mechanic')) setBusinessType('automotive');
      else if (lower.includes('hotel') || lower.includes('motel') || lower.includes('hostel')) setBusinessType('hotel');
      else if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food')) setBusinessType('restaurant');
      else if (lower.includes('salon') || lower.includes('spa') || lower.includes('hair') || lower.includes('barber')) setBusinessType('salon');
      else if (lower.includes('gym') || lower.includes('fitness') || lower.includes('yoga') || lower.includes('pilates')) setBusinessType('fitness');
      else if (lower.includes('real estate') || lower.includes('realtor') || lower.includes('property')) setBusinessType('real_estate');
      else if (lower.includes('dentist') || lower.includes('dental')) setBusinessType('dentist');
      else if (lower.includes('law') || lower.includes('legal') || lower.includes('attorney') || lower.includes('lawyer')) setBusinessType('legal');
      else if (lower.includes('account') || lower.includes('cpa') || lower.includes('tax') || lower.includes('bookkeep')) setBusinessType('accounting');
      else if (lower.includes('tree') || lower.includes('arbor')) setBusinessType('tree_service');
      else if (lower.includes('pest') || lower.includes('exterminator')) setBusinessType('pest_control');
      else if (lower.includes('tow') || lower.includes('wrecker')) setBusinessType('towing');
      else if (lower.includes('locksmith') || lower.includes('key')) setBusinessType('locksmith');
      else if (lower.includes('junk') || lower.includes('trash') || lower.includes('dumpster')) setBusinessType('junk_removal');
      else if (lower.includes('fence') || lower.includes('fencing')) setBusinessType('fencing');
      else if (lower.includes('concrete') || lower.includes('epoxy') || lower.includes('cement')) setBusinessType('concrete');
      else if (lower.includes('mold') || lower.includes('water damag') || lower.includes('fire damag') || lower.includes('remediat')) setBusinessType('remediation');
      else if (lower.includes('paint') || lower.includes('painter')) setBusinessType('painting');
      else if (lower.includes('electrician') || lower.includes('electrical')) setBusinessType('electrician');
      else if (lower.includes('carpenter') || lower.includes('wood') || lower.includes('cabinet')) setBusinessType('carpentry');
      else if (lower.includes('masonry') || lower.includes('brick') || lower.includes('stone')) setBusinessType('masonry');
      else if (lower.includes('weld') || lower.includes('metal')) setBusinessType('welding');
      else if (lower.includes('glass') || lower.includes('window')) setBusinessType('glass');
      else if (lower.includes('garage')) setBusinessType('garage_door');
      else if (lower.includes('pool')) setBusinessType('pool_cleaning');
      else if (lower.includes('gutter')) setBusinessType('gutter_cleaning');
      else if (lower.includes('snow') || lower.includes('plow')) setBusinessType('snow_removal');
      else if (lower.includes('floor') || lower.includes('carpet')) setBusinessType('flooring');
      else if (lower.includes('mov') || lower.includes('relocat')) setBusinessType('moving');
      else if (lower.includes('appliance') || lower.includes('repair')) setBusinessType('appliance_repair');
      else if (lower.includes('chiro')) setBusinessType('chiropractor');
      else if (lower.includes('physical therapy') || lower.includes('physiotherapy')) setBusinessType('physical_therapy');
      else if (lower.includes('massage')) setBusinessType('massage_therapy');
      else if (lower.includes('optometrist') || lower.includes('eye')) setBusinessType('optometrist');
      else if (lower.includes('pharmacy') || lower.includes('drug')) setBusinessType('pharmacy');
      else if (lower.includes('vet') || lower.includes('animal hosp')) setBusinessType('vet');
      else if (lower.includes('pet groom') || lower.includes('groom')) setBusinessType('pet_grooming');
      else if (lower.includes('dog') || lower.includes('pet sit')) setBusinessType('dog_walking');
      else if (lower.includes('tutor') || lower.includes('math') || lower.includes('prep')) setBusinessType('tutor');
      else if (lower.includes('driving')) setBusinessType('driving_school');
      else if (lower.includes('music') || lower.includes('piano') || lower.includes('guitar')) setBusinessType('music_school');
      else if (lower.includes('dance')) setBusinessType('dance_studio');
      else if (lower.includes('grocer') || lower.includes('supermarket') || lower.includes('market')) setBusinessType('grocery');
      else if (lower.includes('baker') || lower.includes('pastry') || lower.includes('cake')) setBusinessType('bakery');
      else if (lower.includes('bar') || lower.includes('pub') || lower.includes('club') || lower.includes('nightclub') || lower.includes('lounge')) setBusinessType('bar');
      else if (lower.includes('coffee')) setBusinessType('cafe');
      else if (lower.includes('food truck')) setBusinessType('food_truck');
      else if (lower.includes('liquor') || lower.includes('wine') || lower.includes('beer')) setBusinessType('liquor_store');
      else if (lower.includes('florist') || lower.includes('flower')) setBusinessType('florist');
      else if (lower.includes('hardware') || lower.includes('lumber') || lower.includes('home improvement')) setBusinessType('hardware_store');
      else if (lower.includes('pet store') || lower.includes('pet suppl')) setBusinessType('pet_store');
      else if (lower.includes('nail')) setBusinessType('nail_salon');
      else if (lower.includes('dj') || lower.includes('entertainment')) setBusinessType('dj');
      else if (lower.includes('video') || lower.includes('film')) setBusinessType('videography');
      else if (lower.includes('print') || lower.includes('sign')) setBusinessType('print_shop');
      else if (lower.includes('architect')) setBusinessType('architecture');
      else if (lower.includes('consult')) setBusinessType('consulting');
      else if (lower.includes('insurance') || lower.includes('broker')) setBusinessType('insurance');
      else if (lower.includes('notary')) setBusinessType('notary');
      else if (lower.includes('e-commerce') || lower.includes('online')) setBusinessType('ecommerce');
      else if (lower.includes('medical') || lower.includes('clinic') || lower.includes('health')) setBusinessType('healthcare');
      else if (lower.includes('market')) setBusinessType('marketing');
      else if (lower.includes('tech') || lower.includes('it support')) setBusinessType('tech_support');
      else if (lower.includes('event') || lower.includes('party')) setBusinessType('event_planning');
      else if (lower.includes('photo')) setBusinessType('photographer');
      else if (lower.includes('jewelry') || lower.includes('jewel')) setBusinessType('jewelry');
      else if (lower.includes('fashion') || lower.includes('cloth') || lower.includes('boutique') || lower.includes('apparel')) setBusinessType('fashion');
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
            onChange={(e) => {
               setBusinessType(e.target.value);
               if (e.target.value !== 'general') {
                 // Auto-fill service category based on preset
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
                   'carpentry': 'Carpentry & Woodworking',
                   'masonry': 'Masonry & Bricklaying',
                   'welding': 'Welding & Metalwork',
                   'glass': 'Glass & Window Repair',
                   'garage_door': 'Garage Door Services',
                   'pool_cleaning': 'Pool Cleaning & Maintenance',
                   'gutter_cleaning': 'Gutter Cleaning',
                   'snow_removal': 'Snow Removal Services',
                   'flooring': 'Flooring Installation',
                   'moving': 'Moving & Relocation Services',
                   'appliance_repair': 'Appliance Repair',
                   'chiropractor': 'Chiropractor',
                   'physical_therapy': 'Physical Therapy',
                   'massage_therapy': 'Massage Therapy',
                   'optometrist': 'Optometrist & Eye Care',
                   'pharmacy': 'Pharmacy',
                   'vet': 'Veterinarian Clinic',
                   'pet_grooming': 'Pet Grooming',
                   'dog_walking': 'Dog Walking & Sitting',
                   'tutor': 'Tutoring & Education',
                   'driving_school': 'Driving School',
                   'music_school': 'Music Lessons',
                   'dance_studio': 'Dance Studio',
                   'grocery': 'Grocery Store & Supermarket',
                   'bakery': 'Bakery & Pastry Shop',
                   'bar': 'Bar & Nightclub',
                   'cafe': 'Coffee Shop & Cafe',
                   'food_truck': 'Food Truck',
                   'liquor_store': 'Liquor Store',
                   'florist': 'Florist & Flower Shop',
                   'hardware_store': 'Hardware Store',
                   'pet_store': 'Pet Store & Supplies',
                   'nail_salon': 'Nail Salon',
                   'dj': 'DJ & Entertainment',
                   'videography': 'Videography & Film Production',
                   'print_shop': 'Print Shop & Signage',
                   'architecture': 'Architect & Building Design',
                   'consulting': 'Business Consulting',
                   'insurance': 'Insurance Agency',
                   'notary': 'Notary Public',
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
                   'fashion': 'High-end Fashion Boutique'
                 };
                 if (presetToCategory[e.target.value]) {
                   handleChange('serviceCategory', presetToCategory[e.target.value]);
                 }
               }
            }}
            className="text-xs border border-slate-300 rounded-md px-2 py-1 outline-none bg-white max-w-[150px] truncate"
            title="Business Type Preset"
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
            <option disabled>--- Local Trades & Home Services ---</option>
            <option value="plumber">Plumber</option>
            <option value="hvac">HVAC Services</option>
            <option value="roofing">Roofing Contractors</option>
            <option value="cleaning">Cleaning Services</option>
            <option value="landscaping">Landscaping</option>
            <option value="carpentry">Carpentry & Woodworking</option>
            <option value="masonry">Masonry & Bricklaying</option>
            <option value="welding">Welding & Metalwork</option>
            <option value="glass">Glass & Window Repair</option>
            <option value="garage_door">Garage Door Services</option>
            <option value="pool_cleaning">Pool Cleaning & Maintenance</option>
            <option value="gutter_cleaning">Gutter Cleaning</option>
            <option value="snow_removal">Snow Removal Services</option>
            <option value="flooring">Flooring Installation</option>
            <option value="moving">Moving & Relocation Services</option>
            <option value="appliance_repair">Appliance Repair</option>
            <option disabled>--- Automotive ---</option>
            <option value="automotive">Automotive Repair</option>
            <option disabled>--- Hospitality & Food ---</option>
            <option value="hotel">Hotel / Stays</option>
            <option value="restaurant">Restaurant / Cafe</option>
            <option value="bakery">Bakery & Pastry Shop</option>
            <option value="bar">Bar & Nightclub</option>
            <option value="cafe">Coffee Shop & Cafe</option>
            <option value="food_truck">Food Truck</option>
            <option disabled>--- Retail & Online ---</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="grocery">Grocery Store</option>
            <option value="liquor_store">Liquor Store</option>
            <option value="florist">Florist</option>
            <option value="hardware_store">Hardware Store</option>
            <option value="pet_store">Pet Store & Supplies</option>
            <option disabled>--- Beauty, Wellness & Pets ---</option>
            <option value="salon">Salon & Spa</option>
            <option value="nail_salon">Nail Salon</option>
            <option value="fitness">Gym & Fitness</option>
            <option value="vet">Veterinarian</option>
            <option value="pet_grooming">Pet Grooming</option>
            <option value="dog_walking">Dog Walking</option>
            <option disabled>--- Professional, B2B & Real Estate ---</option>
            <option value="real_estate">Real Estate</option>
            <option value="legal">Law Firm</option>
            <option value="accounting">Accounting Services</option>
            <option value="marketing">Digital Marketing</option>
            <option value="tech_support">IT Support</option>
            <option value="architecture">Architecture</option>
            <option value="consulting">Business Consulting</option>
            <option value="insurance">Insurance Agency</option>
            <option value="notary">Notary Public</option>
            <option disabled>--- Health & Medical ---</option>
            <option value="healthcare">Medical Clinic</option>
            <option value="dentist">Dental Clinic</option>
            <option value="chiropractor">Chiropractor</option>
            <option value="physical_therapy">Physical Therapy</option>
            <option value="massage_therapy">Massage Therapy</option>
            <option value="optometrist">Optometrist</option>
            <option value="pharmacy">Pharmacy</option>
            <option disabled>--- Education, Events & Creative ---</option>
            <option value="tutor">Tutoring & Education</option>
            <option value="driving_school">Driving School</option>
            <option value="music_school">Music Lessons</option>
            <option value="dance_studio">Dance Studio</option>
            <option value="photographer">Photography</option>
            <option value="event_planning">Event Planning</option>
            <option value="dj">DJ & Entertainment</option>
            <option value="videography">Videography</option>
            <option value="print_shop">Print Shop</option>
            <option value="jewelry">Luxury Jewelry</option>
            <option value="fashion">Fashion Boutique</option>
          </select>
          <select 
            value={seoLang} 
            onChange={(e) => setSeoLang(e.target.value)}
            className="text-xs border border-slate-300 rounded-md px-2 py-1 outline-none bg-white"
            title="SEO Output Language"
          >
            <option value="en">English (EN)</option>
            <option value="de">Deutsch (DE)</option>
            <option value="es">Español (ES)</option>
            <option value="fr">Français (FR)</option>
            <option value="it">Italiano (IT)</option>
            <option value="pt">Português (PT)</option>
            <option value="nl">Nederlands (NL)</option>
            <option value="tr">Türkçe (TR)</option>
            <option value="hi">Hindi (HI)</option>
            <option value="ar">Arabic (AR)</option>
            <option value="id">Indonesian (ID)</option>
            <option value="ja">Japanese (JA)</option>
            <option value="ko">Korean (KO)</option>
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
