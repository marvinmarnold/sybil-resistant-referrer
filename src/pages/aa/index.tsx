import { Text, Button, Box } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import styled from '@emotion/styled'
// import { getInitCode } from 'utils/aa'
import Background from 'components/Background'
import { useEffect } from 'react'
import {
    SimpleAccountFactory__factory,
    EntryPoint__factory,
    SimpleAccount__factory,
    EntryPoint,
    UserOperationStruct,
   } from '@account-abstraction/contracts'
   import { ethers, BigNumber, Wallet } from 'ethers'
   // import { ERC20, ERC20__factory } from "@pimlico/erc20-paymaster"
   

const Container = styled(Box)`
 background-color: gray.50;
 height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 0 16px;
`

export default function Home() {
       // GENERATE THE INITCODE
   const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
   
   const provider = new ethers.providers.StaticJsonRpcProvider('https://goerli.base.org')
//    const provider = new ethers.providers.StaticJsonRpcProvider('https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq')
   // const owner = Wallet.createRandom()
   // console.log('Generated wallet with private key:', owner.privateKey)
   
   const getInitCode = (address: string): string => {
       const simpleAccountFactory = SimpleAccountFactory__factory.connect(SIMPLE_ACCOUNT_FACTORY_ADDRESS, provider)
       
       return ethers.utils.hexConcat([
       SIMPLE_ACCOUNT_FACTORY_ADDRESS,
       simpleAccountFactory.interface.encodeFunctionData('createAccount', [address, 0]),
   ])}
   
    const owner = new Wallet('0x04f1ac9b8a07acfb33646f778318e3354e5d6830ae12deb22b3ad39225fca66d')
    const refererAddress = owner.address
    // const refererAddress = "0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE"
    const initCode = getInitCode(refererAddress)
    console.log('Generated initCode:', initCode)

    // CALCULATE THE SENDER ADDRESS
const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
 
const entryPoint = EntryPoint__factory.connect(
	ENTRY_POINT_ADDRESS,
	provider,
)
 
useEffect(() => {
    const doIt = async () => {
        const senderAddress = await entryPoint.callStatic.getSenderAddress(initCode)
        .then(() => {
          throw new Error("Expected getSenderAddress() to revert");
        })
        .catch((e) => {
            console.log("getting the sender code")
          const data = e.message.match(/0x6ca7b806([a-fA-F\d]*)/)?.[1];
          if (!data) {
            return Promise.reject(new Error("Failed to parse revert data"));
          }
          const addr = ethers.utils.getAddress(`0x${data.slice(24, 64)}`);
          return Promise.resolve(addr);
         })
       
        console.log("Calculated sender address:", senderAddress)
        const to = "0x499002b05776F77392478dAE82F951e68f2dc44B" // TestCampaign contract
        const value = 0
        const data = "0x68656c6c6f" // "hello" encoded to utf-8 bytes
        
        const simpleAccount = SimpleAccount__factory.connect(
            senderAddress,
            provider,
        )
        console.log("connected to simple account factory")
        const callData = simpleAccount.interface.encodeFunctionData("execute", [to, value, data])
        
        console.log("Generated callData:", callData)

        const gasPrice = await provider.getGasPrice()
        console.log("Got gas price " + gasPrice)
        const userOperation = {
            sender: senderAddress,
            nonce: ethers.utils.hexlify(0),
            initCode,
            callData,
            callGasLimit: ethers.utils.hexlify(100_000), // hardcode it for now at a high value
            verificationGasLimit: ethers.utils.hexlify(400_000), // hardcode it for now at a high value
            preVerificationGas: ethers.utils.hexlify(500_000), // hardcode it for now at a high value
            maxFeePerGas: ethers.utils.hexlify(gasPrice),
            maxPriorityFeePerGas: ethers.utils.hexlify(gasPrice),
            paymasterAndData: "0x",
            signature: "0x"
        }

        console.log("About to get opHash")
        const userOpHash = await entryPoint.getUserOpHash(userOperation)
        console.log("Got " +userOpHash )
        const userOpHashArr =  ethers.utils.arrayify(userOpHash)
        // SIGN THE USER OPERATION
        const signature = await owner.signMessage(userOpHashArr)
        
        console.log("UserOperation signature:", signature)
        userOperation.signature = signature

        const pimlicoApiKey = "0b12121c-854f-435f-b85e-e5434240c8be"
const chain = "base-goerli" // find the list of supported chains at https://docs.pimlico.io/reference/bundler
const pimlicoEndpoint = `https://api.pimlico.io/v1/${chain}/rpc?apikey=${pimlicoApiKey}`
const pimlicoProvider = new ethers.providers.StaticJsonRpcProvider(pimlicoEndpoint)


        // SUBMIT THE USER OPERATION TO BE BUNDLED
const userOperationHash = await pimlicoProvider.send("eth_sendUserOperation", [
    userOperation,
    ENTRY_POINT_ADDRESS
])
 
console.log("UserOperation hash:", userOperationHash)
 

// // let's also wait for the userOperation to be included, by continually querying for the receipts
// console.log("Querying for receipts...")
// let receipt = null
// while (receipt === null) {
//     await new Promise((resolve) => setTimeout(resolve, 1000))
//     receipt = await pimlicoProvider.send("eth_getUserOperationReceipt", [
// 		userOperationHash,
// 	]);
//     console.log(receipt === null ? "Still waiting..." : receipt)
// }
 
// const txHash = receipt.receipt.transactionHash
 
// console.log(`UserOperation included: https://goerli.lineascan.build/tx/${txHash}`)
            }


    doIt()
}, [])


 return (
    <>
    <Head />
    <Container>
        <Box justifyContent="center">
            <Background />

            <p>hello aa</p>
        </Box>
    </Container>
    </>
    )
}
