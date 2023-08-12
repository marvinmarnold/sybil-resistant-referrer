import { ColorModeScript } from '@chakra-ui/react'
import { Html, Head, Main, NextScript } from 'next/document'
import { THEME_INITIAL_COLOR } from 'utils/config'

export default function Document() {
 return (
  <Html lang="en">
   <Head>
    <meta charSet="utf-8" />
    <link rel="icon" href="/favicon.ico" />
    <link
     href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900;0,9..40,1000;1,9..40,100;1,9..40,200;1,9..40,300;1,9..40,400;1,9..40,500;1,9..40,600;1,9..40,700;1,9..40,800;1,9..40,900;1,9..40,1000&display=swap"
     rel="stylesheet"></link>
   </Head>
   <body style={{ overflowX: 'hidden' }}>
    <ColorModeScript initialColorMode={THEME_INITIAL_COLOR} />
    <Main />
    <NextScript />
   </body>
  </Html>
 )
}
