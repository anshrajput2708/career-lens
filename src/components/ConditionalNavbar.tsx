"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

// Pages that embed their own custom navigation — do not render global Navbar
const HIDE_GLOBAL_NAV: string[] = [];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  if (HIDE_GLOBAL_NAV.includes(pathname)) return null;
  return <Navbar />;
}

