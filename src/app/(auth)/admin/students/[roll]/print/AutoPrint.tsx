"use client";

import { useEffect } from "react";

export default function AutoPrint() {
  useEffect(() => {
    // Give layout/fonts/images a moment to render
    const t = setTimeout(() => window.print(), 300);
    return () => clearTimeout(t);
  }, []);

  return null;
}
