import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client/client-sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ClientSidebar />
      <main className="w-full">
        <div className="p-2 border-b flex items-center gap-2">
          <SidebarTrigger />
          <span className="font-semibold text-sm">Learning Center</span>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
