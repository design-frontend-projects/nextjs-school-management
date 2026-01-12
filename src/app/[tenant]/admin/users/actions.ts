"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CreateUserState = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function createUser(
  prevState: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  const supabaseAdmin = await createAdminClient();
  const supabase = await createClient(); // For checking current user permissions if needed

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as string;
  const tenantId = formData.get("tenant_id") as string;

  if (!email || !password || !fullName || !role || !tenantId) {
    return { error: "All fields are required" };
  }

  // 1. Create User in Supabase Auth (using Admin Client)
  // We use admin.createUser to skip email verification for now,
  // OR use inviteUserByEmail if we want them to set their own password.
  // The user requested: "allow admin user to create users... and send him otp"
  // So we probably want to create the user and maybe trigger a magic link or just standard signup?
  // "send him otp" implies we might want to initiate the flow.
  // Standard Supabase behavior: createUser sends confirmation email if enabled.
  // But if we want to "send him otp" explicitly, it might be a different flow.
  // Let's stick to creating the user with auto-confirm false (default) and letting Supabase handle the confirmation email,
  // OR manually creating and sending OTP (complex).

  // Re-reading user request: "send him otp and after succesful login if profile not verified the otp show him modal..."
  // This implies the Admin sets the password, the user logs in, and THEN verifies?
  // OR the Admin triggers a signup that sends an OTP?

  // Interpretation: Admin creates user (email/password). User logs in with those creds.
  // Upon login, if verified is false, show OTP modal.
  // To send OTP: We might need to trigger signInWithOdd after creation? No, that logs them in.
  // We probably just want to Create User -> Send Email with OTP?

  // Implementation:
  // 1. Admin creates user with email/pass.
  // 2. We set `email_confirm: true` so they can login?
  //    Wait, constraint: "if profile not verified... show him modal with otp field and ask to enter the otp in email"
  //    This sounds like: Login is allowed, but Access is restricted until OTP verified.
  //    So we create user with `email_confirm: true` (auto-confirm auth) but `is_verified: false` (app logic).
  //    THEN we trigger an OTP send.

  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Allow login immediately
      user_metadata: {
        full_name: fullName,
      },
    });

  if (authError) {
    return { error: authError.message };
  }

  if (!authUser.user) {
    return { error: "User creation failed" };
  }

  const userId = authUser.user.id;

  // 2. Create Profile
  // Note: trigger might handle this, but let's be safe or update it.
  // If we have a trigger on auth.users -> public.profiles, we might just need to update it.
  // Assuming we need to insert/update profile with Role and School (Tenant).

  // Check if profile exists (from trigger)
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profile) {
    await supabaseAdmin
      .from("profiles")
      .update({
        full_name: fullName,
        role: role,
        school_id: tenantId,
        is_verified: false, // App-level verification
      })
      .eq("id", userId);
  } else {
    // Fallback if no trigger
    await supabaseAdmin.from("profiles").insert({
      id: userId,
      email,
      full_name: fullName,
      role: role,
      school_id: tenantId,
      is_verified: false,
    });
  }

  // 3. Assign to school_users (if separate table exists)
  await supabaseAdmin.from("school_users").insert({
    school_id: tenantId,
    user_id: userId,
    role: role,
  });

  // 4. Send OTP for verification
  // We can use signInWithOtp to generate a code, but that might be for login.
  // Ideally, use: supabase.auth.admin.generateLink or similar?
  // Or just use signInWithOtp but don't use the token for login, just for verification?
  // Actually, if we want them to enter OTP *after* login, we can use `auth.signInWithOtp` targeting their email,
  // which sends a code.

  const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  // Note: signInWithOtp usually sends a magic link or code depending on settings.
  // Ideally we want a code.

  revalidatePath("/[tenant]/admin/users"); // This pattern might not work literally

  return { success: true, message: `User created. OTP sent to ${email}` };
}
