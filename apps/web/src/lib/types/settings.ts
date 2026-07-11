export interface BusinessSettings {
  id: string;
  slug: string;
  businessName: string;
  legalName: string | null;
  logoUrl: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  whatsappNumber: string | null;
  customDomain: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
  storefrontSettings: { about?: string; heroImageUrl?: string } | null;
}

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: "active" | "suspended";
  lastLoginAt: string | null;
  createdAt: string;
  role: { id: string; name: string } | null;
}

export interface TeamRole {
  id: string;
  name: string;
}
