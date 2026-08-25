import { describe, it, expect } from "vitest";
import { kgFruitsVersCo2, co2VersKmVoiture, formatKg } from "@/lib/impact";

describe("kgFruitsVersCo2", () => {
  it("applique le facteur de conversion défini (0,4 kg CO2e / kg de fruit)", () => {
    expect(kgFruitsVersCo2(10)).toBeCloseTo(4, 5);
    expect(kgFruitsVersCo2(0)).toBe(0);
  });
});

describe("co2VersKmVoiture", () => {
  it("convertit du CO2 évité en kilomètres de voiture équivalents (0,2 kg CO2e / km)", () => {
    expect(co2VersKmVoiture(1)).toBeCloseTo(5, 5);
    expect(co2VersKmVoiture(10)).toBeCloseTo(50, 5);
  });
});

describe("formatKg", () => {
  it("formate un nombre entier sans décimale", () => {
    expect(formatKg(73)).toBe("73 kg");
  });

  it("arrondit à une décimale maximum", () => {
    expect(formatKg(29.166)).toBe("29,2 kg");
  });
});
