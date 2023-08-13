import { Box, Button, FormControl, Heading, FormLabel, Input, useBreakpointValue, useColorMode, useToast, FormHelperText } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { v4 as uuidv4 } from 'uuid'
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useNetwork } from 'wagmi'
import { parseUnits } from 'viem'

import CampaignFactory from '../../contracts/out/CampaignFactory.sol/CampaignFactory.json'
import Background from 'components/Background'
import Container from 'components/layout/Container'
import SuccessComponent from 'components/layout/SuccessComponent'
import { networks } from 'utils/network'

const CreateCampaign = () => {
 const toast = useToast()
 const { colorMode } = useColorMode()
 const network = useNetwork()

 const [campaignContractAddress, setCampaignContractAddress] = useState('')
 const [rewardTokenAddress, setRewardTokenAddress] = useState('')
 const [maxReferalsperReferee, setMaxReferralsPerReferee] = useState<string>('')
 const [rewardReferrer, setRewardReferrer] = useState<string>('')
 const [rewardReferee, setRewardReferee] = useState<string>('')
 const [contractDecimals, setContractDecimals] = useState<number>(10)
 const [args, setArgs] = useState<any[]>([])
 const [minCampaignTokenBalance, setMinCampaignTokenBalance] = useState<string>()
 const [returnedData, setReturnedData] = useState<any>()
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const [isLoading, setIsLoading] = useState<boolean>(false)

 const { address } = useAccount()
 const actionid = uuidv4()

 const bigIntMaxReferalsperReferee = maxReferalsperReferee ? parseUnits(maxReferalsperReferee, contractDecimals) : 0
 const bigIntRewardReferer = rewardReferrer ? parseUnits(rewardReferrer, contractDecimals) : 0
 const bigIntRewardReferee = rewardReferee ? parseUnits(rewardReferee, contractDecimals) : 0
 const bigIntMinCampaignTokenBalance = minCampaignTokenBalance ? parseUnits(minCampaignTokenBalance, contractDecimals) : 0

 const chainId: number = network.chain?.id ?? 5

 const { config, error, isError } = usePrepareContractWrite({
  ...CampaignFactory,
  functionName: 'addCampaign',
  //   FIXME: Add depending on the chain
  address: networks[chainId].factoryContract,
  args,
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

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
   const worldId = networks[chainId].worldId
   setArgs([
    worldId,
    campaignContractAddress,
    rewardTokenAddress,
    bigIntMaxReferalsperReferee,
    bigIntRewardReferer,
    bigIntRewardReferee,
    bigIntMinCampaignTokenBalance,
    '7777',
    parseUnits('7777', contractDecimals),
   ])
   await write?.()
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
     {writeSuccess ? (
      // TODO: Add campaign ref to the link
      <SuccessComponent link={'http://localhost:3000/createlink'} data={data} message="Successfully created!" />
     ) : (
      <form>
       <Heading textAlign="center">Create Campaign</Heading>

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
          type="submit"
          isLoading={isLoading}
          onClick={handleSubmit}
          disabled={writeLoading || isContractLoading}>
          {writeLoading || isContractLoading ? 'Loading...' : 'Create'}
         </Button>
        </motion.div>
       </Box>
      </form>
     )}
    </div>
   </Box>
  </Container>
 )
}

export default CreateCampaign
