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
import { notFound } from "next/navigation";

export default async function HRPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const supabase = await createClient();

  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("code", tenant)
    .single();

  if (!school) {
    notFound();
  }

  // Fetch Staff with Profiles
  const { data: staffList } = await supabase
    .from("staff")
    .select("*, profile:profiles(*)")
    .eq("school_id", school.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">HR & Payroll</h2>
          <p className="text-muted-foreground">
            Manage staff and salaries for {school.name}.
          </p>
        </div>
        <Button>Add Staff Member</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>
            {staffList?.length || 0} active staff members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Member</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList?.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">
                    {staff.profile?.full_name || "Unknown"}
                    <div className="text-xs text-muted-foreground">
                      {staff.profile?.email || "-"}
                    </div>
                  </TableCell>
                  <TableCell>{staff.designation}</TableCell>
                  <TableCell>${staff.base_salary}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Payroll
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!staffList?.length && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No staff records found.
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
