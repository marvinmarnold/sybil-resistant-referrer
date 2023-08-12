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
}

export interface networkType {
 [networkId: number]: NetworkConfig
}

export const networks: networkType = {
 5: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_ETH_GOERLI as `0x${string}`,
  factorySubgraph: '',
 },
 420: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_OP_GOERLI as `0x${string}`,
  factorySubgraph: 'https://api.studio.thegraph.com/query/18941/refer-optimism-goerli/version/latest',
 },
 84531: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_BASE_GOERLI as `0x${string}`,
  factorySubgraph: '',
 },
 919: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_ZORA_TESTNET as `0x${string}`,
  factorySubgraph: '',
 },
 999: {
  factoryContract: process.env.NEXT_PUBLIC_CAMPAIGN_FACTORY_ADDR_MODE_TESTNET as `0x${string}`,
  factorySubgraph: '',
 },
}
