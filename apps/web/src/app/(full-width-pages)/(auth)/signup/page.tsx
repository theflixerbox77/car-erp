import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register Your Dealership",
  description: "Create your BloomCars dealer account.",
};

export default function SignUp() {
  return <SignUpForm />;
}
