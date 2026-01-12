import { redirect } from "next/navigation";

export default function AdminRoot({ params }: { params: { tenant: string } }) {
  redirect(`/${params.tenant}/admin/dashboard`);
}
