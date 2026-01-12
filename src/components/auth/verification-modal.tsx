"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  verifyUserAccount,
  resendVerificationOtp,
} from "./verification-actions";
import { useRouter } from "next/navigation";

interface VerificationModalProps {
  isVerified: boolean | undefined | null;
}

export function VerificationModal({ isVerified }: VerificationModalProps) {
  // If isVerified is true (or null/undefined initially?), don't show.
  // We assume specific false means unverified.
  const [open, setOpen] = useState(isVerified === false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (isVerified !== false) return null;

  async function handleVerify() {
    setLoading(true);
    const res = await verifyUserAccount(otp);
    setLoading(false);

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Account verified!");
      setOpen(false);
      router.refresh();
    }
  }

  async function handleResend() {
    const res = await resendVerificationOtp();
    if (res?.error) toast.error(res.error);
    else toast.success("OTP Sent");
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[425px]"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Verify Your Account</DialogTitle>
          <DialogDescription>
            Your account requires verification. Please enter the OTP sent to
            your email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="otp" className="text-right">
              OTP
            </Label>
            <Input
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="col-span-3"
              placeholder="123456"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleResend} disabled={loading}>
            Resend OTP
          </Button>
          <Button onClick={handleVerify} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
