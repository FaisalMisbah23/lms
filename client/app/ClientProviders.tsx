// app/ClientProviders.tsx
"use client";
import { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Providers } from "./Provider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Providers>
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </Providers>
    );
  }

  return (
    // <Providers>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    // {/* </Providers> */}
  );
}