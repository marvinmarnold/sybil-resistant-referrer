import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { useEffect, useState } from 'react';
import {
  optimismGoerli,
  polygonMumbai
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '@/components/Navbar';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    // optimismGoerli,
    polygonMumbai
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECTID!,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
  }, [])

  return (<>
    {ready ? (<WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Navbar/>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>) : null }</>
  );
}

export default MyApp;
