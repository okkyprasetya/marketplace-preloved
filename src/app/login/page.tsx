import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth-card";
import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <AuthCard title="Login" subtitle="Access your buyer, seller, or admin workspace.">
      <LoginForm />
    </AuthCard>
  );
}
