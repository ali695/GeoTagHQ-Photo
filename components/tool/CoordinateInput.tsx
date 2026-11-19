'use client';

import { useState } from 'react';
import { GeoCoordinates } from '@/types/geo';

interface CoordinateInputProps {
  coords?: GeoCoordinates;
  onChange: (coords: GeoCoordinates) => void;
  lang?: string;
}

// Native labels for manual coordinate entry.
const T: Record<string, { lat: string; lng: string; apply: string; eg: string; range: string; nan: string }> = {
  en: { lat: 'Latitude', lng: 'Longitude', apply: 'Apply', eg: 'e.g.', range: 'Latitude must be between -90 and 90, and longitude between -180 and 180.', nan: 'Please enter valid numbers.' },
  de: { lat: 'Breitengrad', lng: 'Längengrad', apply: 'Übernehmen', eg: 'z. B.', range: 'Der Breitengrad muss zwischen -90 und 90 liegen, der Längengrad zwischen -180 und 180.', nan: 'Bitte geben Sie gültige Zahlen ein.' },
  es: { lat: 'Latitud', lng: 'Longitud', apply: 'Aplicar', eg: 'p. ej.', range: 'La latitud debe estar entre -90 y 90, y la longitud entre -180 y 180.', nan: 'Escribe números válidos.' },
  fr: { lat: 'Latitude', lng: 'Longitude', apply: 'Appliquer', eg: 'ex.', range: 'La latitude doit être comprise entre -90 et 90, et la longitude entre -180 et 180.', nan: 'Veuillez saisir des nombres valides.' },
  pt: { lat: 'Latitude', lng: 'Longitude', apply: 'Aplicar', eg: 'ex.', range: 'A latitude deve ficar entre -90 e 90, e a longitude entre -180 e 180.', nan: 'Digite números válidos.' },
  it: { lat: 'Latitudine', lng: 'Longitudine', apply: 'Applica', eg: 'es.', range: 'La latitudine deve essere tra -90 e 90 e la longitudine tra -180 e 180.', nan: 'Inserisci numeri validi.' },
  nl: { lat: 'Breedtegraad', lng: 'Lengtegraad', apply: 'Toepassen', eg: 'bijv.', range: 'De breedtegraad moet tussen -90 en 90 liggen en de lengtegraad tussen -180 en 180.', nan: 'Vul geldige getallen in.' },
  tr: { lat: 'Enlem', lng: 'Boylam', apply: 'Uygula', eg: 'örn.', range: 'Enlem -90 ile 90, boylam -180 ile 180 arasında olmalıdır.', nan: 'Lütfen geçerli sayılar girin.' },
  id: { lat: 'Lintang', lng: 'Bujur', apply: 'Terapkan', eg: 'mis.', range: 'Lintang harus antara -90 dan 90, dan bujur antara -180 dan 180.', nan: 'Masukkan angka yang valid.' },
  ja: { lat: '緯度', lng: '経度', apply: '適用', eg: '例：', range: '緯度は-90〜90、経度は-180〜180の範囲で入力してください。', nan: '正しい数値を入力してください。' },
  ko: { lat: '위도', lng: '경도', apply: '적용', eg: '예:', range: '위도는 -90~90, 경도는 -180~180 사이여야 합니다.', nan: '올바른 숫자를 입력하세요.' },
  ar: { lat: 'خط العرض', lng: 'خط الطول', apply: 'تطبيق', eg: 'مثال:', range: 'يجب أن يكون خط العرض بين ‎-90 و90، وخط الطول بين ‎-180 و180.', nan: 'يرجى إدخال أرقام صحيحة.' },
  hi: { lat: 'अक्षांश', lng: 'देशांतर', apply: 'लागू करें', eg: 'जैसे', range: 'अक्षांश -90 से 90 और देशांतर -180 से 180 के बीच होना चाहिए।', nan: 'कृपया सही नंबर डालें।' },
};

export default function CoordinateInput({ coords, onChange, lang = 'en' }: CoordinateInputProps) {
  const t = T[lang] || T.en;
  const [lat, setLat] = useState(coords?.lat.toString() || '');
  const [lng, setLng] = useState(coords?.lng.toString() || '');
  const [prevCoords, setPrevCoords] = useState(coords);

  if (coords !== prevCoords) {
    setPrevCoords(coords);
    if (coords) {
      setLat(coords.lat.toString());
      setLng(coords.lng.toString());
    }
  }

  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    setError(null);
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (!isNaN(latNum) && !isNaN(lngNum)) {
      if (latNum >= -90 && latNum <= 90 && lngNum >= -180 && lngNum <= 180) onChange({ lat: latNum, lng: lngNum });
      else setError(t.range);
    } else {
      setError(t.nan);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full">
          <label htmlFor="coord-lat" className="block text-sm font-medium text-slate-700 mb-1">{t.lat}</label>
          <input
            id="coord-lat"
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder={`${t.eg} 51.505`}
            step="any"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full">
          <label htmlFor="coord-lng" className="block text-sm font-medium text-slate-700 mb-1">{t.lng}</label>
          <input
            id="coord-lng"
            type="number"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder={`${t.eg} -0.09`}
            step="any"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={handleApply}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium whitespace-nowrap transition-colors"
        >
          {t.apply}
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-2" role="alert">{error}</p>}
    </div>
  );
}
