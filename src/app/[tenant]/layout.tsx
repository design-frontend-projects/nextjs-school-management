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

  // We should verify if this 'tenant' (which is the school code) exists.
  // Ideally this happens in Middleware, but double check here.
  // For MVP, we pass it down.

  return (
    <div className="min-h-screen flex flex-col">
      {/* Context Provider for School ID could go here */}
      <div className="bg-slate-900 text-white p-2 text-xs text-center">
        School Context: {tenant}
      </div>
      {children}
    </div>
  );
}
