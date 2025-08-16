"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Code2, Home, LogIn, Menu, Search, Users2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthenticationData } from "@/features/auth/utils/check-auth";

type NavbarProps = {
  currentUser: CurrentUser;
};

type CurrentUser = AuthenticationData["user"];

export default function Navbar({ currentUser }: NavbarProps) {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathName]);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    ...(currentUser
      ? [
          { label: "Snippets", href: "/snippets", icon: Code2 },
          { label: "Search", href: "/snippets/search", icon: Search },
          ...(currentUser?.role === "SUPER_ADMIN"
            ? [
                {
                  label: "User Management",
                  href: "/user-management",
                  icon: Users2,
                },
              ]
            : []),
        ]
      : []),
    // { label: "Snippets", href: "/snippets", icon: Code2 },

    // ...(currentUser?.staff
    //   ? [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }]
    //   : []),
    // ...(currentUser && !currentUser.staff
    //   ? [{ label: "My Courses", href: "/my-courses", icon: GraduationCap }]
    //   : []),
  ];

  const renderNavItems = (isMobile: boolean = false) => (
    <>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          asChild
          className={isMobile ? "w-full justify-start" : ""}
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </>
  );

  const handleLogout = async () => {
    await fetch("/api/auth/logout");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b px-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <span className=" text-xl font-bold">Code Snippets</span>
            </Link>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
            {renderNavItems()}
            {currentUser ? (
              <>
                <Button>Logout</Button>
              </>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Link>
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="mt-4 flex flex-col space-y-4">
                  {renderNavItems(true)}
                  {currentUser ? (
                    <>
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Log in
                      </Link>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
