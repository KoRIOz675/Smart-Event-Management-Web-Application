import "@/styles/globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { LangProvider } from "@/context/LangContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LangProvider>
          <Component {...pageProps} />
        </LangProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}