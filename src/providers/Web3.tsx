import { useColorMode, useTheme } from '@chakra-ui/react'
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { ReactNode, useEffect, useState } from 'react'
import { ETH_CHAINS, THEME_COLOR_SCHEME } from 'utils/config'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

interface Props {
 children: ReactNode
}

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ''
if (!projectId) {
 console.warn('You need to provide a NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable')
}
const { chains, publicClient, webSocketPublicClient } = configureChains(ETH_CHAINS, [publicProvider(), w3mProvider({ projectId: projectId })])

const wagmiConfig = createConfig({
 autoConnect: true,
 connectors: w3mConnectors({ chains, projectId: projectId }),
 publicClient,
 webSocketPublicClient,
})

const ethereumClient = new EthereumClient(wagmiConfig, chains)

export function Web3Provider(props: Props) {
 const { colorMode } = useColorMode()
 const theme = useTheme()
 const [ready, setReady] = useState(false)

 useEffect(() => {
  setReady(true)
 }, [])

 return (
  <>
   {ready && <WagmiConfig config={wagmiConfig}>{props.children}</WagmiConfig>}

   <Web3Modal
    projectId={projectId}
    ethereumClient={ethereumClient}
    themeMode={colorMode}
    themeVariables={{
     '--w3m-accent-color': theme.colors[THEME_COLOR_SCHEME ?? 'black'][500],
    }}
   />
  </>
 )
}

export function ConnectMiniPay() {
    const { address, isConnected } = useAccount()
    const { data: ensName } = useEnsName({ address })
  
    const { connect } = useConnect({
      connector: new InjectedConnector(),
    });
   
    if (isConnected) return <div>Connected to {ensName ?? address}</div>
    return <button onClick={() => connect()}>Connect to Injected Wallet</button>
  }