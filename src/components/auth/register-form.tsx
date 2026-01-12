"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signup } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    const password = formData.get("password") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const res = await signup(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="John Doe"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="remail">Email</Label>
        <Input
          id="remail"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rpassword">Password</Label>
        <Input
          id="rpassword"
          name="password"
          type="password"
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          disabled={loading}
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign Up
      </Button>
    </form>
  );
}
