import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Custom Map Marker Icons to avoid Leaflet default icon path issues
const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const providerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function AssistanceMap({ driverLocation, providers = [], selectedProvider = null, height = '340px' }) {
  const centerLat = driverLocation?.latitude || 17.5472;
  const centerLng = driverLocation?.longitude || 78.2173;

  const routePoints = selectedProvider && driverLocation ? [
    [driverLocation.latitude, driverLocation.longitude],
    [selectedProvider.latitude, selectedProvider.longitude]
  ] : null;

  return (
    <div style={{ height, width: '100%', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative', zIndex: 1 }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Driver Marker */}
        {driverLocation && (
          <Marker position={[driverLocation.latitude, driverLocation.longitude]} icon={driverIcon}>
            <Popup>
              <strong>🚗 Your Breakdown Location</strong><br />
              {driverLocation.address || `${driverLocation.latitude}, ${driverLocation.longitude}`}
            </Popup>
          </Marker>
        )}

        {/* Nearby Provider Markers */}
        {providers.map((p) => (
          <Marker
            key={p.providerId || p.id}
            position={[p.latitude, p.longitude]}
            icon={providerIcon}
          >
            <Popup>
              <strong>🔧 {p.businessName}</strong> {p.open24x7 ? '🟢 24x7' : ''}<br />
              Distance: {p.distanceKm} km {p.distanceFromMRUKm != null ? `(${p.distanceFromMRUKm} km from MRU)` : ''}<br />
              Rating: {p.rating} ⭐ ({p.totalRatings || 0} reviews)<br />
              ETA: {p.etaRange || `${p.etaMinutes} mins`} • Fee: ₹{p.baseFee}
            </Popup>
          </Marker>
        ))}

        {/* Connecting Route Line */}
        {routePoints && (
          <Polyline
            positions={routePoints}
            color="#2563eb"
            weight={4}
            dashArray="6, 8"
          />
        )}
      </MapContainer>
    </div>
  );
}
