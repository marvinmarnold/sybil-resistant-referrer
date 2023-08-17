import { Layout } from 'components/layout'
import { Seo } from 'components/layout/Seo'
import { useIsMounted } from 'hooks/useIsMounted'
import type { AppProps } from 'next/app'
import { ChakraProvider } from 'providers/Chakra'
import { Web3Provider } from 'providers/Web3'

export default function App({ Component, pageProps }: AppProps) {
 const isMounted = useIsMounted()

 return (
  <ChakraProvider>
   <Seo />
   <Web3Provider>
    {isMounted && (
     <Layout>
      <Component {...pageProps} />
     </Layout>
    )}
   </Web3Provider>
  </ChakraProvider>
 )
}
