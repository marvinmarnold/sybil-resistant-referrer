import { useState } from 'react'
import { Box, Button, Icon, useToast, Select, useBreakpointValue, useColorMode, Heading } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useRecoilValue } from 'recoil'
import { proofAtom } from 'recoil/worldcoin'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FiCopy } from 'react-icons/fi'
import { request, gql } from 'graphql-request'

import campaigns from 'utils/campaigns'
import Container from 'components/layout/Container'
import Background from 'components/Background'

const query = gql`
 {
  campaignCreateds {
   id
   manager
   campaignAddress
  }
 }
`

const CreateLink: NextPage = () => {
 // TODO: Fetch proof from shared state
 const { address = '' } = useAccount()
 const proof = useRecoilValue(proofAtom)
 const [selectedCampaign, setSelectedCampaign] = useState<null | string>(null)
 const [link, setLink] = useState('')
 const toast = useToast()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const { colorMode } = useColorMode()
 const { chain } = useNetwork()

 //  useEffect(() => {
 //   // TODO: Change depending on the chain
 //   const endpoint = 'https://api.studio.thegraph.com/query/18941/refer-optimism-goerli/version/latest'
 //   setCurrentEndpoint(endpoint)
 //  }, [chain])

 //  request(currentEndpoint, query).then((data) => console.log(data))

 const createLink = () => {
  if (!selectedCampaign) return

  const campaign = campaigns.find((c) => c.campaignName === selectedCampaign)
  if (campaign?.campaignId && address) {
   const url = `${window.location.host}/retrieve?campaignId=${campaign?.campaignId}&ref=${address}`
   setLink(url)
  }

  toast({
   title: 'Success',
   description: 'Link has been created successfully',
   status: 'success',
   duration: 9000,
   isClosable: true,
  })
 }

 // Don't show page if there's no WorldId
 // TODO: Link to download Worldcoin App
 // TODO: QR Code for worldcoin app

 // FIXME: Disabled until worldcoin works
 //  if (!proof || !address)
 //   return (
 //    <Box>
 //     <Heading>You must log in with Eth Address and Worldcoin</Heading>
 //     <Text>Connect here!</Text>
 //    </Box>
 //   )

 return (
  <Container>
   <Background />

   <Box position="absolute" top={24} display="flex" justifyContent="center">
    <div
     style={{
      color: 'gray.400',
      fontFamily: 'Montserrat',
      padding: '36px',
      height: 'fit',
      width: formWidth,
      backgroundColor: colorMode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(70px)',
      borderRadius: '40px',
      border: '1px solid rgba(179, 186, 209, 0.5)',
     }}>
     <h2
      style={{
       textAlign: 'center',
       fontWeight: 'bold',
       fontSize: '1.5rem',
       fontFamily: 'sans-serif',
      }}>
      Create Referral Link
     </h2>

     <Select placeholder="Select campaign" onChange={(e) => setSelectedCampaign(e.target.value)}>
      {campaigns.map((campaign) => (
       <option key={campaign.campaignId} value={campaign.campaignName}>
        {campaign.campaignName}
       </option>
      ))}
     </Select>

     <Box display="flex" justifyContent="center" mt={5}>
      {link ? (
       <Box>
        <Box>
         <a href={link}>
          <Heading>
           {link.slice(0, 15)}...{link.slice(-10)}
          </Heading>
         </a>
        </Box>
        <Box>
         <CopyToClipboard text={link}>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
           <Button
            backgroundColor="purple.300"
            variant="gradient"
            borderRadius="10px"
            border={'0.5px solid #312E2A'}
            boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
            py={2}
            px={12}
            fontFamily="sans-serif"
            color="white"
            type="submit"
            onClick={createLink}>
            <Icon as={FiCopy} margin="0 5px" /> Copy to clipboard
           </Button>
          </motion.div>
         </CopyToClipboard>
        </Box>
       </Box>
      ) : (
       <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
        <Button
         backgroundColor="purple.300"
         variant="gradient"
         borderRadius="10px"
         border={'0.5px solid #312E2A'}
         boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
         py={2}
         px={12}
         fontFamily="sans-serif"
         color="white"
         type="submit"
         onClick={createLink}>
         Create
        </Button>
       </motion.div>
      )}
     </Box>
    </div>
   </Box>
  </Container>
 )
}

export default CreateLink
