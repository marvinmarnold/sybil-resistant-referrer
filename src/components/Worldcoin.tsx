import { useState, useEffect } from 'react'
import { Button } from '@chakra-ui/react'
import { BigNumber } from 'ethers'
import { decode } from '@/../../lib/wld'
import AirdropAbi from '@/../../abi/Airdrop.abi'
import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function Worldcoin() {
 const { address } = useAccount()
 const [wcResult, setWcResult] = useState<ISuccessResult | null>(null)
 const [canValidateOnchain, setCanValidateOnchain] = useState<boolean>(false)

 //  TODO: Set this as global state
 const [merkleRoot, setMerkelRoot] = useState<bigint | null>(null)
 const [nullifier, setNullifier] = useState<bigint | null>(null)
 const [proof, setProof] = useState<[bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint] | null>(null)

 useEffect(() => {
  setCanValidateOnchain(wcResult != null && address != null)
 }, [wcResult, address])

 const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`
 const { config } = usePrepareContractWrite({
  address: contractAddress,
  abi: AirdropAbi,
  enabled: canValidateOnchain,
  functionName: 'claim',
  args: [address!, merkleRoot!, nullifier!, proof!],
 })

 const { write: validateOnchain } = useContractWrite(config)

 const onSuccess = (success: ISuccessResult) => {
  if (!success) return

  const merkleRoot = decode<BigNumber>('uint256', success.merkle_root).toBigInt()
  setMerkelRoot(merkleRoot)

  const nullifier = decode<BigNumber>('uint256', success.nullifier_hash).toBigInt()
  setNullifier(nullifier)

  const proof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>('uint256[8]', success.proof).map(
   (n) => n.toBigInt()
  ) as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]
  setProof(proof)

  setWcResult(success)
 }

 // Show connect button if not connected
 // if (!address) return <ConnectButton />;

 // Show WorldId icon if logged in
 if (proof) return <p>🌐</p>

 // Verify with Worldcoin
 return (
  <IDKitWidget
   action="p1"
   onSuccess={onSuccess}
   signal={address}
   credential_types={[CredentialType.Orb, CredentialType.Phone]}
   app_id={process.env.NEXT_PUBLIC_APP_ID!}>
   {({ open }) => <Button onClick={open}>Verify with world id</Button>}
  </IDKitWidget>
 )
}
