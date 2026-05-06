export interface ImageMetadata {
  fileName: string;
  fileSize: number;
  format: string;
  width?: number;
  height?: number;
  cameraMake?: string;
  cameraModel?: string;
  dateTaken?: string;
  gps?: {
    lat: number;
    lng: number;
  };
  hasExif?: boolean;

  // Basic Local SEO Metadata
  title?: string;
  description?: string;
  keywords?: string;
  businessName?: string;
  serviceCategory?: string;
  city?: string;
  district?: string;
  country?: string;
  suggestedAltText?: string;

  // Advanced Metadata
  streetAddress?: string;
  postalCode?: string;
  stateRegion?: string;
  countryCode?: string;
  websiteUrl?: string;
}

export interface ImageFile {
  id: string; // unique identifier
  originalFile: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  metadata?: ImageMetadata;
  status?: 'pending' | 'processing' | 'done' | 'error';
  processedBlob?: Blob;
  editedBlob?: Blob; // Added for cropping/rotating
  editedMetadata?: ImageMetadata; // Added for metadata editing
  error?: string;
}
