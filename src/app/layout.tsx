import type { Metadata } from "next";
import { Poppins, Rubik } from "next/font/google";
import { GeistSans } from "geist/font/sans";

import Header from "@/components/Header";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AuthStateProvider } from "@/providers/authState.provider";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  display: "swap",
  style: "normal",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  style: "normal",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "LinkSlice - The Link Shortener",
  description: "A link shortener using TailwindCSS and NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${rubik.variable} ${GeistSans.variable}`}
    >
      <SessionProvider>
        <AuthStateProvider>
          <body>
            <Header />
            {children}
          </body>
        </AuthStateProvider>
      </SessionProvider>
    </html>
  );
}
