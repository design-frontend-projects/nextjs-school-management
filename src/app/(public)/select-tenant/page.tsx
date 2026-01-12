import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SelectTenantPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // TODO: Fetch real tenants from DB
  // const { data: memberships } = await supabase.from('tenant_users').select('*, tenant:tenants(*)').eq('user_id', user.id);

  // Mock Data for MVP visualization
  const mockTenants = [
    { id: "1", name: "Springfield High", slug: "springfield" },
    { id: "2", name: "Shelbyville Elementary", slug: "shelbyville" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">Select Your School</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {mockTenants.map((t) => (
            <Link key={t.id} href={`/${t.slug}/client/dashboard`}>
              <Button
                variant="outline"
                className="w-full h-16 text-lg justify-start px-6"
              >
                {t.name}
              </Button>
            </Link>
          ))}
          <div className="text-center mt-4 text-sm text-gray-500">
            Don&apos;t see your school? Contact support.
          </div>
          <form
            action={async () => {
              "use server";
              const { logout } = await import("@/app/auth/actions");
              await logout();
            }}
          >
            <Button variant="link" className="w-full text-red-500">
              Logout
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
