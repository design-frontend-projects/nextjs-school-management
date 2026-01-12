import { ReactNode } from "react";
// import { notFound } from "next/navigation";

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

  // TODO: Verify tenant existence via DB or API.
  // if (!isValidTenant(tenant)) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Context Provider for Tenant ID could go here */}
      <div className="bg-slate-900 text-white p-2 text-xs text-center">
        Tenant Context: {tenant}
      </div>
      {children}
    </div>
  );
}
