import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, Text } from '@chakra-ui/react'
import { SITE_NAME } from 'utils/config'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { PassportScore } from './PassportScore'
import { Web3Button } from '@web3modal/react'
import { useAccount } from 'wagmi'

import Worldcoin from 'components/Worldcoin'

interface Props {
 className?: string
}

export function Header(props: Props) {
 const { address } = useAccount()

 const className = props.className ?? ''

 const ConnectionButtons = () => {
  return (
   <div>
    <Web3Button icon="hide" label="Connect Wallet" />
    <Worldcoin />
   </div>
  )
 }

 return (
  <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={2} mb={8} alignItems="center">
   <LinkComponent href="/">
    <Heading as="h1" size="md">
     {SITE_NAME}
    </Heading>
   </LinkComponent>

   <Spacer />
   <Flex>
    <LinkComponent href="/createCampaign">
     <Text>Create Campaign</Text>
    </LinkComponent>

    <LinkComponent href="/generateReferrals">
     <Text>Generate Referrals</Text>
    </LinkComponent>
   </Flex>
   <Spacer />
   <Flex alignItems="center" gap={4}>
    <PassportScore />
    <ConnectionButtons />
    <ThemeSwitcher />
   </Flex>
  </Flex>
 )
}
