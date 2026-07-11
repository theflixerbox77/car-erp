import { getDealer } from "@/lib/dealer";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function DealerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dealer: string }>;
}) {
  const { dealer: slug } = await params;
  const dealer = await getDealer(slug);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader dealer={dealer} />
      <main className="flex-1">{children}</main>
      <SiteFooter dealer={dealer} />
      {dealer.whatsappNumber && <WhatsAppButton number={dealer.whatsappNumber} message={`Hi ${dealer.businessName}, I have a question.`} />}
    </div>
  );
}
