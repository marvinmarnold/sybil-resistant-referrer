import { Button, Code, ListItem, Text, UnorderedList } from '@chakra-ui/react'
import { Chain, useNetwork, useSwitchNetwork } from 'wagmi'

import { messageAddress, messageConfig, readMessage } from 'abis'
import { ETH_CHAINS } from 'utils/config'
import { LinkComponent } from 'components/layout/LinkComponent'

const ChainSelector = () => {
 const { chain } = useNetwork()
 const { switchNetwork } = useSwitchNetwork()

 async function switchToNetwork(id?: number) {
  if (switchNetwork && !!id) {
   switchNetwork(id)
  }
 }

 return (
  <>
   {Object.keys(messageConfig.address).map((i) => {
    const chain = ETH_CHAINS.find((chain: Chain) => String(chain.id) === i)
    const address = (messageAddress as any)[i]
    const explorerUrl = chain?.blockExplorers?.default.url

    return (
     <Button size="xs" mr={2} onClick={() => switchToNetwork(chain?.id)} key={i} variant="outline">
      {chain?.name ?? i}
     </Button>
    )
   })}
  </>
 )
}

export default ChainSelector
