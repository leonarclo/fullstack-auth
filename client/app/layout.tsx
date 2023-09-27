"use client";
import store from "@/redux/store";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
