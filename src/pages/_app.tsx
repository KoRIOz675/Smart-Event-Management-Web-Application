import "@/styles/globals.css"; // Ligne vitale
import { ThemeProvider } from '@/components/theme-provider';
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}