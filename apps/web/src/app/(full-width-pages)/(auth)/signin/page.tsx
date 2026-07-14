import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your BloomCars dealer account.",
};

export default function SignIn() {
  return <SignInForm />;
}
