import { ChevronDownIcon } from '@chakra-ui/icons'
import {
 Box,
 Button,
 FormControl,
 FormHelperText,
 FormLabel,
 Heading,
 Input,
 Menu,
 MenuButton,
 MenuItem,
 MenuList,
 Text,
 useBreakpointValue,
 useColorMode,
 useToast,
} from '@chakra-ui/react'
import Background from 'components/Background'
import Container from 'components/layout/Container'
import SuccessComponent from 'components/layout/SuccessComponent'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { networks } from 'utils/network'
import { parseUnits } from 'viem'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import CrossCampaignFactory from '../../contracts/out/CrossCampaignFactory.sol/CrossCampaignFactory.json'
import crossReferralCampaign from '../../contracts/out/CrossReferralCampaign.sol/CrossReferralCampaign.json'

function randomIntFromInterval(min: number, max: number) {
 // min and max included
 return Math.floor(Math.random() * (max - min + 1) + min)
}
const randActionId = randomIntFromInterval(1, 9999999999999999)

const CreateCrossCampaign = () => {
 const { isConnected } = useAccount()
 const toast = useToast()
 const { colorMode } = useColorMode()
 const network = useNetwork()

 const [campaignContractAddress, setCampaignContractAddress] = useState('')
 const [rewardTokenAddress, setRewardTokenAddress] = useState('')
 const [maxReferalsperReferee, setMaxReferralsPerReferee] = useState<string>('')
 const [rewardReferrer, setRewardReferrer] = useState<string>('')
 const [rewardReferee, setRewardReferee] = useState<string>('')
 const [chainIdSelected, setChainIdSelected] = useState<number | null>(null)
 const [contractDecimals, setContractDecimals] = useState<number>(10)
 const [args, setArgs] = useState<any[]>(['', '', '', 0, 0, 0, 0, '', 0])
 const [minCampaignTokenBalance, setMinCampaignTokenBalance] = useState<string>('')
 const [returnedData, setReturnedData] = useState<any>('')
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const [isLoading, setIsLoading] = useState<boolean>(false)
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
 const [isSecondSubmitting, setSeccondIsSubmitting] = useState<boolean>(false)
 const [selectedChain, setSelectedChain] = useState<Chain | null>(null)

 
 
 const [showButton, setShowButton] = useState(false)
 const bigIntMaxReferalsperReferee = maxReferalsperReferee ? parseUnits(maxReferalsperReferee, contractDecimals) : 0
 const bigIntRewardReferer = rewardReferrer ? parseUnits(rewardReferrer, contractDecimals) : 0
 const bigIntRewardReferee = rewardReferee ? parseUnits(rewardReferee, contractDecimals) : 0
 const bigIntMinCampaignTokenBalance = minCampaignTokenBalance ? parseUnits(minCampaignTokenBalance, contractDecimals) : 0

 const chainOptions = [
  { name: 'Eth Goerli', chainId: 5 },
  { name: 'Base', chainId: 84531 },
  { name: 'Mumbai', chainId: 80001 },
 ] as const

 type Chain = (typeof chainOptions)[number]['name']
 const chainId: number = network.chain?.id ?? 5
//  const tokenContractAddress = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
 const { config, error, isError } = usePrepareContractWrite({
  abi: CrossCampaignFactory.abi,
  enabled: isSubmitting,
  functionName: 'addCampaign',
  //   FIXME: Add depending on the chain
  address: '0x64800F063Eb4FBD9AF3c9F8CDB7B787f4116558c',
  args,
 })

 const { data, isLoading: writeLoading, isError: writeError, write } = useContractWrite(config)

 const { isLoading: isContractLoading, isSuccess: writeSuccess } = useWaitForTransaction({
  hash: data?.hash,
 })

 const {
  config: SecondConfig,
  error: SecontxError,
  isError: SecondIsError,
 } = usePrepareContractWrite({
  abi: crossReferralCampaign.abi,
  enabled: isSecondSubmitting,
  functionName: 'setChainId',
  //   FIXME: Add depending on the chain
  address: '0x4eA8a99859D7277c82bD311834577f9c3047a63d',
  args: [chainIdSelected, '0xFeC9AD52dA5eCC6e7b18225Ec517F57276BFBFdF'],
 })

 const { data: SecondData, isLoading: SecondWriteLoading, isError: SecondWriteError, write: SecondWrite } = useContractWrite(SecondConfig)

 const { isLoading: isSecondContractLoading, isSuccess: SecondWriteSuccess } = useWaitForTransaction({
  hash: SecondData?.hash,
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

 // For First Transaction
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

 //  For Second Transaction
 useEffect(() => {
  if (SecondWriteSuccess) {
   console.log('Returned Data', SecondData)

   toast({
    title: 'Success',
    description: 'Transaction submited successfully',
    status: 'success',
    duration: 9000,
    isClosable: true,
   })
  }
 }, [SecondWriteSuccess, SecondData])

 // For First Transaction
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
   console.log('Sending TX')
   console.log(args)
   setIsSubmitting(true)
   write?.()
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

 //  For Second Transaction
 const handleSubmitChainId = async () => {
  try {
   console.log('Sending TX')
   console.log(args)
   setSeccondIsSubmitting(true)
   SecondWrite?.()
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

 const handleOptionSelect = (chain: Chain) => {
  setSelectedChain(chain)
  setShowButton(true)

  const selectedChain = chainOptions.find((option) => option.name === chain)
  if (selectedChain) {
   console.log(selectedChain.chainId)
   setChainIdSelected(selectedChain.chainId)
   setShowButton(true)
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
      {SecondWriteSuccess && (
       <SuccessComponent
        link={'/createlink'}
        data={SecondData}
        message={`Created campaign: ${randActionId}`}
        subtitle="Give this link to people who will make referrals"
       />
      )}
      {writeSuccess && !SecondWriteSuccess && (
       // TODO: Add campaign ref to the link

       <Box margin={10} textAlign="center">
        <Heading as="h2" fontSize="32px" fontFamily="Dm Sans" textAlign="center" marginBottom="6px">
         Select Chain Id
        </Heading>
        {selectedChain && (
         <Text mb={4} fontFamily="Dm Sans" textAlign="center" variant="outline">{`Chain ID: ${
          chainOptions.find((chain) => chain.name === selectedChain)?.chainId
         }`}</Text>
        )}
        <Menu>
         <MenuButton
          as={Button}
          backgroundColor="purple.300"
          variant="gradient"
          border={'0.5px solid #312E2A'}
          boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
          py={2}
          px={28}
          fontFamily="Dm Sans"
          color="white"
          rightIcon={<ChevronDownIcon />}
          borderRadius="md">
          {selectedChain ? selectedChain : 'Select Chain'}
         </MenuButton>
         <MenuList boxShadow="md" border={'2px solid #B794F4'} w="350px" borderRadius="md" mt={1} zIndex={1}>
          {chainOptions.map((chain) => (
           <MenuItem key={chain.name} fontFamily="Dm Sans" onClick={() => handleOptionSelect(chain.name)}>
            {chain.name}
           </MenuItem>
          ))}
         </MenuList>
        </Menu>

        {showButton && (
         <Button
          mt={4}
          backgroundColor="purple.300"
          marginLeft={4}
          marginBottom={2}
          variant="gradient"
          border={'0.5px solid #312E2A'}
          boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
          fontFamily="Dm Sans"
          color="white"
          borderRadius="md"
          isLoading={isLoading}
          onClick={handleSubmitChainId}
          disabled={SecondWriteLoading || isSecondContractLoading}>
          {SecondWriteLoading || isSecondContractLoading ? 'Loading...' : 'Submit'}
         </Button>
        )}
       </Box>
      )}
      {!writeSuccess && !SecondWriteSuccess && (
       <form>
        <Heading as="h2" fontSize="32px" fontFamily="Dm Sans" textAlign="center">
         Create Cross Campaign
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

export default CreateCrossCampaign
