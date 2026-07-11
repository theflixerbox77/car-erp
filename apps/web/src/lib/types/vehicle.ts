export const VEHICLE_STATUSES = ["available", "reserved", "sold", "in_transit", "repairing", "booked", "hidden"] as const;
export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
  in_transit: "In Transit",
  repairing: "Repairing",
  booked: "Booked",
  hidden: "Hidden",
};

export const STATUS_BADGE_COLOR: Record<VehicleStatus, "success" | "warning" | "error" | "info" | "light"> = {
  available: "success",
  reserved: "warning",
  sold: "light",
  in_transit: "info",
  repairing: "error",
  booked: "warning",
  hidden: "light",
};

export interface VehicleMedia {
  id: string;
  type: "image" | "video" | "360" | "document";
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface VehicleStatusHistoryEntry {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  stockNumber: string;
  vin: string | null;
  chassisNumber: string | null;
  engineNumber: string | null;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  auctionGrade: string | null;
  registrationNumber: string | null;
  registrationExpiry: string | null;
  fuelType: string | null;
  transmission: string | null;
  driveType: string | null;
  mileage: number | null;
  color: string | null;
  condition: string | null;
  bodyType: string | null;
  features: string[];

  importCost: string;
  auctionCost: string;
  shippingCost: string;
  customsCost: string;
  repairCost: string;
  registrationCost: string;
  totalCost: string;
  sellingPrice: string | null;
  expectedProfit: string | null;
  minimumPrice: string | null;
  discountAmount: string;

  status: VehicleStatus;
  isFeatured: boolean;
  soldAt: string | null;
  createdAt: string;
  updatedAt: string;

  media?: VehicleMedia[];
  statusHistory?: VehicleStatusHistoryEntry[];
}

export interface VehicleListResponse {
  items: Vehicle[];
  total: number;
  limit: number;
  offset: number;
}
