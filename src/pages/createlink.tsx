import { useState, useEffect } from 'react'
import { Box, Button, useToast, useBreakpointValue, useColorMode, Heading, useTheme } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { NextPage } from 'next'
import { useAccount, usePublicClient, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { Hash, TransactionReceipt, stringify } from 'viem'
import 'viem/window'

import Container from 'components/layout/Container'
import CampaignsMenu from 'components/layout/CampaignsMenu'
import History from 'components/layout/History'
import SuccessComponent from 'components/layout/SuccessComponent'
import Background from 'components/Background'
import { CampaignType } from 'types/index'
import Worldcoin from 'components/Worldcoin'
import referralCampaignContract from '../../contracts/out/ReferralCampaign.sol/ReferralCampaign.json'

const CreateLink: NextPage = () => {
 // TODO: Fetch proof from shared state
 const account = useAccount()
 const theme = useTheme()
 const { colorMode } = useColorMode()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const toast = useToast()
 const publicClient = usePublicClient()
 const [hasSubmitted, setHasSubmitted] = useState(false)
 const [selectedCampaign, setSelectedCampaign] = useState<CampaignType>({
  id: '',
  owner: '0x',
  campaign: '0x',
  actionId: '',
 })
 const [link, setLink] = useState('')
 const [args, setArgs] = useState<any[]>(['0xf2761B5e177261fb3Ead3b7B992a11Fce8592898', 0, 0, [0, 0, 0, 0, 0, 0, 0, 0]])
 const [isLoading, setIsLoading] = useState(false)

 const [proof, setProof] = useState<BigInt[]>([])
 const [nullifier, setNullifier] = useState<BigInt>(BigInt(0))
 const [root, setRoot] = useState<BigInt>(BigInt(0))

 const [hash, setHash] = useState<Hash>()
 const [receipt, setReceipt] = useState<TransactionReceipt>()

 const { address = '0x...' } = account

 //  TODO: Add history on Atom
 const history = []

 const {
  config,
  error: prepareError,
  isError: isPrepareError,
 } = usePrepareContractWrite({
  enabled: hasSubmitted,
  abi: referralCampaignContract.abi,
  functionName: 'addReferrer',

  //   address: "0x8fa7b813f246e0dd7cbb04437487fb113912224a", // 1112
  //   address: "0xa364f00198854cd1c0a24e2c502bc39d8aa29a22", // 1113
  // address: "0xd6917c944be9f91fc4c90521c789f7028cbe66ba", // 1332721324098588
  address: selectedCampaign.campaign,
  args,
 })

 const { data, error, isError, write } = useContractWrite(config)
 const execute = () => {
  setHasSubmitted(true)
  !!write && write()
 }
 const { isLoading: isContractLoading, isSuccess } = useWaitForTransaction({
  hash: data?.hash,
 })

 useEffect(() => {
  if (hasSubmitted) {
   setIsLoading(false)
   toast({
    title: 'Error',
    description: 'There was an error',
    status: 'error',
    duration: 9000,
    isClosable: true,
   })
  }
 }, [isError])

 useEffect(() => {
  if (hash) {
   ;(async () => {
    const receipt = await publicClient.waitForTransactionReceipt({ hash })
    setReceipt(receipt)
   })()
  }
 }, [hash, publicClient])

 useEffect(() => {
  if (isSuccess) {
   const url = `${window.location.host}/retrieve?campaignId=${selectedCampaign?.actionId}&campaignAddy=${selectedCampaign?.campaign}&ref=${address}`
   setLink(url)

   toast({
    title: 'Success',
    description: 'Transaction submited successfully',
    status: 'success',
    duration: 9000,
    isClosable: true,
   })
  }
 }, [isSuccess, data])

 const registerOnchain = async () => {
  try {
   setIsLoading(true)
   if (!selectedCampaign || !account) return

   setArgs([address, root, nullifier, proof])
   execute()
   setHash(hash)
   setIsLoading(false)
  } catch (error) {
   console.error(error)
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

 if (!address)
  return (
   <Box>
    <Heading margin={10}>You must log in with an Ethereum Address</Heading>
   </Box>
  )

 return (
  <Container>
   <Background />

   <Box display="flex" justifyContent="center">
    <div
     style={{
      color: 'gray.400',
      fontFamily: 'Montserrat',
      padding: '36px',
      margin: '10px',
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

     <CampaignsMenu selectedCampaign={selectedCampaign} setSelectedCampaign={setSelectedCampaign} isActive={proof?.length === 0} />

     <Box display="flex" justifyContent="center" mt={5}>
      {!link && (
       <Box>
        {proof?.length > 0 ? (
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
           isLoading={isLoading || isContractLoading}
           onClick={registerOnchain}>
           Create
          </Button>
         </motion.div>
        ) : (
         <Box>
          {selectedCampaign?.id.length > 0 && (
           <Worldcoin proof={proof} setProof={setProof} setNullifier={setNullifier} setRoot={setRoot} action={selectedCampaign?.actionId} />
          )}
         </Box>
        )}
       </Box>
      )}
     </Box>

     {isSuccess && <SuccessComponent link={link} data={data} message="Successfully created referral link!" />}
     {/* DEBUG ONLY */}
     {/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
    </div>
   </Box>

   {history.length > 0 && <History />}
  </Container>
 )
}

export default CreateLink
