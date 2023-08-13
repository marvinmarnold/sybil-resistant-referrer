
import { CredentialType, IDKitWidget, ISuccessResult, solidityEncode } from '@worldcoin/idkit'

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

    // const onSuccess = (success: ISuccessResult) => {
	// 	if (!success) return;
	// 	console.log("Got worldcoin response")
	// 	console.log(success)

	// 	let output = ""
	// 	const merkleRoot = decode<BigNumber>('uint256', success.merkle_root).toBigInt()
	// 	setMerkelRoot(merkleRoot)
	// 	// console.log("merkleRoot")
	// 	// console.log(merkleRoot)
	// 	output += merkleRoot.toString() + " "

	// 	const nullifier = decode<BigNumber>('uint256', success.nullifier_hash).toBigInt()
	// 	setNullifier(nullifier)
	// 	// console.log("nullifier")
	// 	// console.log(nullifier)
	// 	output += nullifier.toString() + " \"["

	// 	const proof = decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
	// 		'uint256[8]',
	// 		success.proof
	//   	).map((n) => n.toBigInt()) as [bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]
	// 	setProof(proof)
	// 	// console.log("proof")
	// 	// console.log(proof)

	// 	output += proof.toString() + "]\""
	// 	console.log(output)



	// 	setWcResult(success)
    // }

	// Show connect button if not connected

	// Show referral button if logged in

	// Verify with Worldcoin
	return (
		<IDKitWidget
			action="campaign20"
			onSuccess={() => {}}
			signal="0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE"
			credential_types={[CredentialType.Orb, CredentialType.Phone]}
			app_id={process.env.NEXT_PUBLIC_APP_ID!}
		>
			{({ open }) => <button onClick={open}>Verify with world id</button>}
		</IDKitWidget>
	)
}
