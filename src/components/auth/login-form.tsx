"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { loginWithOtp, verifyOtp } from "@/app/auth/actions";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  const urlMessage = searchParams.get("message");

  async function handleEmailSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    setMessage("");

    const res = await loginWithOtp(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setEmail(formData.get("email") as string);
      setStep("otp");
      setMessage(res.message);
    }
  }

  async function handleOtpSubmit(formData: FormData) {
    setLoading(true);
    setError("");

    // Server action will redirect on success
    const res = await verifyOtp(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="space-y-4">
      {(error || urlError) && (
        <Alert variant="destructive">
          <AlertDescription>{error || urlError}</AlertDescription>
        </Alert>
      )}
      {(message || urlMessage) && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{message || urlMessage}</AlertDescription>
        </Alert>
      )}

      {step === "email" ? (
        <form action={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </form>
      ) : (
        <form action={handleOtpSubmit} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="123456"
              required
              disabled={loading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setStep("email")}
            disabled={loading}
          >
            Back to Email
          </Button>
        </form>
      )}
    </div>
  );
}
