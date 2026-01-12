import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 flex items-center justify-between border-b">
        <h1 className="text-2xl font-bold">School SaaS</h1>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/login?register=true">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-5xl font-extrabold mb-6">
          Manage Your School with Ease
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          A powerful, secure, and multi-tenant platform for schools, teachers,
          and students.
        </p>
        <Link href="/login">
          <Button size="lg" className="text-lg px-8">
            Access Dashboard
          </Button>
        </Link>
      </main>
    </div>
  );
}
