import LoginForm from "@/components/LoginForm";

export default async function LoginPage({ params }: { params: Promise<{ dealer: string }> }) {
  const { dealer } = await params;
  return <LoginForm dealer={dealer} />;
}
