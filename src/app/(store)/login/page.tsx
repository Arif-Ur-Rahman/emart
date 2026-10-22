import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/");
  const { callbackUrl } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
