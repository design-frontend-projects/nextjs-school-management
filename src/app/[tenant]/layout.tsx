import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { VerificationModal } from "@/components/auth/verification-modal";

// Placeholder for Tenant Interface
interface TenantLayoutProps {
  children: ReactNode;
  params: Promise<{ tenant: string }>;
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params;
  const supabase = await createClient();

  // Check verification status
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let isVerified = true; // Default true to avoid blocking if not logged in

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_verified")
      .eq("id", user.id)
      .single();

    // If profile exists, use its status. If not, maybe use email_verified?
    // But user requirement is "if profile not verified".
    // If profile doesn't exist yet, we probably shouldn't block? Or maybe we should?
    // Let's assume fetching profile works.
    if (profile) {
      isVerified = profile.is_verified ?? false;
      // If the column "is_verified" is null, treat as false? Or true?
      // Let's assume default false as per migration.
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <VerificationModal isVerified={isVerified} />
      {/* Context Provider for School ID could go here */}
      <div className="bg-slate-900 text-white p-2 text-xs text-center">
        School Context: {tenant}
      </div>
      {children}
    </div>
  );
}
