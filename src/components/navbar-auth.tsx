// components/navbar/navbar-auth.tsx
import { checkAuthentication } from "@/features/auth/utils/check-auth";
import Link from "next/link";
import LogoutButton from "./logout-button";

type Props = {
  mobile?: boolean;
};

export default async function NavbarAuth({ mobile }: Props) {
  const auth = await checkAuthentication();
  const user = auth.user;

  if (!user) {
    return (
      <Link href="/login" className="px-4 py-2 border rounded">
        Log in
      </Link>
    );
  }

  return <LogoutButton />;
}
