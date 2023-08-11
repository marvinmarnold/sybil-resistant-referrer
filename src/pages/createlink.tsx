import { useState } from 'react'
import { Box, Button, Icon, useToast, Text, useBreakpointValue, useColorMode, Heading, useTheme } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { NextPage } from 'next'
import { useAccount, useNetwork, useSignMessage } from 'wagmi'
import { useRecoilValue } from 'recoil'
import { proofAtom } from 'recoil/worldcoin'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FiCopy } from 'react-icons/fi'

import Container from 'components/layout/Container'
import CampaignsMenu from 'components/layout/CampaignsMenu'
import Background from 'components/Background'

type Campaign = {
 id: string
 param0: string
 name: string
}

const CreateLink: NextPage = () => {
 // TODO: Fetch proof from shared state
 const { address = '' } = useAccount()
 const theme = useTheme()
 const proof = useRecoilValue(proofAtom)
 const [selectedCampaign, setSelectedCampaign] = useState<null | Campaign>(null)
 const [link, setLink] = useState('')
 const toast = useToast()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const { colorMode } = useColorMode()

 const createLink = () => {
  if (!selectedCampaign) return

  if (selectedCampaign?.id && address) {
   const url = `${window.location.host}/retrieve?campaignId=${selectedCampaign?.id}&ref=${address}`
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
 //   if (!proof || !address)
 if (!address)
  return (
   <Box>
    <Heading>You must log in with Eth Address and Worldcoin</Heading>
    <Text>Connect here!</Text>
   </Box>
  )

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

     <Box display="flex" justifyContent="center" mt={5}>
      {link ? (
       <Box>
        <Box margin={5}>
         <a href={link}>
          <Heading as="h4" size="md">
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
       <Box>
        <CampaignsMenu selectedCampaign={selectedCampaign} setSelectedCampaign={setSelectedCampaign} />

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
       </Box>
      )}
     </Box>
    </div>
   </Box>
  </Container>
 )
}

export default CreateLink
