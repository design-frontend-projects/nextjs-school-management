import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Clock } from "lucide-react";

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Student</h1>
        <p className="text-muted-foreground">
          Here is your academic overview for {tenant}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs font-bold text-green-500">Top 10% of class</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Exams
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground pt-1">
              Next: Math 101 (Tomorrow)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { subject: "Mathematics", grade: 92, date: "Oct 12" },
              { subject: "Science", grade: 78, date: "Oct 10" },
              { subject: "History", grade: 88, date: "Oct 05" },
            ].map((item) => (
              <div
                key={item.subject}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="text-lg font-bold">{item.grade}%</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex bg-muted/50 p-3 rounded-md items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Math Exam</p>
                    <p className="text-xs text-muted-foreground">
                      10:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>
                <div className="text-sm font-bold">Tomorrow</div>
              </div>
              <div className="flex bg-muted/50 p-3 rounded-md items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Physics Lab</p>
                    <p className="text-xs text-muted-foreground">
                      02:00 PM - 04:00 PM
                    </p>
                  </div>
                </div>
                <div className="text-sm font-bold">Wed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
