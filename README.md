# 🤝 Refer

Sybil resistance referral protocol for onchain campaigns

## Deployed Factory Contracts

These contracts are used to create new campaigns, native for each chain. 

| Chain Name | Mainnet | Testnet |
|------------|---------|---------|
| Ethereum   | -      | [0x316468A21476b648864c282d8ac4869f4Ce04d38](https://goerli.etherscan.io/address/0x316468A21476b648864c282d8ac4869f4Ce04d38)       |
| Optimism   | [0x5b5097ebb5b0caa20968e262b386774d7582ddb6](https://optimistic.etherscan.io/address/0x5b5097ebb5b0caa20968e262b386774d7582ddb6) | [0x9b55bf8f871155f94f973252736c7acc4de76424](https://goerli-optimism.etherscan.io/address/0x9b55bf8f871155f94f973252736c7acc4de76424) |
| Base       | [0xD6aD1B7daaeeA3Ad95e3AeF65a4259dBa7b6856A](https://base.blockscout.com/address/0xD6aD1B7daaeeA3Ad95e3AeF65a4259dBa7b6856A) | [0xCe7d9aE54199a4f847DfD168d929a286D72BE953](https://base-goerli.blockscout.com/address/0xCe7d9aE54199a4f847DfD168d929a286D72BE953) |
| Zora       | [0x32888423d4B8Aa9a555C9DBAd82a898646B69925](https://explorer.zora.energy/address/0x32888423d4B8Aa9a555C9DBAd82a898646B69925) | [0xCe7d9aE54199a4f847DfD168d929a286D72BE953](https://testnet.explorer.zora.energy/address/0xCe7d9aE54199a4f847DfD168d929a286D72BE953) |
| Mode       | - | [0x5816c73FE88a53b1286d6761F470865bA871f968](https://sepolia.explorer.mode.network/address/0x5816c73FE88a53b1286d6761F470865bA871f968) |


## Deployed Subgraphs

These subgraphs track the new campaigns created.

| Chain Name | Mainnet | Testnet |
|------------|---------|---------|
| Optimism   | [0x5b5097ebb5b0caa20968e262b386774d7582ddb6](https://api.studio.thegraph.com/query/18941/refer-optimism-mainnet/version/latest) | [0x9b55bf8f871155f94f973252736c7acc4de76424](https://api.studio.thegraph.com/query/18941/refer-op-goerli/version/latest) |
| Base       | [0xD6aD1B7daaeeA3Ad95e3AeF65a4259dBa7b6856A](https://api.studio.thegraph.com/query/18941/refer-base-mainnet/version/latest) | [0xCe7d9aE54199a4f847DfD168d929a286D72BE953](https://api.studio.thegraph.com/query/18941/refer-base-testnet/version/latest) |

## 

## Develop

```
cp .env.example .env.local
pnpm install
pnpm dev
```

- Then open the simulator: https://simulator.worldcoin.org/
- Verification info currently logged to browser console once modal closed.

## Official contract addresses

[See them on omo](https://www.omo.so/sybil-resistant)