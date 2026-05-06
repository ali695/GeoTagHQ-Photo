'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileImage, AlertCircle } from 'lucide-react';

interface UploadDropzoneProps {
  onDropAccepted: (files: File[]) => void;
}

export default function UploadDropzone({ onDropAccepted }: UploadDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onDropAccepted(acceptedFiles);
  }, [onDropAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
      'image/avif': ['.avif'],
      'image/tiff': ['.tiff', '.tif']
    }
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragActive ? 'bg-blue-100' : 'bg-white shadow-sm'}`}>
            <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-blue-600' : 'text-slate-400'}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">
              {isDragActive ? "Drop the photos here..." : "Drag & drop photos here, or click to select"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Supports JPG, JPEG, PNG, WebP, HEIC, HEIF, AVIF, and TIFF.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
        <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
        <div className="flex flex-col gap-1">
          <p>
            <strong>Privacy Note:</strong> JPG/JPEG photos are processed directly in your browser.
          </p>
          <p className="text-xs">
            To support other formats (like PNG, HEIC, WebP), your image may be securely processed by our server and deleted immediately after geotagging.
          </p>
        </div>
      </div>
    </div>
  );
}
