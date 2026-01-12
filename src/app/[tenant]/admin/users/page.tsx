import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { CreateUserDialog } from "./create-user-dialog";

export default async function UsersPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const supabase = await createClient();

  // 1. Resolve School ID from Tenant Code
  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("code", tenant)
    .single();

  if (!school) {
    notFound();
  }

  // 2. Fetch School Users with Profiles
  const { data: members, error: membersError } = await supabase
    .from("school_users")
    .select("*, profile:profiles(*)")
    .eq("school_id", school.id);

  if (membersError) {
    console.error("Error fetching members:", membersError);
  }

  // 3. Fetch User Roles for this school
  const { data: userRolesValues, error: rolesError } = await supabase
    .from("user_roles")
    .select("user_id, role:roles(name)")
    .eq("school_id", school.id);

  if (rolesError) {
    console.error("Error fetching roles:", rolesError);
  }

  // 4. Merge Data
  const users =
    members?.map((m) => {
      const roles = userRolesValues
        ?.filter((ur) => ur.user_id === m.user_id)
        .map(
          (ur: unknown) =>
            (ur as { role?: { name: string } }).role?.name || "Unknown"
        );

      // Fallback for null profile
      const profile = m.profile || { email: "Unknown", full_name: "Unknown" };

      return {
        id: m.user_id,
        name: profile.full_name || "N/A",
        email: profile.email,
        roles: roles?.length ? roles : ["member"],
        status: m.is_active ? "active" : "inactive",
        joined_at: m.joined_at,
      };
    }) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage users for {school.name}.
          </p>
        </div>
        <div className="gap-2 flex">
          <Button variant="outline">Invite User</Button>
          <CreateUserDialog tenantId={school?.id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Directory of students, teachers, and staff.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((r: string) => (
                        <Badge key={r} variant="outline" className="capitalize">
                          {r}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
