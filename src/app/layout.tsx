import type { Metadata } from "next";
import { Poppins, Rubik } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/providers/auth.provider";
import { Toaster } from "sonner";
import {
  CircleCheckBigIcon,
  CircleXIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import "@/styles/globals.css";

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
  title: "LinkSlice - Link Shortener",
  description: "A simple tool for shortening links and sharing them easily.",
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
        <AuthProvider>
          <body>
            <Header />
            {children}
            <Toaster
              richColors={false}
              position="top-center"
              visibleToasts={3}
              duration={3000}
              icons={{
                error: <CircleXIcon absoluteStrokeWidth />,
                warning: <TriangleAlertIcon absoluteStrokeWidth />,
                success: <CircleCheckBigIcon absoluteStrokeWidth />,
                info: <InfoIcon absoluteStrokeWidth />,
                loading: <Loader />,
              }}
              offset={15}
              gap={6}
              toastOptions={{
                className:
                  "!bg-neutral-900 !border-rose-300 rounded-lg py-[.85rem] px-[.8rem]",
                classNames: {
                  content: "gap-none",
                  warning: "!text-orange-300",
                  info: "!text-blue-300",
                  success: "!text-green-300",
                  error: "!text-red-300",
                  icon: "size-[1.65rem] flex flex-col items-center justify-center",
                  description:
                    "!text-neutral-200 text-[0.825rem] leading-[1] font-normal",
                  title:
                    "!text-rose-50 text-[0.925rem] font-medium gap-none leading-[1]",
                },
              }}
            />
          </body>
        </AuthProvider>
      </SessionProvider>
    </html>
  );
}
