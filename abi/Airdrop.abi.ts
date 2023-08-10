export default [
 {
  inputs: [
   {
    internalType: 'contract IWorldIDGroups',
    name: '_worldIdRouter',
    type: 'address',
   },
   {
    internalType: 'uint256',
    name: '_groupId',
    type: 'uint256',
   },
   {
    internalType: 'string',
    name: '_actionId',
    type: 'string',
   },
   {
    internalType: 'contract ERC20',
    name: '_token',
    type: 'address',
   },
   {
    internalType: 'address',
    name: '_holder',
    type: 'address',
   },
   {
    internalType: 'uint256',
    name: '_airdropAmount',
    type: 'uint256',
   },
  ],
  stateMutability: 'nonpayable',
  type: 'constructor',
 },
 {
  inputs: [],
  name: 'InvalidNullifier',
  type: 'error',
 },
 {
  inputs: [],
  name: 'Unauthorized',
  type: 'error',
 },
 {
  anonymous: false,
  inputs: [
   {
    indexed: false,
    internalType: 'address',
    name: 'receiver',
    type: 'address',
   },
  ],
  name: 'AirdropClaimed',
  type: 'event',
 },
 {
  anonymous: false,
  inputs: [
   {
    indexed: false,
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256',
   },
  ],
  name: 'AmountUpdated',
  type: 'event',
 },
 {
  inputs: [],
  name: 'airdropAmount',
  outputs: [
   {
    internalType: 'uint256',
    name: '',
    type: 'uint256',
   },
  ],
  stateMutability: 'view',
  type: 'function',
 },
 {
  inputs: [
   {
    internalType: 'address',
    name: 'receiver',
    type: 'address',
   },
   {
    internalType: 'uint256',
    name: 'root',
    type: 'uint256',
   },
   {
    internalType: 'uint256',
    name: 'nullifierHash',
    type: 'uint256',
   },
   {
    internalType: 'uint256[8]',
    name: 'proof',
    type: 'uint256[8]',
   },
  ],
  name: 'claim',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
 },
 {
  inputs: [],
  name: 'holder',
  outputs: [
   {
    internalType: 'address',
    name: '',
    type: 'address',
   },
  ],
  stateMutability: 'view',
  type: 'function',
 },
 {
  inputs: [],
  name: 'manager',
  outputs: [
   {
    internalType: 'address',
    name: '',
    type: 'address',
   },
  ],
  stateMutability: 'view',
  type: 'function',
 },
 {
  inputs: [],
  name: 'token',
  outputs: [
   {
    internalType: 'contract ERC20',
    name: '',
    type: 'address',
   },
  ],
  stateMutability: 'view',
  type: 'function',
 },
 {
  inputs: [
   {
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256',
   },
  ],
  name: 'updateAmount',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function',
 },
] as const
