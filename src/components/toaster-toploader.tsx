"use client";

import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";

export const ToasterTopLoader = () => {
  return (
    <div>
      <NextTopLoader color="#000" />
      <Toaster />
    </div>
  );
};
