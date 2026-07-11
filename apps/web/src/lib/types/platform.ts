export interface PlatformDealer {
  id: string;
  slug: string;
  businessName: string;
  subscriptionPlan: string;
  subscriptionStatus: "pending_approval" | "active" | "suspended" | "cancelled";
  createdAt: string;
  approvedAt: string | null;
}
