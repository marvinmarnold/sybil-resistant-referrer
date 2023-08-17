import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit'
import { BigNumber } from 'ethers'
import { decode } from '../../lib/wld'

export default function Worldcoin() {
 // const [wcResult, setWcResult] = useState<ISuccessResult | null>(null)
 // const [canValidateOnchain, setCanValidateOnchain] = useState<boolean>(false)
 // const [merkleRoot, setMerkelRoot] = useState<bigint | null>(null)
 // const [nullifier, setNullifier] = useState<bigint | null>(null)
 // const [proof, setProof] = useState<[bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint] | null>(null)

 // useEffect(() => {
 // 	setCanValidateOnchain(wcResult != null )
 // }, [wcResult])

 // const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`
 // const { config } = usePrepareContractWrite({
 // 	address: contractAddress,
 // 	abi: AirdropAbi,
 // 	enabled: canValidateOnchain,
 // 	functionName: 'claim',
 // 	args: [
 // 		address!,
 // 		merkleRoot!,
 // 		nullifier!,
 // 		proof!,
 // 	],
 // })
 // const { write: validateOnchain } = useContractWrite(config)
 const address = '0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE'

 const onSuccess = (success: ISuccessResult) => {
  if (!success) return
  console.log('Got worldcoin response')
  console.log(success)

  let wcOutput = ''
  let referOutput = ''

  // referer
  referOutput += address + ' '

  const merkleRoot = decode<BigNumber>('uint256', success.merkle_root).toBigInt()
  // console.log("merkleRoot")
  // console.log(merkleRoot)
  wcOutput += merkleRoot.toString() + ' '
  referOutput += merkleRoot.toString() + ' '

  //  const signal = '0x51C61b4dbeEA227A9c1412Ca05C7E4FcEBD2af8E'
  const signalHash = '123845985014926741560357758076573343305935680105398604505404166143114709928'
  wcOutput += signalHash + ' '

  const nullifier = decode<BigNumber>('uint256', success.nullifier_hash).toBigInt()
  // console.log("nullifier")
  // console.log(nullifier)
  wcOutput += nullifier.toString() + ' '
  referOutput += nullifier.toString() + ' "['

  // computeExternalNullifier('app_staging_f76857baa94ac9ef1ec53f86bbecccba', '10001')
  const externalNullifier = '29265225260071301613061288759449100420321180012251444029016261170183642916652'
  wcOutput += externalNullifier + ' "['

  const proof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>('uint256[8]', success.proof).map(
   (n) => n.toBigInt()
  ) as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]
  // console.log("proof")
  // console.log(proof)

  wcOutput += proof.toString() + ']"'
  referOutput += proof.toString() + ']"'
  console.log('WORLDCOIN OUTPUT')
  console.log(wcOutput)
  console.log()
  console.log()
  console.log()
  console.log()
  console.log()
  console.log('REFER OUTPUT')
  console.log(referOutput)
 }

 // Show connect button if not connected

 // Show referral button if logged in

 // Verify with Worldcoin
 return (
  <IDKitWidget
   action="20001"
   onSuccess={onSuccess}
   signal={address}
   credential_types={[CredentialType.Orb, CredentialType.Phone]}
   app_id={process.env.NEXT_PUBLIC_APP_ID!}>
   {({ open }) => <button onClick={open}>Verify with world id</button>}
  </IDKitWidget>
 )
}
