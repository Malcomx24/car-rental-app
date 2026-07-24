"use client";

import { useEffect, useMemo, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "next-themes";
import { Loader2, AlertCircle } from "lucide-react";

interface LocationData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  latitude: number | null;
  longitude: number | null;
  isAirport: boolean;
  operatingHours: string | null;
}

interface GoogleMapProps {
  locations: LocationData[];
  highlightedId: string | null;
  onMarkerClick: (id: string) => void;
  selectedLocation?: LocationData | null;
}

function createIcon(isHighlighted: boolean): L.DivIcon {
  const size = isHighlighted ? 30 : 22;
  const color = isHighlighted ? "#f59e0b" : "#f97316";
  return L.divIcon({
    className: "",
    html: `<div style="
      width: ${size}px; height: ${size}px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

const DEFAULT_ICON = createIcon(false);
const HIGHLIGHTED_ICON = createIcon(true);

const LIGHT_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const DARK_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>';

function FlyToLocation({ location }: { location: LocationData | null }) {
  const map = useMap();

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      map.flyTo([location.latitude, location.longitude], 14, {
        duration: 1.2,
      });
    }
  }, [location, map]);

  return null;
}

function FitBounds({ locations }: { locations: LocationData[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    if (locations.length === 1 && locations[0].latitude && locations[0].longitude) {
      map.setView([locations[0].latitude, locations[0].longitude], 13);
      return;
    }

    const bounds = L.latLngBounds(
      locations
        .filter((l) => l.latitude != null && l.longitude != null)
        .map((l) => [l.latitude!, l.longitude!] as L.LatLngTuple)
    );

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);

  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({
    click: () => onMapClick(),
  });
  return null;
}

export function GoogleMap({
  locations,
  highlightedId,
  onMarkerClick,
}: GoogleMapProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const validLocations = useMemo(
    () => locations.filter((l) => l.latitude != null && l.longitude != null),
    [locations]
  );

  const center = useMemo(() => {
    if (validLocations.length === 0) return [31.7917, -7.0926] as L.LatLngTuple;
    if (validLocations.length === 1) {
      return [validLocations[0].latitude!, validLocations[0].longitude!] as L.LatLngTuple;
    }
    const bounds = L.latLngBounds(
      validLocations.map((l) => [l.latitude!, l.longitude!] as L.LatLngTuple)
    );
    return bounds.getCenter();
  }, [validLocations]);

  const selectedLocation = useMemo(
    () => validLocations.find((l) => l.id === highlightedId) || null,
    [highlightedId, validLocations]
  );

  const handleMapClick = useCallback(() => {
    onMarkerClick("");
  }, [onMarkerClick]);

  if (validLocations.length === 0) {
    return (
      <div className="w-full h-[450px] md:h-[550px] rounded-2xl overflow-hidden bg-muted/50 border border-border flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            No locations with coordinates to display on map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-border">
      <MapContainer
        center={center}
        zoom={validLocations.length === 1 ? 13 : 6}
        className="w-full h-[450px] md:h-[550px]"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          key={isDark ? "dark" : "light"}
          attribution={ATTRIBUTION}
          url={isDark ? DARK_URL : LIGHT_URL}
        />
        <FitBounds locations={validLocations} />
        <FlyToLocation location={selectedLocation} />
        <MapClickHandler onMapClick={handleMapClick} />

        {validLocations.map((loc) => {
          const isHighlighted = highlightedId === loc.id;
          const fullAddress = [loc.address, loc.city, loc.state]
            .filter(Boolean)
            .join(", ");
          const phoneClean = loc.phone?.replace(/[^0-9+]/g, "") || "";
          const waNumber = phoneClean.replace("+", "");
          const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`;
          const browseUrl = `/cars?location=${loc.id}`;

          return (
            <Marker
              key={loc.id}
              position={[loc.latitude!, loc.longitude!]}
              icon={isHighlighted ? HIGHLIGHTED_ICON : DEFAULT_ICON}
              eventHandlers={{
                click: () => onMarkerClick(loc.id),
              }}
            >
              <Popup>
                <div className="font-sans min-w-[220px]">
                  <h3 className="font-bold text-sm mb-1">{loc.name}</h3>
                  <p className="text-xs text-gray-500 mb-1 leading-relaxed">
                    {fullAddress}
                  </p>
                  {loc.phone && (
                    <p className="text-xs text-gray-500 mb-1">{loc.phone}</p>
                  )}
                  {loc.isAirport && (
                    <p className="text-xs text-blue-600 font-semibold mb-2">
                      Airport Pickup Available
                    </p>
                  )}
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {waNumber && (
                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noopener"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#25d366] text-white text-[11px] font-semibold no-underline"
                      >
                        WhatsApp
                      </a>
                    )}
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#f97316] text-white text-[11px] font-semibold no-underline"
                    >
                      Directions
                    </a>
                    <a
                      href={browseUrl}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-900 text-white text-[11px] font-semibold no-underline"
                    >
                      Browse Cars
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
