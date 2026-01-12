import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import { BookOpen, Trophy, Clock } from "lucide-react";
import { format } from "date-fns";

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please login.</div>;
  }

  // 1. Resolve School
  const { data: school } = await supabase
    .from("schools")
    .select("id, name")
    .eq("code", tenant)
    .single();

  if (!school) {
    notFound();
  }

  // 2. Resolve Student ID via User Attributes (ABAC style)
  const { data: attribute } = await supabase
    .from("user_attributes")
    .select("attribute_value")
    .eq("user_id", user.id)
    .eq("school_id", school.id)
    .eq("attribute_key", "admission_no")
    .single();

  let studentData = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results: any[] = [];

  if (attribute?.attribute_value) {
    // 3. Fetch Student Record
    const { data: student } = await supabase
      .from("students")
      .select("*")
      .eq("school_id", school.id)
      .eq("admission_no", attribute.attribute_value)
      .single();

    studentData = student;

    // 4. Fetch Exam Results
    if (student) {
      const { data: res } = await supabase
        .from("exam_results")
        .select("*, exam:exams(name, exam_date), subject:subjects(name)")
        .eq("student_id", student.id);
      results = res || [];
    }
  }

  // 5. Fetch Upcoming Events (Global for school)
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("school_id", school.id)
    .gte("event_date", new Date().toISOString())
    .limit(5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {studentData?.first_name || "Student"}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* KPI Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exam Results</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">Published results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled this month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Your latest academic performance.</CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((r: any) => (
                  <div key={r.id} className="flex items-center">
                    <BookOpen className="h-9 w-9 text-slate-500 mr-4" />
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {r.subject?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {r.exam?.name}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {r.marks_obtained} / {r.max_marks}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                No results available yet.
              </div>
            )}
            {!attribute && (
              <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 text-sm rounded-md">
                Note: Your account is not linked to a student record. Please ask
                admin to set your &quot;admission_no&quot; attribute.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
            <CardDescription>Upcoming school events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {events?.map((e) => (
                <div key={e.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {e.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {e.event_date
                        ? format(new Date(e.event_date), "PPP")
                        : "TBD"}
                    </p>
                  </div>
                  <div className="ml-auto text-xs bg-slate-100 px-2 py-1 rounded">
                    {e.type}
                  </div>
                </div>
              ))}
              {!events?.length && (
                <div className="text-sm text-muted-foreground">
                  No upcoming events.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
