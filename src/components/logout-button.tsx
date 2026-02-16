"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    router.refresh();
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 border rounded">
      Logout
    </button>
  );
}
