import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type LocationState = {
  accuracy: number;
  latitude: number;
  longitude: number;
  timestamp: number;
};

export default function MapWithGPS() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setError(null);
        setLocation({
          accuracy: pos.coords.accuracy,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          timestamp: pos.timestamp,
        });
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

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  if (error) return <p>{error}</p>;
  if (!location) return <p>Loading location...</p>;

  const position: [number, number] = [location.latitude, location.longitude];
  const accuracyLabel =
    location.accuracy < 50
      ? "GPS-level"
      : location.accuracy < 500
        ? "Approximate"
        : "Very rough";

  return (
    <>
      <div style={{ marginBottom: "12px", textAlign: "left" }}>
        <p>
          Lat: {location.latitude.toFixed(6)}, Lng:{" "}
          {location.longitude.toFixed(6)}
        </p>
        <p>
          Accuracy: {Math.round(location.accuracy)} m ({accuracyLabel})
        </p>
        <p>Updated: {new Date(location.timestamp).toLocaleString()}</p>
      </div>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "500px", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </>
  );
}
