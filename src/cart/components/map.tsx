import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const geolocationUnsupportedMessage =
  "Geolocation is not supported in this browser.";

function RecenterMap({ location }: { location: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(location, map.getZoom());
  }, [location, map]);

  return null;
}

function LocationPicker({
  onLocationChange,
}: {
  onLocationChange: (location: [number, number]) => void;
}) {
  useMapEvent("click", (event: any) => {
    onLocationChange([event.latlng.lat, event.latlng.lng]);
  });

  return null;
}

export default function MapWithGPS(params: {
  location: [number, number] | null;
  setLocation: Dispatch<SetStateAction<[number, number] | null>>;
}) {
  const { location, setLocation } = params;
  const isGeolocationSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;
  const [error, setError] = useState<string | null>(
    isGeolocationSupported ? null : geolocationUnsupportedMessage,
  );

  useEffect(() => {
    if (!isGeolocationSupported) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setError(null);
        setLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error(err);
        setError(err.message || "Unable to fetch your location.");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
    );
  }, [isGeolocationSupported]);

  if (error) return <p>{error}</p>;
  if (!location) return <p>Loading location...</p>;

  return (
    <>
      <span>Pick Location</span>
      <MapContainer
        center={location}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap location={location} />
        <LocationPicker onLocationChange={setLocation} />
        <Marker position={location}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
