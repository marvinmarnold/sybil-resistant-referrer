import { useState } from 'react'
import { Button, FormControl, FormLabel, Input, NumberInput, NumberInputField, Text } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { ethers } from 'ethers'

function Campaign() {
 const [contractAddress, setContractAddress] = useState('')
 const [abi, setAbi] = useState('')
 const [functionToTrack, setFunctionToTrack] = useState('')
 const [referrerReward, setReferrerReward] = useState('')
 const [referredReward, setReferredReward] = useState('')

 const { library, account } = useWeb3React()

 const sendTransaction = async () => {
  if (library && account && contractAddress && abi && functionToTrack && referrerReward && referredReward) {
   const contract = new ethers.Contract(contractAddress, JSON.parse(abi), library.getSigner(account))
   await contract[functionToTrack](ethers.utils.parseEther(referrerReward), ethers.utils.parseEther(referredReward))
  }
 }

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

    <Button mt={4} onClick={sendTransaction}>
     Submit
    </Button>
   </FormControl>
  </div>
 )
}
