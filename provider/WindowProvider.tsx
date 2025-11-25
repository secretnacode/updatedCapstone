"use client";

import { useEffect } from "react";
import { useWindowStore } from "@/store/useWindowStore";

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const setWidth = useWindowStore((state) => state.setWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    handleResize(); // initialize

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setWidth]);

  return <>{children}</>;
}
