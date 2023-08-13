export function GetNetworkColor(chain?: number) {
 if (chain === 5) return 'green' // goerli ethereum
 if (chain === 420) return 'red' // op
 if (chain === 84531) return 'blue' // base
 if (chain === 919) return 'yellow' // mode
 if (chain === 999) return 'purple' // zora

 return 'grey'
}

interface NetworkConfig {
 factoryContract: `0x${string}`
 factorySubgraph: string
 worldId: `0x${string}`
}

export interface networkType {
 [networkId: number]: NetworkConfig
}

export const networks: networkType = {
 420: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_OP_GOERLI as `0x${string}`,
  factorySubgraph: 'https://api.studio.thegraph.com/query/51076/sybil-resistant/version/latest',
  worldId: '0x515f06B36E6D3b707eAecBdeD18d8B384944c87f',
 },
 84531: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_BASE_GOERLI as `0x${string}`,
  factorySubgraph: 'https://api.studio.thegraph.com/query/18941/refer-base-testnet/version/latest',
  worldId: '0xCe7d9aE54199a4f847DfD168d929a286D72BE953',
 },
 919: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_ZORA_TESTNET as `0x${string}`,
  factorySubgraph: '',
  worldId: '0x',
 },
 999: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_MODE_TESTNET as `0x${string}`,
  factorySubgraph: '0x5816c73FE88a53b1286d6761F470865bA871f968',
  worldId: '0x',
 },
}
