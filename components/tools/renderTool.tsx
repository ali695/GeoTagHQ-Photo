// Maps a registry id to its tool component (used by the localized routes).
import ImageConverter from './ImageConverter';
import ExifViewer from './ExifViewer';
import ExifRemover from './ExifRemover';
import ImageCompressor from './ImageCompressor';
import LatLongFinder from './LatLongFinder';
import AltTextGenerator from './AltTextGenerator';
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
    default:
      return null;
  }
}
