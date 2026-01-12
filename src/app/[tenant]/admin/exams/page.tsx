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
import { format } from "date-fns";

export default async function ExamsPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const supabase = await createClient();

  // 1. Resolve School
  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("code", tenant)
    .single();

  if (!school) {
    notFound();
  }

  // 2. Fetch Exams with Result Count
  const { data: exams } = await supabase
    .from("exams")
    .select("*, exam_results(count)")
    .eq("school_id", school.id)
    .order("exam_date", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Exams</h2>
          <p className="text-muted-foreground">
            Examinations scheduled for {school.name}.
          </p>
        </div>
        <Button>Schedule Exam</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Schedule</CardTitle>
          <CardDescription>Upcoming and past examinations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Results Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams?.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>
                    {exam.exam_date
                      ? format(new Date(exam.exam_date), "PPP")
                      : "TBD"}
                  </TableCell>
                  <TableCell>
                    {exam.exam_results?.[0]?.count || 0} entries
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!exams?.length && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-muted-foreground"
                  >
                    No exams found.
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
