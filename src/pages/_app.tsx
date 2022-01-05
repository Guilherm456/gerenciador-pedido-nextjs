import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { Theme } from '../utils/Theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <ThemeProvider theme={Theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </div>
  );
}

export default MyApp;
