import { Html, Head, Main, NextScript } from 'next/document'
import { useEffect } from 'react'

export default function Document() {

  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css?family=Work+Sans|Roboto|PT|Bad+Script&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="canvas-container">
          <canvas id="canvas-background" />
        </div>
      </body>
    </Html>
  )
}