// components/navbar/navbar-container.tsx
import { checkAuthentication } from "@/features/auth/utils/check-auth";
import { Suspense } from "react";
import { NavbarLoader } from "./navbar-loader";
import Navbar from ".";

async function NavbarData() {
  const auth = await checkAuthentication();

  return <Navbar currentUser={auth.user} />;
}

export default function NavbarContainer() {
  return (
    <Suspense fallback={<NavbarLoader />}>
      <NavbarData />
    </Suspense>
  );
}
