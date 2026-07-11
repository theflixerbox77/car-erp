import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage({ params }: { params: Promise<{ dealer: string }> }) {
  const { dealer } = await params;
  return <RegisterForm dealer={dealer} />;
}
