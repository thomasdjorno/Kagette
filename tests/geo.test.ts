import { describe, it, expect } from "vitest";
import { distanceKm } from "@/lib/geo";

describe("distanceKm", () => {
  it("renvoie 0 pour deux points identiques", () => {
    expect(distanceKm(45.1719, 0.6667, 45.1719, 0.6667)).toBeCloseTo(0, 5);
  });

  it("calcule une distance cohérente entre Mensignac et Périgueux (environ 10-15 km à vol d'oiseau)", () => {
    // Mensignac ~45.2378, 0.6717 / Périgueux ~45.1848, 0.7211
    const km = distanceKm(45.2378, 0.6717, 45.1848, 0.7211);
    expect(km).toBeGreaterThan(5);
    expect(km).toBeLessThan(20);
  });

  it("est symétrique (A→B == B→A)", () => {
    const aVersB = distanceKm(45.2378, 0.6717, 45.1848, 0.7211);
    const bVersA = distanceKm(45.1848, 0.7211, 45.2378, 0.6717);
    expect(aVersB).toBeCloseTo(bVersA, 10);
  });
});
