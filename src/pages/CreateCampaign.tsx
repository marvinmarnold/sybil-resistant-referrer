import { Box, Button, FormControl, FormLabel, Input, useBreakpointValue, useColorMode, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { uuid } from 'uuidv4'
import Background from 'components/Background'
import Container from 'components/layout/Container'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import CampaignFactoryABI from '../../contracts/out/CampaignFactory.sol/CampaignFactory.json'
const CreateCampaign = () => {
 const [campaignContractAddress, setCampaignContractAddress] = useState('')
 const [rewardTokenAddress, setRewardTokenAddress] = useState('')
 const [maxReferalsperReferee, setMaxReferralsPerReferee] = useState<number>()
 const [rewardReferrer, setRewardReferrer] = useState<number>()
 const [rewardReferee, setRewardReferee] = useState<number>()
 const [minCampaignTokenBalance, setMinCampaignTokenBalance] = useState<number>()
 const [returnedData, setReturnedData] = useState<any>()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const { colorMode } = useColorMode()
 const toast = useToast()
 const { address } = useAccount()
 const actionid = uuid()
 //  console.log(' UUID ' , actionid);

 // console.log("Before Write:",typeof(campaignContractAddress),typeof(rewardTokenAddress),typeof(maxReferalsperReferee),typeof(rewardReferrer),typeof(rewardReferee),typeof(minCampaignTokenBalance),typeof(actionid));
 const {
  config,
  error: prepareError,
  isError: isPrepareError,
 } = usePrepareContractWrite({
  address: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR! as `0x${string}`,
  abi: CampaignFactoryABI.abi,
  functionName: 'addCampaign',
  args: [campaignContractAddress, rewardTokenAddress, maxReferalsperReferee, rewardReferrer, rewardReferee, minCampaignTokenBalance, actionid],
 })
 const { data, isLoading: writeLoading, isError: writeError, write } = useContractWrite(config)
 const { isLoading: isContractLoading, isSuccess: writeSuccess } = useWaitForTransaction({
  hash: data?.hash,
 })
 useEffect(() => {
  if (writeSuccess) {
   console.log('Returned Data', data)
   setReturnedData(data)

   toast({
    title: 'Success',
    description: 'Transaction submited successfully',
    status: 'success',
    duration: 9000,
    isClosable: true,
   })
  }
 }, [writeSuccess, data])

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault()

  try {
   await write?.()
  } catch (error) {
   console.error('Error submitting transaction:', error)
   toast({
    title: 'Error',
    description: 'There was an error submitting the transaction.',
    status: 'error',
    duration: 9000,
    isClosable: true,
   })
  }
 }

 return (
  <Container>
   <Background />

   <Box position="absolute" top={24} display="flex" justifyContent="center">
    <form
     onSubmit={handleSubmit}
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
      Create Campaign
     </h2>

     <div style={{ display: 'flex', gap: '15px' }}>
      <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
       <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
        Campaign Contract Address
       </FormLabel>
       <Input
        value={campaignContractAddress}
        onChange={(e) => setCampaignContractAddress(e.target.value)}
        placeholder="Address"
        size="md"
        type="string"
        backgroundColor={'transparent'}
        borderColor="gray.400"
       />
      </FormControl>

      <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
       <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
        Reward Token Address
       </FormLabel>
       <Input
        value={rewardTokenAddress}
        onChange={(e) => setRewardTokenAddress(e.target.value)}
        placeholder="Address"
        size="md"
        type="string"
        borderColor="gray.400"
       />
      </FormControl>
     </div>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Max Referrals per Referee
      </FormLabel>
      <Input
       value={maxReferalsperReferee}
       onChange={(e) => setMaxReferralsPerReferee(parseFloat(e.target.value))}
       placeholder="0.05"
       size="md"
       type="number"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Reward referrer
      </FormLabel>
      <Input
       value={rewardReferrer}
       onChange={(e) => setRewardReferrer(parseFloat(e.target.value))}
       placeholder="0.05"
       size="md"
       type="number"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Reward Referee
      </FormLabel>
      <Input
       value={rewardReferee}
       onChange={(e) => setRewardReferee(parseFloat(e.target.value))}
       placeholder="0.05"
       size="md"
       type="number"
       borderColor="gray.400"
      />
     </FormControl>
     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Minimum Campaign Token Balance
      </FormLabel>
      <Input
       value={minCampaignTokenBalance}
       onChange={(e) => setMinCampaignTokenBalance(parseFloat(e.target.value))}
       placeholder="0.05"
       size="md"
       type="number"
       borderColor="gray.400"
      />
     </FormControl>

     <Box display="flex" justifyContent="center" mt={5}>
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
        disabled={writeLoading || isContractLoading}>
        {writeLoading || isContractLoading ? 'Loading...' : 'Create'}
       </Button>
      </motion.div>
     </Box>
    </form>
   </Box>
  </Container>
 )
}

export default CreateCampaign
