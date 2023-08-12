import { Badge, Code, ListItem, Text, UnorderedList, useColorModeValue, Button, Icon, forwardRef } from '@chakra-ui/react'
import { Chain, useNetwork, useSwitchNetwork, useBlockNumber } from 'wagmi'
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from '@chakra-ui/react'

import { messageAddress, messageConfig, readMessage } from 'abis'
import { ETH_CHAINS } from 'utils/config'
import { LinkComponent } from 'components/layout/LinkComponent'
import { FiChevronDown } from 'react-icons/fi'
import { BsFillCircleFill } from 'react-icons/bs'
BsFillCircleFill
import React from 'react'
import { GetNetworkColor } from 'utils/network'
import { THEME_COLOR_SCHEME } from 'utils/config'

const ChainSelector = () => {
 const network = useNetwork()
 console.log('🚀 ~ file: ChainSelector.tsx:17 ~ network:', network)
 const explorerUrl = network.chain?.blockExplorers?.default.url
 const bgColor = useColorModeValue(`${THEME_COLOR_SCHEME}.50`, `${THEME_COLOR_SCHEME}.800`)
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

    console.log('🚀 ~ file: ChainSelector.tsx:50 ~ {ETH_CHAINS.map ~ chain:', chain)
    return (
     <Menu key={i}>
      {({ isOpen }) => (
       <>
        <MenuButton
         isActive={isOpen}
         background="transparent"
         textColor="#805AD5"
         border="2px solid #805AD5"
         as={Button}
         rightIcon={<Icon as={FiChevronDown} margin="0 5px" />}>
         <Icon as={BsFillCircleFill} margin="0 5px" color={GetNetworkColor(network.chain?.id)} opacity={0.7} />
         {network.chain?.name ?? 'Ethereum'}
        </MenuButton>
        <MenuList>
         {ETH_CHAINS.map((ch) => {
          return (
           <MenuItem key={ch.id} onClick={() => switchToNetwork(ch?.id)}>
            <Icon as={BsFillCircleFill} margin="0 5px" color={GetNetworkColor(ch?.id)} opacity={0.7} />
            {ch.name}
           </MenuItem>
          )
         })}
        </MenuList>
       </>
      )}
     </Menu>
    )
   })}
  </>
 )
}

export default ChainSelector
