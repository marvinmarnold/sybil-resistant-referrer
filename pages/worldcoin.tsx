import { ConnectButton } from '@rainbow-me/rainbowkit';

import { useState, useEffect } from 'react'
// import { BigNumber } from 'ethers'
import { decode } from '@/lib/wld'
import ContractAbi from '@/abi/Contract.abi'
import { CredentialType, IDKitWidget, ISuccessResult, solidityEncode } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function Worldcoin() {
	const { address } = useAccount()
	const [proof, setProof] = useState<ISuccessResult | null>(null)

	// const { config } = usePrepareContractWrite({
	// 	address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
	// 	abi: ContractAbi,
	// 	enabled: proof != null && address != null,
	// 	functionName: 'verifyAndExecute',
	// 	args: [
	// 		address!,
	// 		proof?.merkle_root ? decode<BigNumber>('uint256', proof?.merkle_root ?? '') : BigNumber.from(0),
	// 		proof?.nullifier_hash ? decode<BigNumber>('uint256', proof?.nullifier_hash ?? '') : BigNumber.from(0),
	// 		proof?.proof
	// 			? decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
	// 					'uint256[8]',
	// 					proof?.proof ?? ''
	// 			  )
	// 			: [
	// 					BigNumber.from(0),
	// 					BigNumber.from(0),
	// 					BigNumber.from(0),
	// 					BigNumber.from(0),
	// 					BigNumber.from(0),
	// 					BigNumber.from(0),
	// 					BigNumber.from(0),
	// 					BigNumber.from(0),
	// 			  ],
	// 	],
	// })

	// const { write } = useContractWrite(config)

    const onSuccess = (success: ISuccessResult) => {

        console.log("Confirming with WC")
        console.log(success)
        console.log(address)
    }

	return (
		<div>
			{address ? (
				proof ? (
					<h1>TODO: submit proof</h1>
				) : (
                    // <p>{address} connected</p>
					<IDKitWidget
						action="p1"
						onSuccess={onSuccess}
						signal={address}
						credential_types={[CredentialType.Orb, CredentialType.Phone]}
						app_id={process.env.NEXT_PUBLIC_APP_ID!}
						enableTelemetry
					>
						{({ open }) => <button onClick={open}>verify with world id</button>}
					</IDKitWidget>
				)
			) : (
				<ConnectButton />
				)}
		</div>
	)
}
