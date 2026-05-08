'use client';

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoCoordinates } from '@/types/geo';

// Fix Leaflet's default icon path issues in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerClientProps {
  initialCoords?: GeoCoordinates;
  zoomLevel?: number;
  onChange: (coords: GeoCoordinates) => void;
}

function LocationMarker({ position, onChange }: { position: L.LatLng; onChange: (pos: L.LatLng) => void }) {
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      onChange(e.latlng);
    },
  });

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        onChange(marker.getLatLng());
      }
    },
  };

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}

export default function MapPickerClient({ initialCoords, zoomLevel, onChange }: MapPickerClientProps) {
  // Default to a central location (e.g., somewhere neutral or geographically central) if no location is provided
  const defaultPos = new L.LatLng(51.505, -0.09);
  
  const [position, setPosition] = useState<L.LatLng>(
    initialCoords ? new L.LatLng(initialCoords.lat, initialCoords.lng) : defaultPos
  );

  useEffect(() => {
    if (initialCoords) {
      // eslint-disable-next-line
      setPosition(new L.LatLng(initialCoords.lat, initialCoords.lng));
    }
  }, [initialCoords]);

  const handlePositionChange = (pos: L.LatLng) => {
    setPosition(pos);
    onChange({ lat: pos.lat, lng: pos.lng });
  };

  return (
    <MapContainer
      center={position}
      zoom={zoomLevel || 13}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker position={position} onChange={handlePositionChange} />
      
      {/* Invisible center updater when initial coordinates change from outside */}
      <MapCenterUpdater position={position} zoomLevel={zoomLevel} />
    </MapContainer>
  );
}

function MapCenterUpdater({ position, zoomLevel }: { position: L.LatLng, zoomLevel?: number }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.flyTo(position, zoomLevel || map.getZoom());
  }, [position, zoomLevel, map]);
  return null;
}
