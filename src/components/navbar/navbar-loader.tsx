import Link from "next/link";
import {
  Code2,
  Home,
  Loader2,
  LogIn,
  Menu,
  Search,
  Users2,
} from "lucide-react";

import { Button } from "../ui/button";

// components/navbar/navbar-loader.tsx

const navItems = [{ label: "Home", href: "/", icon: Home }];

export function NavbarLoader() {
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

            <div className="bg-black/60 text-white  px-9 rounded-md py-2">
              <Loader2 className="animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
