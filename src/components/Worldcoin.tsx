'use client'

import { useState, useEffect } from 'react'
import { Button, Text, Box, Link, Icon } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { decode } from '@/../../lib/wld'
import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount } from 'wagmi'
import { FiExternalLink } from 'react-icons/fi'

type WorldTypes = {
 proof: BigInt[]
 setProof: React.Dispatch<React.SetStateAction<BigInt[]>>
 setNullifier: React.Dispatch<React.SetStateAction<BigInt>>
 setRoot: React.Dispatch<React.SetStateAction<BigInt>>
 action: string
}

const Worldcoin = ({ proof, setProof, setNullifier, setRoot, action }: WorldTypes) => {
 const { address } = useAccount()
 const [wcResult, setWcResult] = useState<ISuccessResult | null>(null)
 const [canValidateOnchain, setCanValidateOnchain] = useState<boolean>(false)

 useEffect(() => {
  setCanValidateOnchain(wcResult != null && address != null)
 }, [wcResult, address])

 const onSuccess = (success: ISuccessResult) => {
  if (!success) return
  console.log('Got Worldcoin response')
  let output = address + ' '

  const merkleRoot = decode<BigNumber>('uint256', success.merkle_root).toBigInt()
  setRoot(merkleRoot)
  output += merkleRoot.toString() + ' '

  const nullifier = decode<BigNumber>('uint256', success.nullifier_hash).toBigInt()
  setNullifier(nullifier)
  output += nullifier.toString() + ' "['

  const tempProof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>('uint256[8]', success.proof).map(
   (n) => n.toBigInt()
  ) as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]
  output += tempProof.toString() + ']"'
  console.log(output)
  //   const convertedProof = tempProof.map((value) => value.toString())
  setProof(tempProof) // Convert BigInt values to strings to be accepted by localStorage
  setWcResult(success)
 }

 // Show connect button if not connected
 // if (!address) return <ConnectButton />;

 // Show WorldId icon if logged in
 if (proof?.length !== 0)
  return (
   <Box>
    <Text fontSize="xl">✅ Verified Human</Text>
   </Box>
  )

 console.log('Rendering QR')
 console.log(action)
 console.log(address)
 console.log(process.env.NEXT_PUBLIC_APP_ID)

 // Verify with Worldcoin
 return (
  <IDKitWidget
   //  action="1115"
   action={action}
   onSuccess={onSuccess}
   signal={address}
   credential_types={[CredentialType.Orb, CredentialType.Phone]}
   app_id={process.env.NEXT_PUBLIC_APP_ID!}>
   {({ open }) => (
    <Box textAlign="center" margin={4}>
     <Text fontFamily="Dm Sans" margin={3}>
      Verify with World Id 🌐
     </Text>
     <Button
      backgroundColor="purple.300"
      variant="gradient"
      border={'0.5px solid #312E2A'}
      boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
      py={2}
      px={36}
      fontFamily="Dm Sans"
      color="white"
      onClick={open}>
      I&apos;m a human 👋
     </Button>

     <Text fontFamily="Dm Sans" margin={5}>
      or
     </Text>
     {/* // Don't show page if there's no WorldId connected  */}
     {proof?.length === 0 && (
      <Box>
       <Link href="https://worldcoin.org/download-app" isExternal>
        <Button variant="outline" border={'0.5px solid #312E2A'} boxShadow={'2.8px 3.8px 0px 0px #312E2A'} py={2} px={24} fontFamily="Dm Sans">
         Download Worldcoin App
         <Icon as={FiExternalLink} mx="2px" />
        </Button>
       </Link>
      </Box>
     )}
    </Box>
   )}
  </IDKitWidget>
 )
}

export default Worldcoin
