'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCcw, RotateCw, Check } from 'lucide-react';
import { ImageFile } from '@/types/image';

interface ImageEditorModalProps {
  file: ImageFile | null;
  onClose: () => void;
  onSave: (editedBlob: Blob, previewUrl: string) => void;
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

export default function ImageEditorModal({ file, onClose, onSave }: ImageEditorModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Use preview or create one
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    if (file) {
      if (file.editedBlob) {
        // eslint-disable-next-line
        setImgSrc(URL.createObjectURL(file.editedBlob));
      } else {
        // eslint-disable-next-line
        setImgSrc(file.preview || URL.createObjectURL(file.originalFile));
      }
    }
  }, [file]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerAspectCrop(width, height, width / height);
    setCrop(initialCrop);
  }

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
    canvas.width = isRotated90 ? cropHeight * scaleY : cropWidth * scaleX;
    canvas.height = isRotated90 ? cropWidth * scaleX : cropHeight * scaleY;

    ctx.translate(canvas.width / 2, canvas.height / 2);
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

    cropCanvas.width = isRotated90 ? cropHeight * scaleY : cropWidth * scaleX;
    cropCanvas.height = isRotated90 ? cropWidth * scaleX : cropHeight * scaleY;

    // We draw from the first canvas into the second using crop coordinates
    // However, if we rotated, the coordinates for cropping apply to the *unrotated* image
    // The easiest way is to apply rotation to the whole image, then crop. 
    // But react-image-crop gives us crop coordinates on the UNROTATED view.
    // Actually, in our UI the user crops on the rotated view because react-image-crop wraps the rotated image.
    
    // Simpler flow: 
    // 1. Draw rotated image to a full-size canvas.
    const fullCanvas = document.createElement('canvas');
    const fullCtx = fullCanvas.getContext('2d');
    if(!fullCtx) return;

    const bBoxWidth = isRotated90 ? image.naturalHeight : image.naturalWidth;
    const bBoxHeight = isRotated90 ? image.naturalWidth : image.naturalHeight;
    fullCanvas.width = bBoxWidth;
    fullCanvas.height = bBoxHeight;

    fullCtx.translate(bBoxWidth / 2, bBoxHeight / 2);
    fullCtx.rotate((rotation * Math.PI) / 180);
    fullCtx.translate(-image.naturalWidth / 2, -image.naturalHeight / 2);
    fullCtx.drawImage(image, 0, 0);

    // 2. Crop from the full unscaled canvas using scaled crop coordinates
    cropCanvas.width = cropWidth * scaleX;
    cropCanvas.height = cropHeight * scaleY;
    cropCtx.drawImage(
      fullCanvas,
      cropX * scaleX,
      cropY * scaleY,
      cropWidth * scaleX,
      cropHeight * scaleY,
      0,
      0,
      cropWidth * scaleX,
      cropHeight * scaleY
    );

    cropCanvas.toBlob((blob) => {
      if (blob) {
        const previewUrl = URL.createObjectURL(blob);
        onSave(blob, previewUrl);
      }
    }, 'image/jpeg', 0.95);
  };

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-semibold text-slate-800">Edit & Crop Image</h3>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-grow p-6 flex flex-col items-center justify-center overflow-auto bg-slate-100">
          {imgSrc && (
            <ReactCrop
              crop={crop}
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
        
        <div className="p-4 border-t border-slate-200 bg-white flex justify-between items-center">
          <div className="flex gap-2">
            <button onClick={() => handleRotate(-90)} className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <RotateCcw className="w-4 h-4" /> Rotate Left
            </button>
            <button onClick={() => handleRotate(90)} className="p-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <RotateCw className="w-4 h-4" /> Rotate Right
            </button>
          </div>
          
          <button onClick={handleSave} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors">
            <Check className="w-5 h-5" /> Apply Edits
          </button>
        </div>
      </div>
    </div>
  );
}
