"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true); // Ensures this only runs on the client
  }, []);

  if (!mounted) {
    return <>{children}</>; // Avoid rendering the ThemeProvider until it's mounted
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
