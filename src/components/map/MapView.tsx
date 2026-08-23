"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cercleGeoJSON } from "@/lib/geo";

export interface FruitMapMarker {
  id: string;
  latitude: number;
  longitude: number;
  variete: string;
  zoneRetrait: string;
  donneurPrenom: string;
  mode: "DON" | "PARTICIPATION_LIBRE";
}

export interface ProductMapMarker {
  id: string;
  latitude: number;
  longitude: number;
  titre: string;
  zoneRetrait: string;
  cuisinierPrenom: string;
  prix: string;
}

interface MapViewProps {
  region: { nom: string; latitude: number; longitude: number; rayonKm: number };
  fruits: FruitMapMarker[];
  produits: ProductMapMarker[];
}

const FEUILLE = "#8a5a35";
const FRAMBOISE = "#2C4F3E";

function creerElementMarqueur(emoji: string, couleur: string) {
  const el = document.createElement("div");
  el.style.width = "34px";
  el.style.height = "34px";
  el.style.borderRadius = "9999px";
  el.style.background = couleur;
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontSize = "16px";
  el.style.border = "2px solid white";
  el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.3)";
  el.style.cursor = "pointer";
  el.textContent = emoji;
  return el;
}

export function MapView({ region, fruits, produits }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [tokenManquant, setTokenManquant] = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token || !token.startsWith("pk.")) {
      setTokenManquant(true);
      return;
    }
    if (!containerRef.current || mapRef.current) return;

    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [region.longitude, region.latitude],
      zoom: 10,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      map.addSource("region-rayon", {
        type: "geojson",
        data: cercleGeoJSON(region.longitude, region.latitude, region.rayonKm),
      });
      map.addLayer({
        id: "region-rayon-fill",
        type: "fill",
        source: "region-rayon",
        paint: { "fill-color": FEUILLE, "fill-opacity": 0.06 },
      });
      map.addLayer({
        id: "region-rayon-line",
        type: "line",
        source: "region-rayon",
        paint: { "line-color": FEUILLE, "line-width": 1.5, "line-dasharray": [2, 2] },
      });

      for (const fruit of fruits) {
        const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(
          `<div style="font-family:system-ui;min-width:160px">
             <p style="margin:0;font-size:11px;font-weight:600;color:${FEUILLE};text-transform:uppercase">Fruits à récolter</p>
             <p style="margin:4px 0 2px;font-weight:700;color:#3b2a1c">${fruit.variete}</p>
             <p style="margin:0;font-size:12px;color:#5c453099">${fruit.zoneRetrait} — chez ${fruit.donneurPrenom}</p>
             <a href="/fruits/${fruit.id}" style="display:inline-block;margin-top:6px;font-size:12px;font-weight:600;color:${FEUILLE}">Voir l'annonce →</a>
           </div>`
        );
        new mapboxgl.Marker({ element: creerElementMarqueur("🍃", FEUILLE) })
          .setLngLat([fruit.longitude, fruit.latitude])
          .setPopup(popup)
          .addTo(map);
      }

      for (const produit of produits) {
        const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(
          `<div style="font-family:system-ui;min-width:160px">
             <p style="margin:0;font-size:11px;font-weight:600;color:${FRAMBOISE};text-transform:uppercase">Produit transformé</p>
             <p style="margin:4px 0 2px;font-weight:700;color:#3b2a1c">${produit.titre}</p>
             <p style="margin:0;font-size:12px;color:#5c453099">${produit.zoneRetrait} — par ${produit.cuisinierPrenom}</p>
             <a href="/produits/${produit.id}" style="display:inline-block;margin-top:6px;font-size:12px;font-weight:600;color:${FRAMBOISE}">Voir l'annonce →</a>
           </div>`
        );
        new mapboxgl.Marker({ element: creerElementMarqueur("🍯", FRAMBOISE) })
          .setLngLat([produit.longitude, produit.latitude])
          .setPopup(popup)
          .addTo(map);
      }
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          const el = document.createElement("div");
          el.style.width = "18px";
          el.style.height = "18px";
          el.style.borderRadius = "9999px";
          el.style.background = "#2563eb";
          el.style.border = "3px solid white";
          el.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.25)";
          new mapboxgl.Marker({ element: el }).setLngLat([longitude, latitude]).addTo(map);
        },
        () => {
          // géolocalisation refusée ou indisponible : on reste centré sur la région
        },
        { timeout: 5000 }
      );
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (tokenManquant) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-kagette-prune-700/20 bg-white px-6 text-center">
        <p className="text-sm font-medium text-kagette-prune-700">
          La carte n&apos;est pas encore configurée
        </p>
        <p className="mt-1 max-w-sm text-xs text-kagette-prune-700/60">
          Ajoute un token Mapbox (<code>NEXT_PUBLIC_MAPBOX_TOKEN</code>) dans <code>.env</code>{" "}
          pour afficher la carte des annonces autour de {region.nom}.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-kagette-prune-700/10">
      <div ref={containerRef} className="h-80 w-full sm:h-96" />
      <div className="flex flex-wrap items-center gap-4 bg-white px-4 py-2 text-xs text-kagette-prune-700/70">
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: FEUILLE }}
          />
          Fruits à récolter
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ background: FRAMBOISE }}
          />
          Produits transformés
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-dashed border-kagette-feuille-500" />
          Rayon de {region.rayonKm} km — {region.nom}
        </span>
      </div>
    </div>
  );
}
