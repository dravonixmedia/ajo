"use client";

import dynamic from "next/dynamic";
import SmoothScrollProvider from "./providers/SmoothScrollProvider";
import CustomCursor from "./ui/CustomCursor";
import WhatsAppButton from "./ui/WhatsAppButton";
import { useAppStore } from "@/store/useAppStore";

const Loader = dynamic(() => import("./loader/Loader"), { ssr: false });

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const hasEntered = useAppStore((s) => s.hasEnteredHero);

  return (
    <SmoothScrollProvider>
      <Loader />
      <CustomCursor />
      <div className="film-grain" />
      {children}
      {hasEntered && <WhatsAppButton />}
    </SmoothScrollProvider>
  );
}
