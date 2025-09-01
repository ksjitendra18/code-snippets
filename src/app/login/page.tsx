import { LoginForm } from "@/features/auth/components/login-form";
import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const { isAuthenticated } = await checkAuthentication();

  if (isAuthenticated) {
    return redirect("/snippets");
  }
  return (
    <>
      <LoginForm />
    </>
  );
}
