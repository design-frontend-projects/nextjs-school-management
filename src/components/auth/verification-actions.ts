"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function verifyUserAccount(otp: string) {
  const supabase = await createClient();

  // 1. Verify OTP using Supabase Auth
  // Since we are already logged in, we might be verifying a new contact/email
  // OR we are verifying the initial account creation which used a generic OTP flow.
  // The user request says: "ask to enter the otp in email after check if mark user as verified"
  // This implies the OTP was sent to their email.
  // If we used `signInWithOtp` in the admin creation step, the code is for *login*.
  // But the user is *already* logged in (via password set by Admin? No, Admin set password).
  // So the user logs in with password.
  // Then we need to verify them.
  // We can use `verifyOtp` with type 'email'.

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return { error: "User not found" };

  const { error } = await supabase.auth.verifyOtp({
    email: user.email,
    token: otp,
    type: "email",
  });

  if (error) {
    return { error: error.message };
  }

  // 2. Mark profile as verified
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ is_verified: true })
    .eq("id", user.id);

  if (updateError) {
    // If column doesn't exist, we might fail here.
    // We should handle this gracefully or assume migration will run.
    console.error("Profile update failed:", updateError);
    // If it fails, maybe we just proceed? But explicit requirement is to mark verified.
    // If column missing, this errors. I will assume user will fix schema or I'll try to run SQL later.
    return { error: "Failed to update profile verification status" };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function resendVerificationOtp() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !user.email) return { error: "User not found" };

  const { error } = await supabase.auth.signInWithOtp({
    email: user.email,
    options: { shouldCreateUser: false },
  });

  if (error) return { error: error.message };
  return { success: true, message: "OTP sent" };
}
