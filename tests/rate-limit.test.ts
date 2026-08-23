import { describe, it, expect, vi, afterEach } from "vitest";
import { verifierLimite } from "@/lib/rate-limit";

describe("verifierLimite", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("autorise les requêtes jusqu'à la limite", () => {
    const cle = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(verifierLimite(cle, 5, 60_000)).toBe(true);
    }
  });

  it("bloque une fois la limite atteinte", () => {
    const cle = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      verifierLimite(cle, 3, 60_000);
    }
    expect(verifierLimite(cle, 3, 60_000)).toBe(false);
  });

  it("réautorise une fois la fenêtre de temps écoulée", () => {
    vi.useFakeTimers();
    const cle = `test-${Math.random()}`;
    verifierLimite(cle, 1, 1000);
    expect(verifierLimite(cle, 1, 1000)).toBe(false);

    vi.advanceTimersByTime(1001);
    expect(verifierLimite(cle, 1, 1000)).toBe(true);
  });

  it("ne mélange pas les compteurs de deux clés différentes", () => {
    const cleA = `a-${Math.random()}`;
    const cleB = `b-${Math.random()}`;
    verifierLimite(cleA, 1, 60_000);
    expect(verifierLimite(cleA, 1, 60_000)).toBe(false);
    expect(verifierLimite(cleB, 1, 60_000)).toBe(true);
  });
});
