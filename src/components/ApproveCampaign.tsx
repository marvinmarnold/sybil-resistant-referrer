import { Box, Button, Heading, Text, useToast } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import ERC20Contract from '../../contracts/out/ERC20.sol/ERC20.json'

import SuccessComponent from 'components/layout/SuccessComponent'

const ApproveCampaign = ({
 campaignAddress,
 txnData,
 rewardTokenAddress,
 actionId,
}: {
 campaignAddress: `0x${string}` | undefined
 txnData: any
 rewardTokenAddress: string
 actionId: string
}) => {
 const toast = useToast()
 const network = useNetwork()
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
 const [returnedData, setReturnedData] = useState<any>('')

 const chainId: number = network.chain?.id ?? 5

 const { config, error, isError } = usePrepareContractWrite({
  abi: ERC20Contract.abi,
  enabled: !!campaignAddress,
  functionName: 'approve',
  address: rewardTokenAddress as Address,
  args: [campaignAddress, '1000000000000000000000000000000'],
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
   console.log('Sending TX')
   console.log('campaignAddress: ', campaignAddress)
   if (!!write) {
    await write?.()
    setIsSubmitting(true)
   }
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

 return (
  <Box>
   <Heading as="h2" fontSize="32px" fontFamily="Dm Sans" textAlign="center">
    Create Campaign
   </Heading>
   {!writeSuccess && (
    <>
     <Text as="h5" fontSize="xl" marginY={10}>
      You need to approve the campaign contract
      <br />
      to distribute awards on your behalf.
     </Text>

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
        isLoading={isSubmitting}
        onClick={handleSubmit}
        disabled={writeLoading || isContractLoading}>
        {writeLoading || isContractLoading ? 'Loading...' : 'Approve'}
       </Button>
      </motion.div>
     </Box>
    </>
   )}

   {/* TODO: Add campaign ref to the link */}
   {writeSuccess && (
    <Box display="flex" justifyContent="center" mt={5}>
     <SuccessComponent
      link={`${window.location.host}/createlink?campaignAddress=${campaignAddress}&actionId=${actionId}`}
      data={data ? data : txnData}
      message={`Successfully ${data ? 'approved the campaign' : 'created a new campaign'}`}
      subtitle="Start sharing the link"
     />
    </Box>
   )}
  </Box>
 )
}

export default ApproveCampaign
