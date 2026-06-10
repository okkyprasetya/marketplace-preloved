import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth-card";
import { RegisterForm } from "@/components/register-form";

export default async function RegisterPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <AuthCard title="Register" subtitle="Create a buyer or seller account for the marketplace.">
      <RegisterForm />
    </AuthCard>
  );
}
