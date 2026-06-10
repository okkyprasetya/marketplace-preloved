"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "buyer",
    },
  });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setServerError(payload?.message ?? "Registration failed");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInResult?.error) {
      toast.success("Account created. Please login.");
      router.push("/login");
      return;
    }

    toast.success("Account created");
    router.push("/");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="text-sm font-medium text-gray-800" htmlFor="name">
          Name
        </label>
        <input
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-950 outline-none ring-orange-500 focus:ring-2"
          id="name"
          {...register("name")}
        />
        {errors.name ? <p className="mt-1 text-sm text-red-600">{errors.name.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800" htmlFor="email">
          Email
        </label>
        <input
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-950 outline-none ring-orange-500 focus:ring-2"
          id="email"
          type="email"
          {...register("email")}
        />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800" htmlFor="password">
          Password
        </label>
        <input
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-950 outline-none ring-orange-500 focus:ring-2"
          id="password"
          type="password"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-800" htmlFor="role">
          Role
        </label>
        <select
          className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-950 outline-none ring-orange-500 focus:ring-2"
          id="role"
          {...register("role")}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        {errors.role ? <p className="mt-1 text-sm text-red-600">{errors.role.message}</p> : null}
      </div>

      {serverError ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>
      ) : null}

      <button
        className="w-full rounded-md bg-orange-600 px-4 py-2 font-semibold text-white shadow-sm hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Creating account..." : "Register"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already registered?{" "}
        <Link className="font-semibold text-orange-700 hover:text-orange-800" href="/login">
          Login
        </Link>
      </p>
    </form>
  );
}
