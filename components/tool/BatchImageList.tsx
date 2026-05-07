'use client';

import { ImageFile } from '@/types/image';
import { X, CheckCircle, AlertCircle, Clock, Crop, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BatchImageListProps {
  files: ImageFile[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
  onEdit: (index: number) => void;
}

export default function BatchImageList({ files, onRemove, onClearAll, onEdit }: BatchImageListProps) {
  if (files.length === 0) return null;

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Selected Photos ({files.length})
        </h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={onClearAll}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Clear All
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove all uploaded photos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <TooltipProvider>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="relative border border-slate-200 rounded-lg p-3 bg-white shadow-sm flex items-center gap-3 group">
              <div className="absolute -top-2 -end-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => onEdit(index)}
                      className="bg-white rounded-full p-1.5 shadow-md border border-slate-200 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Crop className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Crop & Rotate</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => onRemove(index)}
                      className="bg-white rounded-full p-1.5 shadow-md border border-slate-200 text-slate-500 hover:text-red-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove photo</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {file.preview ? (
                <div className="w-12 h-12 relative rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image 
                    src={file.preview} 
                    alt={file.name} 
                    fill 
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                    unoptimized // Local object URL
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-slate-100 rounded-md shrink-0 flex items-center justify-center border border-slate-200">
                  <span className="text-xs text-slate-400">IMG</span>
                </div>
              )}
              
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <div className="mt-1 flex flex-col gap-1">
                  {file.metadata?.gps ? (
                    <span className="flex-none"><span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                      <CheckCircle className="w-3 h-3" /> Has GPS
                    </span></span>
                  ) : (
                    <span className="flex-none"><span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                      <AlertCircle className="w-3 h-3" /> No GPS
                    </span></span>
                  )}
                  
                  {file.status === 'done' && (
                    <span className="flex-none"><span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-medium">
                      <CheckCircle className="w-3 h-3" /> Geotagged
                    </span></span>
                  )}
                  {file.status === 'processing' && (
                    <span className="flex-none"><span className="inline-flex items-center gap-1 text-[10px] text-slate-500 font-medium animate-pulse">
                      <Clock className="w-3 h-3" /> Processing...
                    </span></span>
                  )}
                  {file.status === 'error' && (
                    <span className="flex-none"><span className="inline-flex items-center gap-1 text-[10px] text-red-600 bg-red-50 px-1.5 py-0.5 rounded font-medium">
                      <AlertCircle className="w-3 h-3" /> Failed
                    </span></span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
