import { Box, Button, Heading, useBreakpointValue, useColorMode, useTheme, useToast } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { NextPage } from 'next'
import 'viem/window'
import { useAccount, useContractWrite, usePrepareContractWrite, usePublicClient, useWaitForTransaction } from 'wagmi'

import Background from 'components/Background'
import Worldcoin from 'components/Worldcoin'
import CampaignsMenu from 'components/layout/CampaignsMenu'
import Container from 'components/layout/Container'
import History from 'components/layout/History'
import SuccessComponent from 'components/layout/SuccessComponent'
import { useRouter } from 'next/router'
import { CampaignType } from 'types/index'
import { Address } from 'viem'
import referralCampaignContract from '../../contracts/out/ReferralCampaign.sol/ReferralCampaign.json'

const CreateLink: NextPage = () => {
 // TODO: Fetch proof from shared state
 const router = useRouter()

 const { campaignAddress, actionId } = router.query

 const account = useAccount()
 const theme = useTheme()
 const { colorMode } = useColorMode()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const toast = useToast()
 const publicClient = usePublicClient()
 const [selectedCampaign, setSelectedCampaign] = useState<CampaignType>(
  !!campaignAddress
   ? {
      id: '',
      owner: '0x',
      campaign: campaignAddress as Address,
      actionId: actionId as string,
     }
   : {
      id: '',
      owner: '0x',
      campaign: '0x',
      actionId: '',
     }
 )
 const [link, setLink] = useState('')
 const [args, setArgs] = useState<any[]>([])
 const [isTxSubmitted, setIsTxSubmitted] = useState(false)
 const [isReadyToSubmit, setIsReadyToSubmit] = useState(false)

 const [proof, setProof] = useState<BigInt[]>([])
 const [nullifier, setNullifier] = useState<BigInt>(BigInt(0))
 const [root, setRoot] = useState<BigInt>(BigInt(0))

 const { address } = account
 const { isConnected } = useAccount()
 //  TODO: Add history on Atom
 const history = []

 useEffect(() => {
  console.log('Address changed, resetting args')
  setNullifier(BigInt(0))
  setRoot(BigInt(0))
  setProof([])
  setArgs([])
 }, [address])

 const { config } = usePrepareContractWrite({
  enabled: isReadyToSubmit,
  abi: referralCampaignContract.abi,
  functionName: 'addReferrer',

  //   address: "0x8fa7b813f246e0dd7cbb04437487fb113912224a", // 1112
  //   address: "0xa364f00198854cd1c0a24e2c502bc39d8aa29a22", // 1113
  // address: "0xd6917c944be9f91fc4c90521c789f7028cbe66ba", // 1332721324098588
  address: !!campaignAddress ? (campaignAddress as `0x${string}`) : selectedCampaign.campaign,
  args,
  onSettled(data, error) {
   console.warn('Settled', { data, error })
  },
 })

 const { data, error: contractWriteError, isError: isContractWriteError, write, isLoading: isContractWriteLoading } = useContractWrite(config)

 const execute = () => {
  console.log('executing')
  console.log(isReadyToSubmit)
  if (!!write) {
   write()
   setIsTxSubmitted(true)
   console.log('executed')
  } else {
   console.warn("Can't execute because useContractWrite has is not yet ready")
   console.log(args)
   console.log('isTxSubmitted')
   console.log(isTxSubmitted)
   console.error(contractWriteError)
   console.log('sendTx')
   console.log(write)
  }
 }

 const { isLoading: isTransactionProcessing, isSuccess: wasTxSuccessful } = useWaitForTransaction({
  enabled: isTxSubmitted,
  hash: data?.hash,
 })

 useEffect(() => {
  if (isTxSubmitted && isContractWriteError) {
   console.error(contractWriteError)
   setIsTxSubmitted(true)
   toast({
    title: 'Error',
    description: 'There was an error',
    status: 'error',
    duration: 9000,
    isClosable: true,
   })
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [isContractWriteError, isTxSubmitted, contractWriteError])

 const protocol = window.location.host === 'localhost:3000' ? 'http' : 'https'

 useEffect(() => {
  if (wasTxSuccessful) {
   const url = !campaignAddress
    ? `${protocol}://${window.location.host}/retrieve?campaignId=${selectedCampaign?.actionId}&campaignAddy=${selectedCampaign?.campaign}&ref=${address}`
    : `${protocol}://${window.location.host}/retrieve?campaignId=${actionId}&campaignAddy=${campaignAddress}&ref=${address}`
   setLink(url)

   toast({
    title: 'Success',
    description: 'Transaction submited successfully',
    status: 'success',
    duration: 9000,
    isClosable: true,
   })
  }
 }, [wasTxSuccessful, data])

 // Update args and determine if tx ready to submit
 useEffect(() => {
  console.log('Checking if ready to submit')
  console.log(address)
  console.log(root)
  console.log(nullifier)
  console.log(proof)
  setArgs([address, root, nullifier, proof])

  if (!address) return
  console.log('address passed')
  if (root.valueOf() === BigInt(0).valueOf()) return
  console.log('root passed')
  if (nullifier.valueOf() === BigInt(0).valueOf()) return
  console.log('nullifier passed')
  if (proof.length === 0) return
  console.log('proof passed')
  if (isContractWriteLoading) return

  console.log('Now ready to submit')
  setIsReadyToSubmit(true)
 }, [address, root, nullifier, proof, isContractWriteLoading])

 const registerOnchain = async () => {
  try {
   console.log('registerOnchain')
   console.log(selectedCampaign)
   console.log(account)
   if (!selectedCampaign || !account) {
    console.warn("Can't submit. Campaign or account not selected")
    return
   }
   console.log('going to exec')

   execute()
   //    setHash(hash)
   //    setIsLoading(false)
  } catch (error) {
   console.error(error)
   toast({
    title: 'Error',
    description: 'There was an error',
    status: 'error',
    duration: 9000,
    isClosable: true,
   })
   setIsTxSubmitted(false)
  }
 }

 if (!address)
  return (
   <Box>
    <Heading margin={10}>You must log in with an Ethereum Address</Heading>
   </Box>
  )

 return (
  <Container overflowY={'hidden'}>
   <Background />
   {!isConnected && (
    <Heading textAlign="center" justifyContent="center" mb={40}>
     Please Connect Your Wallet!
    </Heading>
   )}
   {isConnected && (
    <Box display="flex" mb={20} justifyContent="center">
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
        fontFamily: 'Dm Sans',
       }}>
       Create Referral Link
      </h2>

      {!campaignAddress ? (
       <CampaignsMenu selectedCampaign={selectedCampaign} setSelectedCampaign={setSelectedCampaign} isActive={proof?.length === 0} />
      ) : (
       <div style={{ fontFamily: 'Dm Sans', textAlign: 'center' }}>Campaign: {actionId}</div>
      )}

      <Box display="flex" justifyContent="center" mt={5}>
       {!link && (
        <Box>
         {proof?.length > 0 ? (
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
           <Button
            backgroundColor="purple.300"
            variant="gradient"
            border={'0.5px solid #312E2A'}
            boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
            py={2}
            px={28}
            fontFamily="Dm Sans"
            color="white"
            type="submit"
            isLoading={isTxSubmitted || isTransactionProcessing}
            onClick={registerOnchain}>
            Create
           </Button>
          </motion.div>
         ) : (
          <Box>
           {!!campaignAddress && (
            <Worldcoin proof={proof} setProof={setProof} setNullifier={setNullifier} setRoot={setRoot} action={actionId as string} />
           )}
           {selectedCampaign?.id.length > 0 && (
            <Worldcoin proof={proof} setProof={setProof} setNullifier={setNullifier} setRoot={setRoot} action={selectedCampaign?.actionId} />
           )}
          </Box>
         )}
        </Box>
       )}
      </Box>

      {wasTxSuccessful && (
       <SuccessComponent
        link={link}
        data={data}
        message="Successfully created referral link"
        subtitle="Share with your friends and you'll both be rewarded."
       />
      )}
      {/* DEBUG ONLY */}
      {/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
     </div>
    </Box>
   )}

   {history.length > 0 && <History />}
  </Container>
 )
}

export default CreateLink
