import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Your Name | Portfolio",
  description: "Frontend Developer & Problem Solver",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <BackgroundGradientAnimation
          containerClassName="fixed inset-0 -z-10"
        />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}