import { utils } from 'ethers'
import { defaultAbiCoder as abi } from 'ethers/lib/utils'

export const decode = <T>(type: string, encodedString: string): T => {
 return abi.decode([type], encodedString)[0]
}

export const hashToField = (signal: string): BigInt => {
 const bytes: Uint8Array = utils.toUtf8Bytes(signal)
 return hashToFieldBytes(bytes)
}

export const hashToFieldBytes = (bytes: Uint8Array): BigInt => {
 const hash: string = utils.keccak256(bytes)
 // Removing first 8 bits (1 byte = 2 hexadecimal characters, plus 2 for '0x' prefix)
 const shiftedHash: string = '0x' + hash.slice(4)
 return BigInt(shiftedHash)
}

// export const computeExternalNullifier = (appId: string, actionId: string): BigInt => {
//  const packedAppIdStr: string = utils.solidityPack(['string'], [appId])
//  const packedAppId: Uint8Array = utils.arrayify(packedAppIdStr)
//  const hashedAppId: BigInt = hashToFieldBytes(packedAppId)

//  // Now, packing the hashed appId and actionId together
//  const finalPackedStr: string = utils.solidityPack(['bytes32', 'string'], [hashedAppId.toString(), actionId])
//  const finalPacked: Uint8Array = utils.arrayify(finalPackedStr)

//  return hashToFieldBytes(finalPacked)
// }

export const computeExternalNullifier = (appId: string, actionId: string): BigInt => {
 // Step 1 and 2: Pack appId and then hash
 const appIdHash: string = utils.keccak256(utils.solidityPack(['string'], [appId]))

 // Step 3: Pack the appId hash and actionId
 const combined: string = utils.solidityPack(['bytes32', 'string'], [appIdHash, actionId])

 // Step 4: Hash the combined result
 const finalHash: string = utils.keccak256(combined)

 // Convert to BigInt for consistency
 return BigInt(finalHash)
}
