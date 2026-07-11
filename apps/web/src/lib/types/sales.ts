export interface Customer {
  id: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  nidNumber: string | null;
  licenseNumber: string | null;
  notes: string | null;
  source: string | null;
  createdAt: string;
  interactions?: CustomerInteraction[];
  interests?: { vehicle: { id: string; brand: string; model: string; year: number; stockNumber: string } }[];
  leads?: Lead[];
  sales?: Sale[];
}

export interface CustomerInteraction {
  id: string;
  type: "call" | "visit" | "whatsapp" | "email" | "note";
  summary: string;
  occurredAt: string;
}

export const LEAD_STAGES = ["new", "contacted", "negotiation", "booked", "payment_pending", "delivered", "completed", "lost"] as const;
export type LeadStage = (typeof LEAD_STAGES)[number];

export const LEAD_STAGE_LABELS: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  negotiation: "Negotiation",
  booked: "Booked",
  payment_pending: "Payment Pending",
  delivered: "Delivered",
  completed: "Completed",
  lost: "Lost",
};

export const PIPELINE_STAGES: LeadStage[] = ["new", "contacted", "negotiation", "booked", "payment_pending", "delivered"];

export interface Lead {
  id: string;
  stage: LeadStage;
  source: string | null;
  createdAt: string;
  customer: { id: string; fullName: string; phone: string | null; email: string | null };
  vehicle: { id: string; brand: string; model: string; year: number; stockNumber: string } | null;
}

export type LeadBoard = Record<LeadStage, Lead[]>;

export interface Sale {
  id: string;
  salePrice: string;
  discount: string;
  commissionRate: string;
  commissionAmount: string;
  profit: string;
  paymentStatus: "pending" | "partial" | "paid";
  status: string;
  deliveryDate: string | null;
  warrantyMonths: number | null;
  createdAt: string;
  customer: { id: string; fullName: string; phone: string | null; email: string | null };
  vehicle: { id: string; brand: string; model: string; year: number; stockNumber: string; totalCost: string };
  payments: SalePayment[];
  documents: SaleDocument[];
}

export interface StorefrontInquiry {
  id: string;
  customerName: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  source: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: string;
  vehicle: { id: string; brand: string; model: string; year: number; stockNumber: string } | null;
}

export interface Booking {
  id: string;
  type: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  note: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
  vehicle: { id: string; brand: string; model: string; year: number; stockNumber: string };
}

export interface SalePayment {
  id: string;
  amount: string;
  method: string;
  paidAt: string;
  referenceNote: string | null;
}

export interface SaleDocument {
  id: string;
  type: string;
  generatedAt: string;
}
