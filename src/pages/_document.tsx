import { Html, Head, Main, NextScript } from 'next/document'

const themeInitScript = `
  (() => {
    try {
      const storageKey = 'smart-event-theme';
      const storedTheme = window.localStorage.getItem(storageKey);
      const theme = storedTheme === 'dark' || storedTheme === 'light' || storedTheme === 'cyber' || storedTheme === 'league' || storedTheme === 'pinklight' || storedTheme === 'pinkdark' || storedTheme === 'green' || storedTheme === 'cookiesclick' || storedTheme === 'school';
        ? storedTheme
        : storedTheme === 'pink'
          ? 'pinklight'
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

      document.documentElement.classList.remove('dark', 'pink-light', 'pink-dark');
      const classNameByTheme = {
        light: null,
        dark: 'dark',
        pinklight: 'pink-light',
        pinkdark: 'pink-dark',
        green: 'green',
        cookiesclick: 'cookiesclick',
        school: 'school',
        league: 'league',
        cyber: 'cyber',
      };
      const colorSchemeByTheme = {
        light: 'light',
        dark: 'dark',
        pinklight: 'light',
        pinkdark: 'dark',
        green: 'dark',
        cookiesclick: 'dark',
        school: 'light',
        league: 'dark',
        cyber: 'dark',
      };

      const rootClass = classNameByTheme[theme];
      if (rootClass) {
        document.documentElement.classList.add(rootClass);
      }
      document.documentElement.style.colorScheme = colorSchemeByTheme[theme];
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