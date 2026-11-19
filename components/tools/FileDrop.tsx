'use client';

import { useDropzone, type Accept, type FileRejection } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { formatBytes } from '@/lib/imageIO';
import { useUi } from './UiProvider';

export const ACCEPT_IMAGES: Accept = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/avif': ['.avif'],
  'image/heic': ['.heic'],
  'image/heif': ['.heif'],
  'image/gif': ['.gif'],
  'image/svg+xml': ['.svg'],
  'image/tiff': ['.tif', '.tiff'],
};

export function acceptFor(exts: string[]): Accept {
  const out: Accept = {};
  for (const [mime, list] of Object.entries(ACCEPT_IMAGES)) {
    const hit = list.filter((e) => exts.includes(e.replace('.', '')));
    if (hit.length) out[mime] = hit;
  }
  return out;
}

export default function FileDrop({
  onFiles,
  accept = ACCEPT_IMAGES,
  multiple = true,
  maxFiles = 20,
  maxSize = 25 * 1024 * 1024,
  title,
  hint,
  compact = false,
}: {
  onFiles: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  title?: string;
  hint?: string;
  compact?: boolean;
}) {
  const { t } = useUi();
  const [error, setError] = useState<string | null>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    maxFiles: multiple ? maxFiles : 1,
    maxSize,
    onDrop: (ok: File[], rejected: FileRejection[]) => {
      if (rejected.length) {
        const code = rejected[0].errors[0]?.code;
        setError(
          code === 'file-too-large'
            ? t('errTooLarge', { size: formatBytes(maxSize) })
            : code === 'too-many-files'
              ? t('errTooMany', { n: maxFiles })
              : t('errType'),
        );
      } else setError(null);
      if (ok.length) onFiles(ok);
    },
  });

  const exts = Array.from(new Set(Object.values(accept).flat())).map((e) => e.replace('.', '').toUpperCase());

  return (
    <div>
      <div
        {...getRootProps()}
        className={`group relative cursor-pointer rounded-2xl border-2 border-dashed text-center transition-all ${
          compact ? 'px-6 py-8' : 'px-6 py-14'
        } ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40'}`}
      >
        <input {...getInputProps()} />
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/25 transition-transform group-hover:-translate-y-0.5 ${compact ? 'h-11 w-11' : ''}`}>
          <UploadCloud className="w-6 h-6" aria-hidden />
        </span>
        <p className="mt-4 text-base font-bold text-slate-900">{isDragActive ? t('dropActive') : title || t('dropTitle')}</p>
        <p className="mt-1 text-sm text-slate-500">
          {hint || t(multiple ? 'dropHintMulti' : 'dropHint', { exts: exts.join(', '), size: formatBytes(maxSize), n: maxFiles })}
        </p>
      </div>
      {error && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{error}</p>}
    </div>
  );
}
