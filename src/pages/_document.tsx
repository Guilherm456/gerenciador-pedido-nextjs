import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='pt-br'>
        <Head>
          {/* <link rel='preconnect' href='https://fonts.googleapis.com' />

          <link
            href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:ital,wght@0,700;1,600&display=swap'
            rel='stylesheet'
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
