import { useState, useEffect } from 'react'
import { Box, Button, Icon, useToast, Text, useBreakpointValue, useColorMode, Heading, useTheme, Link } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { NextPage } from 'next'
import { useAccount, usePublicClient, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { useRecoilValue } from 'recoil'
import { proofAtom } from 'recoil/worldcoin'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FiCopy, FiExternalLink } from 'react-icons/fi'
import { Hash, TransactionReceipt, stringify } from 'viem'
import 'viem/window'

import Container from 'components/layout/Container'
import CampaignsMenu from 'components/layout/CampaignsMenu'
import Background from 'components/Background'
import { CampaignType } from 'types/index'

import referralCampaignContract from '../../contracts/out/ReferralCampaign.sol/ReferralCampaign.json'

const CreateLink: NextPage = () => {
 // TODO: Fetch proof from shared state
 const account = useAccount()
 const stringProof = useRecoilValue(proofAtom)
 const theme = useTheme()
 const { colorMode } = useColorMode()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const toast = useToast()
 const publicClient = usePublicClient()

 const [selectedCampaign, setSelectedCampaign] = useState<null | CampaignType>(null)
 const [link, setLink] = useState('')
 const [isLoading, setIsLoading] = useState(false)
 const [hash, setHash] = useState<Hash>()
 const [receipt, setReceipt] = useState<TransactionReceipt>()

 const { address = '0x...' } = account

 const proof = stringProof.map((value: string) => BigInt(value))

 const {
  config,
  error: prepareError,
  isError: isPrepareError,
 } = usePrepareContractWrite({
  ...referralCampaignContract,
  functionName: 'addReferrer',
  address: selectedCampaign?.param0,
 })

 const { data, error, isError, write } = useContractWrite(config)

 const { isLoading: isContractLoading, isSuccess } = useWaitForTransaction({
  hash: data?.hash,
 })

 useEffect(() => {
  if (isSuccess) {
   if (selectedCampaign?.id && address) {
    const url = `${window.location.host}/retrieve?campaignId=${selectedCampaign?.id}&ref=${address}`
    setLink(url)
   }
   setIsLoading(false)

   toast({
    title: 'Success',
    description: 'Transaccion submited successfully',
    status: 'success',
    duration: 9000,
    isClosable: true,
   })
  }
 }, [isSuccess])

 useEffect(() => {
  setIsLoading(false)
  toast({
   title: 'Error',
   description: 'There was an error',
   status: 'error',
   duration: 9000,
   isClosable: true,
  })
 }, [isError])

 useEffect(() => {
  ;(async () => {
   if (hash) {
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    setReceipt(receipt)
   }
  })()
 }, [hash, publicClient])

 const createLink = async () => {
  try {
   setIsLoading(true)
   if (!selectedCampaign || !account) return

   write?.()
   setHash(hash)
  } catch (error) {
   toast({
    title: 'Error',
    description: 'There was an error',
    status: 'error',
    duration: 9000,
    isClosable: true,
   })
   setIsLoading(false)
  }
 }

 if (proof.length === 0 || !address)
  return (
   <Box>
    <Heading margin={10}>You must log in with Eth Address and Worldcoin</Heading>

    {/* // Don't show page if there's no WorldId connected  */}
    {proof.length === 0 && (
     <Box margin={20}>
      <Link href="https://worldcoin.org/download-app" isExternal>
       <Button variant="outline">
        Download Worldcoin App
        <Icon as={FiExternalLink} mx="2px" />
       </Button>
      </Link>
     </Box>
    )}
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
          isLoading={isLoading}
          onClick={createLink}>
          Create
         </Button>
        </motion.div>
       </Box>
      )}
     </Box>

     <Box margin={10}>
      {/* TODO: isContractLoading */}
      {receipt && (
       <>
        <div>
         Receipt:{' '}
         <pre>
          <code>{stringify(receipt, null, 2)}</code>
         </pre>
        </div>
       </>
      )}
      {isSuccess && (
       <div>
        Successfully claimed your reward!
        <div>
         <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
        </div>
       </div>
      )}
      {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>}
     </Box>
    </div>
   </Box>
  </Container>
 )
}

export default CreateLink
