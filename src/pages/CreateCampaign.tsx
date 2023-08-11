import { Box, Button, FormControl, FormLabel, Input, useBreakpointValue, useColorMode } from '@chakra-ui/react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

import Background from 'components/Background'
import Container from 'components/layout/Container'

const CreateCampaign = () => {
 const [contractAddress, setContractAddress] = useState('')
 const [abi, setAbi] = useState('')
 const [functionToTrack, setFunctionToTrack] = useState('')
 const [referralNumber, setReferralNumber] = useState('')
 const [referredReward, setReferredReward] = useState('')
 const formWidth = useBreakpointValue({ base: '90%', md: '600px' })
 const { colorMode } = useColorMode()

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
       Contract Address
      </FormLabel>
      <Input
       value={contractAddress}
       onChange={(e) => setContractAddress(e.target.value)}
       placeholder="Address"
       size="md"
       type="string"
       backgroundColor={'transparent'}
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       ABI
      </FormLabel>
      <Input value={abi} onChange={(e) => setAbi(e.target.value)} placeholder="ABI" size="md" type="string" borderColor="gray.400" />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Function to Track
      </FormLabel>
      <Input
       value={functionToTrack}
       onChange={(e) => setFunctionToTrack(e.target.value)}
       placeholder="Function"
       size="md"
       type="string"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Referral Number
      </FormLabel>
      <Input
       value={functionToTrack}
       onChange={(e) => setReferralNumber(e.target.value)}
       placeholder="0.05"
       size="md"
       type="string"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Referred Reward
      </FormLabel>
      <Input
       value={functionToTrack}
       onChange={(e) => setReferredReward(e.target.value)}
       placeholder="0.05"
       size="md"
       type="string"
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
        onClick={() => console.log('Sent')}>
        Create
       </Button>
      </motion.div>
     </Box>
    </form>
   </Box>
  </Container>
 )
}

export default CreateCampaign
