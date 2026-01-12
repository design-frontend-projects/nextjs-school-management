import { redirect } from "next/navigation";

export default function ClientRoot({ params }: { params: { tenant: string } }) {
  redirect(`/${params.tenant}/client/dashboard`);
}
