"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // Type-casting for simplicity, should validate with Zod
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
    // In a real app, we'd return state to display error
    // For now, redirect or throw
    // redirect('/login?error=' + error.message)
  }

  // Active Tenant Resolution
  // 1. Fetch user's tenants
  // 2. If 1 -> Redirect to /slug/dashboard
  // 3. If Many -> Redirect to /select-tenant
  // For MVP, simplistic redirect:

  // TODO: Fetch user profile and tenants
  // const { data: profile } = await supabase...

  revalidatePath("/", "layout");
  redirect("/select-tenant"); // Placeholder
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Check your email to continue sign in process");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
