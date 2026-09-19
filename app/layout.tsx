import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "L’Éternel Jardin — For Sedra Nammora",
  description: "A private garden of Damascus roses, handcrafted with devotion for Sedra Nammora.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en"><body>{children}</body></html>;
}
