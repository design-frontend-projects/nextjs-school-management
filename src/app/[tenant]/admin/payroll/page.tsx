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
import { notFound } from "next/navigation";
import { format } from "date-fns";

export default async function PayrollPage({
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

  // Fetch Payroll records
  const { data: payrolls } = await supabase
    .from("payroll")
    .select("*, staff:staff(*, profile:profiles(full_name))")
    .eq("school_id", school.id)
    .order("payment_date", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
          <p className="text-muted-foreground">
            Salary payments for {school.name}.
          </p>
        </div>
        <Button>Process Payroll</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Recent salary disbursements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.staff?.profile?.full_name || "Unknown"}
                  </TableCell>
                  <TableCell>
                    {record.salary_month} / {record.salary_year}
                  </TableCell>
                  <TableCell>${record.net_salary}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "PAID" ? "default" : "secondary"
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.payment_date
                      ? format(new Date(record.payment_date), "PPP")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
              {!payrolls?.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No payroll records found.
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
