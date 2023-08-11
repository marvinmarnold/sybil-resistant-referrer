'use client'

import { useState, useEffect } from 'react'
import { Button } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { decode } from '@/../../lib/wld'
import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount } from 'wagmi'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { merkleRootAtom, nullifierAtom, proofAtom } from 'recoil/worldcoin'

export default function Worldcoin() {
 const { address } = useAccount()
 const [wcResult, setWcResult] = useState<ISuccessResult | null>(null)
 const [canValidateOnchain, setCanValidateOnchain] = useState<boolean>(false)

 const setMerkelRoot = useSetRecoilState(merkleRootAtom)
 const setNullifier = useSetRecoilState(nullifierAtom)
 const [stringProof, setProof] = useRecoilState(proofAtom)

 const proof = stringProof.map((value: string) => BigInt(value))

 useEffect(() => {
  setCanValidateOnchain(wcResult != null && address != null)
 }, [wcResult, address])

 const onSuccess = (success: ISuccessResult) => {
  if (!success) return
  console.log("Got Worldcoin response")
//   console.log(success)

  const merkleRoot = decode<BigNumber>('uint256', success.merkle_root).toBigInt()
  setMerkelRoot(merkleRoot.toString())
  console.log("merkle")
  console.log(merkleRoot)

  const nullifier = decode<BigNumber>('uint256', success.nullifier_hash).toBigInt()
  setNullifier(nullifier.toString())
  console.log("nullifier")
  console.log(nullifier)

  const tempProof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>('uint256[8]', success.proof).map(
   (n) => n.toBigInt()
  ) as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]

  const convertedProof = tempProof.map((value) => value.toString())
  setProof(convertedProof) // Convert BigInt values to strings to be accepted by localStorage
    console.log("convertedProof")
  console.log(convertedProof)

  setWcResult(success)
 }

 // Show connect button if not connected
 // if (!address) return <ConnectButton />;

 // Show WorldId icon if logged in
 if (proof.length !== 0) return <Button isActive={false}>🌐 Connected</Button>

 // Verify with Worldcoin
 return (
  <IDKitWidget
   action="p1"
   onSuccess={onSuccess}
   signal={address}
   credential_types={[CredentialType.Orb, CredentialType.Phone]}
   app_id={process.env.NEXT_PUBLIC_APP_ID!}>
   {({ open }) => <Button onClick={open}>🌐 Verify World Id</Button>}
  </IDKitWidget>
 )
}
