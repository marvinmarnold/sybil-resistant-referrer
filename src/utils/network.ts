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
 5: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_ETH_GOERLI as `0x${string}`,
  factorySubgraph: '',
  worldId: '0x11cA3127182f7583EfC416a8771BD4d11Fae4334',
 },
 420: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_OP_GOERLI as `0x${string}`,
  factorySubgraph: 'https://api.studio.thegraph.com/query/18941/refer-op-goerli/version/latest',
  worldId: '0x515f06B36E6D3b707eAecBdeD18d8B384944c87f',
 },
 84531: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_BASE_GOERLI as `0x${string}`,
  factorySubgraph: '',
  worldId: '0x78ec127a3716d447f4575e9c834d452e397ee9e1',
 },
 919: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_ZORA_TESTNET as `0x${string}`,
  factorySubgraph: '',
  worldId: '0x',
 },
 999: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_MODE_TESTNET as `0x${string}`,
  factorySubgraph: '',
  worldId: '0x',
 },
}
