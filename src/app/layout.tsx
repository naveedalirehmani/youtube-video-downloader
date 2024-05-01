import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/utils/theme-provider";

export const metadata: Metadata = {
  title: "downloader.online",
  description: "youtube video downloader",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
