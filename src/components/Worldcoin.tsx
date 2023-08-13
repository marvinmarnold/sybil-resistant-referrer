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
 setNullifier: React.Dispatch<React.SetStateAction<BigInt | undefined>>
 setRoot: React.Dispatch<React.SetStateAction<BigInt | undefined>>
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

  const merkleRoot = decode<BigNumber>('uint256', success.merkle_root).toBigInt()
  setRoot(merkleRoot)

  const nullifier = decode<BigNumber>('uint256', success.nullifier_hash).toBigInt()
  setNullifier(nullifier)

  const tempProof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>('uint256[8]', success.proof).map(
   (n) => n.toBigInt()
  ) as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]

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

 // Verify with Worldcoin
 return (
  <IDKitWidget
   action={action}
   onSuccess={onSuccess}
   signal={address}
   credential_types={[CredentialType.Orb, CredentialType.Phone]}
   app_id={process.env.NEXT_PUBLIC_APP_ID!}>
   {({ open }) => (
    <Box textAlign="center" margin={10}>
     <Text margin={3}>Verify with World Id 🌐</Text>
     <Button onClick={open}>I&apos;m a human 👋</Button>

     <Text margin={5}>or</Text>
     {/* // Don't show page if there's no WorldId connected  */}
     {proof?.length === 0 && (
      <Box>
       <Link href="https://worldcoin.org/download-app" isExternal>
        <Button variant="outline">
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
