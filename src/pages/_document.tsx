import { Html, Head, Main, NextScript } from 'next/document'

const themeInitScript = `
  (() => {
    try {
      const storageKey = 'smart-event-theme';
      const storedTheme = window.localStorage.getItem(storageKey);
      const theme = storedTheme === 'dark' || storedTheme === 'light'
        ? storedTheme
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.style.colorScheme = theme;
    } catch (error) {
      console.error('Theme initialization failed', error);
    }
  })();
`;

export default function Document() {
  return (
    <Html lang="fr" suppressHydrationWarning>
      <Head>
        <meta charSet="utf-8" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}