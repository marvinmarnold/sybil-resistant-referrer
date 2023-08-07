import { useState } from 'react'
import { Button, FormControl, FormLabel, Input, NumberInput, NumberInputField } from '@chakra-ui/react'

const Campaign = () => {
 const [contractAddress, setContractAddress] = useState('')
 const [abi, setAbi] = useState('')
 const [functionToTrack, setFunctionToTrack] = useState('')
 const [referrerReward, setReferrerReward] = useState('')
 const [referredReward, setReferredReward] = useState('')

 return (
  <div>
   <FormControl>
    <FormLabel>Contract Address</FormLabel>
    <Input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />

    <FormLabel mt={2}>ABI</FormLabel>
    <Input value={abi} onChange={(e) => setAbi(e.target.value)} />

    <FormLabel mt={2}>Function to track</FormLabel>
    <Input value={functionToTrack} onChange={(e) => setFunctionToTrack(e.target.value)} />

    <FormLabel mt={2}>Referrer Reward</FormLabel>
    <NumberInput mb={2} value={referrerReward} onChange={(value) => setReferrerReward(value)}>
     <NumberInputField placeholder="0.05" />
    </NumberInput>

    <FormLabel mt={2}>Referred Reward</FormLabel>
    <NumberInput mb={2} value={referredReward} onChange={(value) => setReferredReward(value)}>
     <NumberInputField placeholder="0.05" />
    </NumberInput>

    <Button mt={4} onClick={() => console.log('Sent')}>
     Submit
    </Button>
   </FormControl>
  </div>
 )
}

export default Campaign
