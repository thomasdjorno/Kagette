// Génère un polygone GeoJSON approximant un cercle de `radiusKm` autour d'un
// centre, pour visualiser le rayon de couverture d'une région sur la carte.
export function cercleGeoJSON(
  centerLng: number,
  centerLat: number,
  radiusKm: number,
  points = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const distanceX = radiusKm / (111.32 * Math.cos((centerLat * Math.PI) / 180));
  const distanceY = radiusKm / 110.574;

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    coords.push([centerLng + distanceX * Math.cos(angle), centerLat + distanceY * Math.sin(angle)]);
  }

  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coords] },
  };
}
