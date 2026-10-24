'use client';

import { useEffect, useRef, useState } from 'react';

const PAKISTAN_CENTER = [30.3753, 69.3451];
const valid = (latitude, longitude) => Number.isFinite(latitude) && Number.isFinite(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
const hasCoordinates = value => value && value.latitude !== '' && value.longitude !== '' && value.latitude != null && value.longitude != null && valid(Number(value.latitude), Number(value.longitude));

export default function StoreLocationPicker({ value, onChange, purpose = 'store' }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletRef = useRef(null);
  const changeRef = useRef(onChange);
  const [message, setMessage] = useState('Use your location or click the map to place a pin.');

  useEffect(() => { changeRef.current = onChange; }, [onChange]);
  useEffect(() => {
    let active = true;
    import('leaflet').then(module => {
      if (!active || !containerRef.current || mapRef.current) return;
      const L = module.default || module;
      leafletRef.current = L;
      const hasLocation = hasCoordinates(value);
      const center = hasLocation ? [Number(value.latitude), Number(value.longitude)] : PAKISTAN_CENTER;
      const map = L.map(containerRef.current).setView(center, hasLocation ? 15 : 5);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      const icon = L.divIcon({ html: '<span class="material-symbols-outlined">location_on</span>', className: 'store-location-pin', iconSize: [32, 40], iconAnchor: [16, 40] });
      const setPin = (latitude, longitude, moveMap = false) => {
        if (!markerRef.current) markerRef.current = L.marker([latitude, longitude], { icon, draggable: true }).addTo(map);
        else markerRef.current.setLatLng([latitude, longitude]);
        markerRef.current.off('dragend');
        markerRef.current.on('dragend', event => {
          const point = event.target.getLatLng();
          changeRef.current({ latitude: point.lat, longitude: point.lng });
        });
        if (moveMap) map.setView([latitude, longitude], 16);
      };
      map.on('click', event => { setPin(event.latlng.lat, event.latlng.lng); changeRef.current({ latitude: event.latlng.lat, longitude: event.latlng.lng }); setMessage('Pin selected. Drag it to adjust the location.'); });
      mapRef.current = { map, setPin };
      if (hasLocation) setPin(center[0], center[1]);
      setTimeout(() => map.invalidateSize(), 0);
    }).catch(() => { if (active) setMessage('Map could not load. Enter coordinates below.'); });
    return () => { active = false; mapRef.current?.map.remove(); mapRef.current = null; markerRef.current = null; };
  }, []);

  useEffect(() => {
    if (hasCoordinates(value)) mapRef.current?.setPin(Number(value.latitude), Number(value.longitude), true);
  }, [value?.latitude, value?.longitude]);

  const locate = () => {
    if (!navigator.geolocation) { setMessage('This browser cannot access your location. Choose the point on the map.'); return; }
    setMessage('Finding your location…');
    navigator.geolocation.getCurrentPosition(position => {
      const point = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      onChange(point);
      mapRef.current?.setPin(point.latitude, point.longitude, true);
      setMessage(purpose === 'store' ? 'Location found. Confirm that the pin is at your store entrance.' : 'Location found. You can move the pin to search another area.');
    }, () => setMessage('Location unavailable or permission denied. Click the map or enter coordinates.'), { enableHighAccuracy: true, timeout: 12000 });
  };

  const editCoordinate = (field, raw) => {
    const next = { latitude: value?.latitude ?? '', longitude: value?.longitude ?? '', [field]: raw };
    onChange(next);
  };

  return <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-3"><button type="button" onClick={locate} className="rounded-lg bg-[#31543d] px-4 py-2 text-sm font-semibold text-white">Use my current location</button><p className="text-sm text-slate-600" role="status">{message}</p></div>
    <div ref={containerRef} className="h-72 w-full overflow-hidden rounded-lg border border-slate-300" role="application" aria-label={purpose === 'store' ? 'Store location map' : 'Search location map'} />
    <div className="grid grid-cols-2 gap-3"><label className="text-sm text-slate-600">Latitude<input type="number" step="any" min="-90" max="90" value={value?.latitude ?? ''} onChange={event => editCoordinate('latitude', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2" /></label><label className="text-sm text-slate-600">Longitude<input type="number" step="any" min="-180" max="180" value={value?.longitude ?? ''} onChange={event => editCoordinate('longitude', event.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white p-2" /></label></div>
    <p className="text-xs text-slate-500">{purpose === 'store' ? 'Your device location may be different from your store. Move the pin to the actual shop before saving.' : 'Location access is optional. Click the map or enter coordinates to search a different area.'}</p>
  </div>;
}
