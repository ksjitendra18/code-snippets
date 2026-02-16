import { ToasterTopLoader } from "@/components/toaster-toploader";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import NavbarContainer from "@/components/navbar/container";

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
  // const authenticationData = await checkAuthentication();

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ToasterTopLoader />

        {/* <Navbar currentUser={authenticationData.user} /> */}
        {/* <Suspense fallback={<NavbarLoader />}>
          <Navbar currentUser={authenticationData.user} />
        </Suspense> */}

        <NavbarContainer />

        <main className="max-w-7xl mx-auto px-4">{children}</main>
      </body>
    </html>
  );
}
