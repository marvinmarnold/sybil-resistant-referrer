import { Flex, Heading, Spacer, useColorModeValue } from '@chakra-ui/react'
import { Web3Button } from '@web3modal/react'
import { SITE_NAME } from 'utils/config'
import { LinkComponent } from './LinkComponent'
import { PassportScore } from './PassportScore'
import { ConnectMiniPay } from '../../providers/Web3'

import ChainSelector from 'components/ChainSelector'

interface Props {
 className?: string
}

export function Header(props: Props) {
 const className = props.className ?? ''

 return (
  <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={2} mb={8} alignItems="center">
   <LinkComponent href="/">
    <Heading as="h1" size="md">
     {SITE_NAME}
    </Heading>
   </LinkComponent>

   <Spacer />
   <Flex alignItems="center" gap={4}>
    <PassportScore />
    <ChainSelector />
    <Web3Button icon="hide" label="Connect Wallet" />
    <ConnectMiniPay />
    {/* <ThemeSwitcher /> */}
   </Flex>
  </Flex>
 )
}
