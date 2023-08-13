import { useState, useEffect } from 'react'
import { Box, Button, Icon, useToast, Text, useBreakpointValue, useColorMode, Heading, useTheme } from '@chakra-ui/react'
import { motion } from 'framer-motion'

import type { NextPage } from 'next'
import { useAccount, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { Hash } from 'viem'
import 'viem/window'
import { useRouter } from 'next/router'

import Container from 'components/layout/Container'
import History from 'components/layout/History'
import SuccessComponent from 'components/layout/SuccessComponent'
import Background from 'components/Background'
import Worldcoin from 'components/Worldcoin'
import referralCampaignContract from '../../contracts/out/ReferralCampaign.sol/ReferralCampaign.json'

const CreateLink: NextPage = () => {
 // TODO: Fetch proof from shared state
 const account = useAccount()
 const { colorMode } = useColorMode()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const toast = useToast()
 const router = useRouter()

 const [campaignId, setCampaignId] = useState<any>(null)
 const [campaignAddy, setCampaignAddy] = useState<any>(null)
 const [ref, setRef] = useState<any>(null)
 const [isLoading, setIsLoading] = useState(false)
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [args, setArgs] = useState<any[]>([])
 const [hash, setHash] = useState<Hash>()

 const [proof, setProof] = useState<BigInt[]>([])
 const [nullifier, setNullifier] = useState<BigInt | undefined>()
 const [root, setRoot] = useState<BigInt | undefined>()

 const { address = '0x...' } = account

 useEffect(() => {
  const { ref: refParam, campaignId: campaignIdParam, campaignAddy: campaignAddyParam } = router.query

  if (refParam && typeof refParam === 'string') {
   setRef(refParam)
  }

  if (campaignIdParam) {
   setCampaignId(campaignIdParam)
  }

  if (campaignAddyParam) {
   setCampaignAddy(campaignAddyParam)
  }
 }, [router.query])

 //  TODO: Add history on Atom
 const history = []
 const {
  config,
  error: prepareError,
  isError: isPrepareError,
 } = usePrepareContractWrite({
    enabled: isSubmitting,
  abi: referralCampaignContract.abi,
  functionName: 'acceptReferral',
  address: campaignAddy,
  args,
 })

 const { data, error, isError, write } = useContractWrite(config)
 const execute = () => {
    setIsSubmitting(true)
    write && write()
 }

 const { isLoading: isContractLoading, isSuccess } = useWaitForTransaction({
  hash: data?.hash,
 })

 useEffect(() => {
  if (isSuccess) {
   console.log('Returned Data', data)

   toast({
    title: 'Success',
    description: 'Transaction submited successfully',
    status: 'success',
    duration: 9000,
    isClosable: true,
   })
  }
 }, [isSuccess, data])

 useEffect(() => {
    if (isSubmitting) {
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

 const claimRewardTxn = async () => {
  try {
   setIsLoading(true)
   if (!campaignId || !account) return
   //   address _referrer, address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof
   // FIXME: the second is the address of the claimer or the campaignId?
   setArgs([ref, address, root, nullifier, proof])
   execute()
   setHash(hash)

   setIsLoading(false)
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
      Claim Referral Rewards
     </h2>

     <Text textAlign="center">
      Campaign: {campaignId}
     </Text>

     <Box display="flex" justifyContent="center" mt={5}>
      {!isSuccess && (
       <Box>
        <Box>{campaignId && <Worldcoin proof={proof} setProof={setProof} setNullifier={setNullifier} setRoot={setRoot} action={campaignId} />}</Box>
        {proof?.length > 0 && (
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
           onClick={claimRewardTxn}>
           Claim
          </Button>
         </motion.div>
        )}
       </Box>
      )}
     </Box>

     {isSuccess && <SuccessComponent link={null} data={data} message="Successful claim!" />}
     {/* DEBUG ONLY */}
     {/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
    </div>
   </Box>

   {history.length > 0 && <History />}
  </Container>
 )
}

export default CreateLink
