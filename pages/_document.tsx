import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Work+Sans|Roboto|PT+Serif&display=swap"
          rel="stylesheet"
        />
        <title>Max Hernandez</title>
      </Head>
      <body>
        <Main />
        <NextScript />
        <canvas 
          width="720px"
          height="720px"
          id="canvas-background" 
        />
      </body>
    </Html>
  )
}