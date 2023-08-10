import {
 Box,
 Button,
 FormControl,
 FormLabel,
 Input,
 NumberDecrementStepper,
 NumberIncrementStepper,
 NumberInput,
 NumberInputField,
 NumberInputStepper,
 Radio,
 RadioGroup,
 Select,
 Stack,
 useColorModeValue,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'

const Container = styled(Box)`
 background-color: gray.50;
 height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 0 16px;
`

const Blob = styled(Box)`
 position: absolute;
 width: 352px;
 height: 352px;
 border-radius: 50%;
 mix-blend-mode: multiply;
 filter: blur(20px);
 opacity: 0.5;
 animation: blob 8s infinite;
`

const keyframes = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, 40px) scale(1.9);
    }
    66% {
      transform: translate(20px, 20px) scale(0.8);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
`
const CreateCampaign = () => {
 const [contractAddress, setContractAddress] = useState('')
 const [abi, setAbi] = useState('')
 const [functionToTrack, setFunctionToTrack] = useState('')
 const [referrerReward, setReferrerReward] = useState('')
 const [referredReward, setReferredReward] = useState('')
 return (
  <Container>
   <style>{keyframes}</style>
   <Box position="relative" width="100%" maxWidth="lg">
    <Blob bottom="-85px" left="-100px" backgroundColor="purple.300" style={{ animationDelay: '0s' }}></Blob>
    <Blob bottom="-85px" right="-100px" backgroundColor="yellow.300" style={{ animationDelay: '4s' }}></Blob>
   </Box>

   <Box position="absolute" top={24} display="flex" justifyContent="center">
    <form
     style={{
      color: 'gray.400',
      fontFamily: 'Montserrat',
      padding: '36px',
      height: 'fit',
      width: '600px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
       placeholder="ABI"
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
       value={referrerReward}
       onChange={(value) => setReferrerReward(String(value))}
       placeholder="Number"
       size="md"
       type="number"
       borderColor="gray.400"
      />
     </FormControl>

     <FormControl isRequired style={{ width: '100%', marginTop: '20px' }}>
      <FormLabel fontWeight="bold" fontFamily={'sans-serif'}>
       Reward Amount
      </FormLabel>
      <Input
       value={referredReward}
       onChange={(value) => setReferredReward(String(value))}
       placeholder="Amount"
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
