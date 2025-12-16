import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ToasterTopLoader } from "@/components/toaster-toploader";

import { checkAuthentication } from "@/features/auth/utils/check-auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snippets",
  description: "Snippets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authenticationData = await checkAuthentication();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToasterTopLoader />

        <Navbar currentUser={authenticationData.user} />
        <main className="max-w-7xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
