import { Box, Button, FormControl, FormLabel, Input, useBreakpointValue, useColorMode, useToast, FormHelperText } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { uuid } from 'uuidv4'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { parseUnits } from 'viem'

import CampaignFactory from '../../contracts/out/CampaignFactory.sol/CampaignFactory.json'
import Background from 'components/Background'
import Container from 'components/layout/Container'

const CreateCampaign = () => {
 const toast = useToast()
 const { colorMode } = useColorMode()

 const [campaignContractAddress, setCampaignContractAddress] = useState('')
 const [rewardTokenAddress, setRewardTokenAddress] = useState('')
 const [maxReferalsperReferee, setMaxReferralsPerReferee] = useState<string>()
 const [rewardReferrer, setRewardReferrer] = useState<string | undefined>()
 const [rewardReferee, setRewardReferee] = useState<string | undefined>()
 const [contractDecimals, setContractDecimals] = useState<number>(18)
 const [minCampaignTokenBalance, setMinCampaignTokenBalance] = useState<string>()
 const [returnedData, setReturnedData] = useState<any>()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const [isLoading, setIsLoading] = useState<boolean>()
 const { address } = useAccount()

 const actionid = uuid()

 const bigIntMaxReferalsperReferee = maxReferalsperReferee ? parseUnits(maxReferalsperReferee, contractDecimals) : 0
 const bigIntRewardReferer = rewardReferrer ? parseUnits(rewardReferrer, contractDecimals) : 0
 const bigIntRewardReferee = rewardReferee ? parseUnits(rewardReferee, contractDecimals) : 0
 const bigIntMinCampaignTokenBalance = minCampaignTokenBalance ? parseUnits(minCampaignTokenBalance, contractDecimals) : 0

 const {
  config,
  error: prepareError,
  isError: isPrepareError,
  isSuccess: prepareSuccess,
 } = usePrepareContractWrite({
  ...CampaignFactory,
  functionName: 'addCampaign',
  address: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_OP! as `0x${string}`,
  args: [
   campaignContractAddress,
   rewardTokenAddress,
   bigIntMaxReferalsperReferee,
   bigIntRewardReferer,
   bigIntRewardReferee,
   bigIntMinCampaignTokenBalance,
   actionid,
  ],
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

 const CreateCampaign = async () => {
  try {
   setIsLoading(true)
   if (prepareSuccess) write?.()
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

 return (
  <Container>
   <Background />

   <Box position="absolute" top={24} display="flex" justifyContent="center">
    <form
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

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Campaign Contract Address
      </FormLabel>
      <FormHelperText>The contract people have to interact with</FormHelperText>
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
       Max Referrals per Referer
      </FormLabel>
      <FormHelperText>Number of times a person can get rewarded by sharing referrals on this campaign</FormHelperText>
      <Input
       value={maxReferalsperReferee}
       onChange={(e) => setMaxReferralsPerReferee(e.target.value)}
       placeholder="i.e: 3"
       size="md"
       type="number"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Reward Token Address
      </FormLabel>
      <FormHelperText>Token beind sent as reward (ERC-20)</FormHelperText>
      <Input
       value={rewardTokenAddress}
       onChange={(e) => setRewardTokenAddress(e.target.value)}
       placeholder="Address"
       size="md"
       type="string"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Contract Decimals
      </FormLabel>
      <Input
       value={contractDecimals}
       onChange={(e) => setContractDecimals(parseFloat(e.target.value))}
       placeholder="18"
       size="md"
       type="number"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Reward Referrer
      </FormLabel>
      <FormHelperText>Amount of the token you provided</FormHelperText>
      <Input
       value={rewardReferrer}
       onChange={(e) => setRewardReferrer(e.target.value)}
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
       onChange={(e) => setRewardReferee(e.target.value)}
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
       onChange={(e) => setMinCampaignTokenBalance(e.target.value)}
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
        onClick={CreateCampaign}
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
