'use client';

import { ImageFile } from '@/types/image';
import { X, CheckCircle, AlertCircle, Clock, Pencil, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface BatchImageListProps {
  files: ImageFile[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
  onEdit: (index: number) => void;
  messages?: any;
}

export default function BatchImageList({ files, onRemove, onClearAll, onEdit, messages }: BatchImageListProps) {
  const t = messages?.tool || {};
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

      <div className="flex flex-col gap-3">
        <TooltipProvider>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="group relative border border-slate-200 rounded-xl p-3 bg-white shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Thumbnail */}
              {file.preview ? (
                <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200 group-hover:border-blue-100">
                  <Image 
                    src={file.preview} 
                    alt={file.name} 
                    fill 
                    className="object-cover" 
                    referrerPolicy="no-referrer"
                    unoptimized 
                  />
                </div>
              ) : (
                <div className="w-16 h-16 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center border border-slate-200">
                  <span className="text-xs text-slate-400 font-bold">IMG</span>
                </div>
              )}
              
              {/* Info section */}
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate mb-1">{file.name}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {file.metadata?.gps ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-100">
                      <CheckCircle className="w-3 h-3" /> {t.hasGps || "Has GPS"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold border border-amber-100">
                      <AlertCircle className="w-3 h-3" /> {t.noGps || "No GPS"}
                    </span>
                  )}
                  
                  {file.status === 'done' && file.processedBlob && (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-bold border border-blue-100">
                        <CheckCircle className="w-3 h-3" /> {t.geotagged || "Geotagged"}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                         {Math.round(file.size / 1024)}KB → {Math.round(file.processedBlob.size / 1024)}KB
                      </span>
                    </div>
                  )}
                  
                  {file.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-bold animate-pulse">
                      <Clock className="w-3 h-3" /> {t.processingFile || "Processing..."}
                    </span>
                  )}
                  
                  {file.status === 'error' && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded-full font-bold border border-red-100">
                      <AlertCircle className="w-3 h-3" /> {t.failedAction || "Failed"}
                    </span>
                  )}

                  {/* Metadata Indicators */}
                  {(file.metadata?.title || file.editedMetadata?.title) && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full font-bold border border-indigo-100" title="SEO Title Set">
                      T
                    </span>
                  )}
                  {(file.metadata?.description || file.editedMetadata?.description) && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full font-bold border border-purple-100" title="Meta Description Set">
                      D
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons at the end */}
              <div className="flex items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-xl">
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => onEdit(index)}
                      className="p-2.5 text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95 bg-transparent"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Metadata & Image</p>
                  </TooltipContent>
                </Tooltip>
                
                <div className="w-px h-6 bg-slate-200 mx-1"></div>

                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={() => onRemove(index)}
                      className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95 bg-transparent"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove from list</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
