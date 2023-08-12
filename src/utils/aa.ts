import {
 SimpleAccountFactory__factory,
 EntryPoint__factory,
 SimpleAccount__factory,
 EntryPoint,
 UserOperationStruct,
} from '@account-abstraction/contracts'
import { ethers, BigNumber, Wallet } from 'ethers'
// import { ERC20, ERC20__factory } from "@pimlico/erc20-paymaster"

// GENERATE THE INITCODE
const SIMPLE_ACCOUNT_FACTORY_ADDRESS = '0x9406Cc6185a346906296840746125a0E44976454'
const lineaProvider = new ethers.providers.StaticJsonRpcProvider('https://rpc.goerli.linea.build/')
const owner = Wallet.createRandom()
console.log('Generated wallet with private key:', owner.privateKey)

const simpleAccountFactory = SimpleAccountFactory__factory.connect(SIMPLE_ACCOUNT_FACTORY_ADDRESS, lineaProvider)
const initCode = ethers.utils.hexConcat([
 SIMPLE_ACCOUNT_FACTORY_ADDRESS,
 simpleAccountFactory.interface.encodeFunctionData('createAccount', [owner.address, 0]),
])

console.log('Generated initCode:', initCode)
