// Maps a registry id to its tool component (used by the localized routes).
import ImageConverter from './ImageConverter';
import ExifViewer from './ExifViewer';
import ExifRemover from './ExifRemover';
import ImageCompressor from './ImageCompressor';
import LatLongFinder from './LatLongFinder';
import AltTextGenerator from './AltTextGenerator';
import ImageResizer from './ImageResizer';
import ImageToPdf from './ImageToPdf';
import CompressToSize from './CompressToSize';
import { CONVERTER_PAIRS } from '@/lib/tools';

export default function renderTool(id: string) {
  const pair = CONVERTER_PAIRS.find(([f, t]) => `${f}-to-${t}` === id);
  if (pair) return <ImageConverter from={pair[0]} to={pair[1] as 'jpg' | 'png' | 'webp'} />;
  switch (id) {
    case 'image-converter':
      return <ImageConverter to="jpg" chooseTarget />;
    case 'exif-viewer':
      return <ExifViewer mode="viewer" />;
    case 'photo-location-finder':
      return <ExifViewer mode="locator" />;
    case 'remove-exif':
      return <ExifRemover />;
    case 'image-compressor':
      return <ImageCompressor />;
    case 'lat-long-finder':
      return <LatLongFinder />;
    case 'ai-alt-text':
      return <AltTextGenerator />;
    case 'image-resizer':
      return <ImageResizer />;
    case 'jpg-to-pdf':
      return <ImageToPdf format="JPG" />;
    case 'png-to-pdf':
      return <ImageToPdf format="PNG" />;
    case 'compress-to-20kb':
      return <CompressToSize targetKB={20} />;
    case 'compress-to-50kb':
      return <CompressToSize targetKB={50} />;
    case 'compress-to-100kb':
      return <CompressToSize targetKB={100} />;
    case 'compress-to-200kb':
      return <CompressToSize targetKB={200} />;
    default:
      return null;
  }
}
