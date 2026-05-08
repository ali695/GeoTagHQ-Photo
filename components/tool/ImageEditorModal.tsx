'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCcw, RotateCw, Check, Wand2 } from 'lucide-react';
import { ImageFile } from '@/types/image';

interface ImageEditorModalProps {
  file: ImageFile | null;
  onClose: () => void;
  onSave: (editedBlob: Blob, previewUrl: string) => void;
  d?: any;
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

export default function ImageEditorModal({ file, onClose, onSave, d = {} }: ImageEditorModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  
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
        onSave(blob, previewUrl);
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
        
        <div className="flex-grow p-6 flex flex-col items-center justify-center overflow-auto bg-slate-100">
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
