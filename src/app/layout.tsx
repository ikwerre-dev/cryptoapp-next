import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";
import { LenisProvider } from "@/context/LenisProvider";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Crypto App",
  description: "Your crypto dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <AuthProvider>
          <LenisProvider>{children}</LenisProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
