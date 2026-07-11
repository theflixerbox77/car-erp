/**
 * Explicit allowlist mapper for anything the public storefront returns.
 * Deliberately never spreads the raw Prisma row -- cost/sourcing fields
 * (import/auction/repair cost, minimum price, chassis/engine number,
 * registration details) must never reach an unauthenticated response,
 * and an allowlist is the only shape that stays safe when new columns
 * are added to the vehicle table later.
 */
export function toPublicVehicle(v: {
  id: string;
  stockNumber: string;
  vin: string | null;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  fuelType: string | null;
  transmission: string | null;
  driveType: string | null;
  mileage: number | null;
  color: string | null;
  condition: string | null;
  bodyType: string | null;
  features: unknown;
  sellingPrice: unknown;
  discountAmount: unknown;
  status: string;
  isFeatured: boolean;
  createdAt: Date;
  media?: {
    id: string;
    type: string;
    url: string;
    isPrimary: boolean;
    sortOrder: number;
  }[];
}) {
  return {
    id: v.id,
    stockNumber: v.stockNumber,
    vin: v.vin,
    brand: v.brand,
    model: v.model,
    trim: v.trim,
    year: v.year,
    fuelType: v.fuelType,
    transmission: v.transmission,
    driveType: v.driveType,
    mileage: v.mileage,
    color: v.color,
    condition: v.condition,
    bodyType: v.bodyType,
    features: v.features,
    sellingPrice: v.sellingPrice?.toString() ?? null,
    discountAmount: v.discountAmount?.toString() ?? null,
    status: v.status,
    isFeatured: v.isFeatured,
    createdAt: v.createdAt,
    media: (v.media ?? [])
      .filter((m) => m.type !== 'document')
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((m) => ({
        id: m.id,
        type: m.type,
        url: m.url,
        isPrimary: m.isPrimary,
      })),
  };
}

export type PublicVehicle = ReturnType<typeof toPublicVehicle>;

export const PUBLIC_VEHICLE_SELECT = {
  id: true,
  stockNumber: true,
  vin: true,
  brand: true,
  model: true,
  trim: true,
  year: true,
  fuelType: true,
  transmission: true,
  driveType: true,
  mileage: true,
  color: true,
  condition: true,
  bodyType: true,
  features: true,
  sellingPrice: true,
  discountAmount: true,
  status: true,
  isFeatured: true,
  createdAt: true,
  media: {
    select: {
      id: true,
      type: true,
      url: true,
      isPrimary: true,
      sortOrder: true,
    },
  },
} as const;

/** Statuses a visitor is allowed to browse; sold/hidden/repairing/in_transit never appear publicly. */
export const PUBLIC_VEHICLE_STATUSES = [
  'available',
  'reserved',
  'booked',
] as const;
