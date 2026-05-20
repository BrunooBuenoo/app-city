import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sac do Marilia ao Contrário",
  description: "Gestão Urbana",
};

import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { ToastProvider } from "@/components/ui/Toast";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakarta.className} selection:bg-primary/10`} suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

