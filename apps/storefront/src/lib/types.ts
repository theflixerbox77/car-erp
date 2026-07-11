export interface DealerProfile {
  id: string;
  slug: string;
  businessName: string;
  logoUrl: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  storefrontSettings: { about?: string; heroImageUrl?: string } | null;
}

export interface PublicVehicleMedia {
  id: string;
  type: "image" | "video" | "360";
  url: string;
  isPrimary: boolean;
}

export interface PublicVehicle {
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
  features: string[];
  sellingPrice: string | null;
  discountAmount: string | null;
  status: string;
  isFeatured: boolean;
  createdAt: string;
  media: PublicVehicleMedia[];
}

export interface PublicVehicleListResponse {
  tenant: DealerProfile;
  items: PublicVehicle[];
  total: number;
  limit: number;
  offset: number;
}
