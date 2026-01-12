import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SelectTenantPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch real schools from DB
  const { data: memberships } = await supabase
    .from("school_users")
    .select("*, school:schools(*)")
    .eq("user_id", user.id);

  // If no schools, maybe redirect to a "Join School" page or show empty state?
  // For MVP, if they have no school, just show empty.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center">Select Your School</CardTitle>
          <CardDescription className="text-center">
            You are a member of the following schools.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {memberships?.map((m) => (
            <Link key={m.school.id} href={`/${m.school.code}/client/dashboard`}>
              <Button
                variant="outline"
                className="w-full h-16 text-lg justify-start px-6"
              >
                {m.school.name}
              </Button>
            </Link>
          ))}
          {(!memberships || memberships.length === 0) && (
            <div className="text-center text-gray-500">
              No schools found. Please contact your administrator.
            </div>
          )}
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
