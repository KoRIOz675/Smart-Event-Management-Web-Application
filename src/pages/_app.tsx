import "@/styles/globals.css"; // Ligne vitale
import { ThemeProvider } from '@/components/theme-provider';
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}