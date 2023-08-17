import { Box, Button, FormControl, FormHelperText, FormLabel, Heading, Input, useBreakpointValue, useColorMode, useToast } from '@chakra-ui/react'
import Background from 'components/Background'
import Container from 'components/layout/Container'
import SuccessComponent from 'components/layout/SuccessComponent'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { networks } from 'utils/network'
import { v4 as uuidv4 } from 'uuid'
import { parseUnits } from 'viem'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import CampaignFactory from '../../contracts/out/CampaignFactory.sol/CampaignFactory.json'

function randomIntFromInterval(min: number, max: number) {
 // min and max included
 return Math.floor(Math.random() * (max - min + 1) + min)
}
const randActionId = randomIntFromInterval(1, 9999999999999999)

const CreateCampaign = () => {
 const { isConnected } = useAccount()
 const toast = useToast()
 const { colorMode } = useColorMode()
 const network = useNetwork()

 const [campaignContractAddress, setCampaignContractAddress] = useState('')
 const [rewardTokenAddress, setRewardTokenAddress] = useState('')
 const [maxReferalsperReferee, setMaxReferralsPerReferee] = useState<string>('')
 const [rewardReferrer, setRewardReferrer] = useState<string>('')
 const [rewardReferee, setRewardReferee] = useState<string>('')
 const [contractDecimals, setContractDecimals] = useState<number>(10)
 const [args, setArgs] = useState<any[]>(['', '', '', 0, 0, 0, 0, '', 0])
 const [minCampaignTokenBalance, setMinCampaignTokenBalance] = useState<string>('')
 const [returnedData, setReturnedData] = useState<any>('')
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const [isLoading, setIsLoading] = useState<boolean>(false)
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

 const { address } = useAccount()
 const actionid = uuidv4()

 const bigIntMaxReferalsperReferee = maxReferalsperReferee ? parseUnits(maxReferalsperReferee, contractDecimals) : 0
 const bigIntRewardReferer = rewardReferrer ? parseUnits(rewardReferrer, contractDecimals) : 0
 const bigIntRewardReferee = rewardReferee ? parseUnits(rewardReferee, contractDecimals) : 0
 const bigIntMinCampaignTokenBalance = minCampaignTokenBalance ? parseUnits(minCampaignTokenBalance, contractDecimals) : 0

 const chainId: number = network.chain?.id ?? 5

 const { config, error, isError } = usePrepareContractWrite({
  abi: CampaignFactory.abi,
  enabled: isSubmitting,
  functionName: 'addCampaign',
  //   FIXME: Add depending on the chain
  address: networks[chainId].factoryContract,
  args,
 })

 const { data, isLoading: writeLoading, isError: writeError, write } = useContractWrite(config)

 const { isLoading: isContractLoading, isSuccess: writeSuccess } = useWaitForTransaction({
  hash: data?.hash,
 })
 const worldId = networks[chainId].worldId

 useEffect(() => {
  setArgs([
   worldId,
   campaignContractAddress,
   rewardTokenAddress,
   bigIntMaxReferalsperReferee,
   bigIntRewardReferer,
   bigIntRewardReferee,
   bigIntMinCampaignTokenBalance,
   randActionId.toString(),
   randActionId,
  ])
 }, [
  worldId,
  campaignContractAddress,
  rewardTokenAddress,
  bigIntMaxReferalsperReferee,
  bigIntRewardReferer,
  bigIntRewardReferee,
  bigIntMinCampaignTokenBalance,
 ])

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
   console.log('Sending TX')
   console.log(args)
   setIsSubmitting(true)
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

   <Box position="absolute" top="64px" display="flex" justifyContent="center">
    {!isConnected && (
     <Heading textAlign="center" justifyContent="center" marginTop="60%">
      Please Connect Your Wallet!
     </Heading>
    )}
    {isConnected && (
     <div
      style={{
       color: 'gray.400',
       fontFamily: 'Montserrat',
       padding: '28px',
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
       <SuccessComponent
        link={'/createlink'}
        data={data}
        message={`Created campaign: ${randActionId}`}
        subtitle="Give this link to people who will make referrals"
       />
      ) : (
       <form>
        <Heading as="h2" fontSize="32px" fontFamily="Dm Sans" textAlign="center">
         Create Campaign
        </Heading>

        <div style={{ display: 'flex', gap: '20px' }}>
         <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
          <FormLabel fontWeight="bold" fontFamily={'Dm Sans'}>
           Campaign Contract Address
          </FormLabel>
          <FormHelperText fontFamily={'Dm Sans'} fontSize="13px">
           The contract people have to interact with
          </FormHelperText>
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
          <FormLabel fontWeight="bold" fontFamily={'Dm Sans'}>
           Reward Token Address
          </FormLabel>
          <FormHelperText fontFamily={'Dm Sans'} fontSize="13px">
           Token beind sent as reward (ERC-20)
          </FormHelperText>
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
         <FormLabel fontWeight="bold" fontFamily={'Dm Sans'}>
          Max Referrals per Referer
         </FormLabel>
         <FormHelperText fontFamily={'Dm Sans'} fontSize="13px">
          Number of times a person can get rewarded by sharing referrals on this campaign
         </FormHelperText>
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
         <FormLabel fontWeight="bold" fontFamily={'Dm Sans'}>
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

        <div style={{ display: 'flex', gap: '20px' }}>
         <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
          <FormLabel fontWeight="bold" fontFamily={'Dm Sans'}>
           Reward Referrer
          </FormLabel>
          <FormHelperText fontFamily={'Dm Sans'} fontSize="13px">
           Amount of the token you provided
          </FormHelperText>
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
          <FormLabel fontWeight="bold" fontFamily={'Dm Sans'}>
           Reward Referee
          </FormLabel>
          <Input
           value={rewardReferee}
           onChange={(e) => setRewardReferee(e.target.value)}
           placeholder="0.05"
           size="md"
           mt="15px"
           type="number"
           borderColor="gray.400"
          />
         </FormControl>
        </div>
        <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
         <FormLabel fontWeight="bold" fontFamily={'Dm Sans'}>
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
           border={'0.5px solid #312E2A'}
           boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
           py={2}
           px={28}
           fontFamily="Dm Sans"
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
    )}
   </Box>
  </Container>
 )
}

export default CreateCampaign
