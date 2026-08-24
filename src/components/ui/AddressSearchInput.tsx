"use client";

import { useRef, useState } from "react";

interface Suggestion {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
}

export function AddressSearchInput({
  onSelect,
  placeholder = "Cherche ton adresse ou ta commune...",
}: {
  onSelect: (result: { label: string; latitude: number; longitude: number }) => void;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [chargement, setChargement] = useState(false);
  const [selectionnee, setSelectionnee] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  function onChange(value: string) {
    setQuery(value);
    setSelectionnee(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!token || value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setChargement(true);
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${token}&country=fr&language=fr&proximity=0.6667,45.1719&limit=5`
        );
        const data = await res.json();
        setSuggestions(
          (data.features ?? []).map((f: { id: string; place_name: string; center: [number, number] }) => ({
            id: f.id,
            label: f.place_name,
            longitude: f.center[0],
            latitude: f.center[1],
          }))
        );
      } catch {
        setSuggestions([]);
      }
      setChargement(false);
    }, 300);
  }

  function choisir(s: Suggestion) {
    setQuery(s.label);
    setSuggestions([]);
    setSelectionnee(true);
    onSelect({ label: s.label, latitude: s.latitude, longitude: s.longitude });
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-kagette-prune-700/15 bg-white px-4 py-2.5 text-sm focus:border-kagette-framboise-500 focus:outline-none focus:ring-2 focus:ring-kagette-framboise-100"
      />
      {chargement && <p className="mt-1 text-xs text-kagette-prune-700/40">Recherche...</p>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-kagette-prune-700/10 bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => choisir(s)}
                className="block w-full px-4 py-2 text-left text-sm text-kagette-prune-700 hover:bg-kagette-feuille-50"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectionnee && <p className="mt-1 text-xs text-kagette-feuille-600">✓ Position enregistrée</p>}
    </div>
  );
}
