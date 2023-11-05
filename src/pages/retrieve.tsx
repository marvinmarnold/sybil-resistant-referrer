import { Box, Button, Heading, Text, useBreakpointValue, useColorMode, useToast } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import 'viem/window'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import Background from 'components/Background'
import Worldcoin from 'components/Worldcoin'
import Container from 'components/layout/Container'
import History from 'components/layout/History'
import SuccessComponent from 'components/layout/SuccessComponent'
import referralCampaignContract from '../../contracts/out/ReferralCampaign.sol/ReferralCampaign.json'

const CreateLink: NextPage = () => {
 // TODO: Fetch proof from shared state
 const account = useAccount()
 const { colorMode } = useColorMode()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const toast = useToast()
 const router = useRouter()

 const [campaignId, setCampaignId] = useState<any>('')
 const [campaignAddy, setCampaignAddy] = useState<any>('')
 const [ref, setRef] = useState<any>('a')
 const [isSubmitting, setIsSubmitting] = useState(false)
 const [args, setArgs] = useState<any[]>([])
 const [proof, setProof] = useState<BigInt[]>([BigInt(1), BigInt(1), BigInt(1), BigInt(1), BigInt(1), BigInt(1), BigInt(1), BigInt(1)])
 const [nullifier, setNullifier] = useState<BigInt>(BigInt(1))
 const [root, setRoot] = useState<BigInt>(BigInt(1))

 const [isReadyToSubmit, setIsReadyToSubmit] = useState(false)

 const { address } = account

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

 useEffect(() => {
  console.log('Checking if ready to submit')
  console.log(address)
  console.log(root)
  console.log(nullifier)
  console.log(proof)
  //   address _referrer, address signal, uint256 root, uint256 nullifierHash, uint256[8] calldata proof
  // FIXME: the second is the address of the claimer or the campaignId?
  setArgs([address, address, root, nullifier, proof])

  if (!address) return
  console.log('address passed')
  if (root.valueOf() === BigInt(0).valueOf()) return
  console.log('root passed')
  if (nullifier.valueOf() === BigInt(0).valueOf()) return
  console.log('nullifier passed')
  if (proof.length === 0) return
  console.log('proof passed')
  if (!ref) return

  console.log('Now ready to submit')
  setIsReadyToSubmit(true)
 }, [address, root, nullifier, proof])

 //  TODO: Add history on Atom
 console.log('isReadyToSubmit')
 console.log(isReadyToSubmit)
 const history = []
 const {
  config,
  error: prepareError,
  isError: isPrepareError,
 } = usePrepareContractWrite({
  enabled: isReadyToSubmit,
  abi: referralCampaignContract.abi,
  functionName: 'acceptReferral',
  address: campaignAddy,
  args,
  onSettled(data, error) {
   console.warn('Settled', { data, error })
  },
 })

 console.log("config");
 console.log(config);
 
 const { data, error, isError, write } = useContractWrite(config)

 const execute = () => {
  if (!!write) {
   write()
   setIsSubmitting(true)
   console.log('executed')
  } else {
   console.warn("Can't execute because useContractWrite is not yet ready")
   console.log(args)
   console.log('sendTx')
   console.log(write)
   setIsSubmitting(false)
  }
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
   setIsSubmitting(false)
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
   if (!campaignId || !account) return

   execute()
  } catch (error) {
   toast({
    title: 'Error',
    description: 'There was an error',
    status: 'error',
    duration: 9000,
    isClosable: true,
   })
   setIsSubmitting(false)
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

     <Text textAlign="center" fontFamily="Dm Sans">
      Campaign: {campaignId}
     </Text>

     <Box display="flex" justifyContent="center" mt={5}>
      {!isSuccess && (
       <Box>
        {/* <Box>{campaignId && <Worldcoin proof={proof} setProof={setProof} setNullifier={setNullifier} setRoot={setRoot} action={campaignId} />}</Box> */}
        {/* {proof?.length > 0 && ( */}
        {(
         <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <Button
           backgroundColor="purple.300"
           variant="gradient"
           borderRadius="10px"
           border={'0.5px solid #312E2A'}
           boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
           py={2}
           px={12}
           fontFamily="Dm Sans"
           color="white"
           type="submit"
           isLoading={isSubmitting || isContractLoading}
           onClick={claimRewardTxn}>
           Claim
          </Button>
         </motion.div>
        )}
       </Box>
      )}
     </Box>

     {isSuccess && <SuccessComponent link={null} data={data} message="Referral sucessfully redeemed" subtitle="Check your wallet for your reward" />}
     {/* DEBUG ONLY */}
     {/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
    </div>
   </Box>

   {history.length > 0 && <History />}
  </Container>
 )
}

export default CreateLink
