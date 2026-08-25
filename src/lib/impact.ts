import type { OrderStatus } from "@prisma/client";

/**
 * Estimations d'équivalence CO2 pour le tableau d'impact. Ce sont des
 * ordres de grandeur pédagogiques (pas une mesure certifiée) basés sur :
 * - l'empreinte carbone moyenne de production d'un kg de fruits
 *   (~0,4 kg CO2e/kg, cohérent avec les moyennes académiques pour les
 *   fruits, nettement plus basses que la viande ou les produits laitiers)
 * - les émissions moyennes d'une voiture particulière en France
 *   (~0,2 kg CO2e/km)
 */
export const CO2_PAR_KG_FRUIT = 0.4;
export const KM_VOITURE_PAR_KG_CO2 = 1 / 0.2;

export function kgFruitsVersCo2(kgFruits: number): number {
  return kgFruits * CO2_PAR_KG_FRUIT;
}

export function co2VersKmVoiture(kgCo2: number): number {
  return kgCo2 * KM_VOITURE_PAR_KG_CO2;
}

export function formatKg(kg: number): string {
  return `${kg.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} kg`;
}

const ORDER_STATUTS_ABOUTIS: OrderStatus[] = ["PAYEE", "PRETE_RETRAIT", "RECUPEREE"];
export const ordersAboutis = { statut: { in: ORDER_STATUTS_ABOUTIS } };
