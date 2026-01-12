import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-2 border-b flex items-center gap-2">
          <SidebarTrigger />
          <span className="font-semibold text-sm">School Admin Console</span>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
