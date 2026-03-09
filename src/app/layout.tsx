import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Smart Event Management",
  description: "Plateforme intelligente de gestion d'évènements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased bg-gray-50 min-h-screen">
        <Navbar /> 
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
          © 2026 SmartEvent - Projet ISEP
        </footer>
      </body>
    </html>
  );
}