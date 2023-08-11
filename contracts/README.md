# Quickstart
1. Install pre-requisites: node and foundry installed
2. Install dependencies: `pnpm i`
3. Deploy campaign factory, campaign token (simulating a NFT), and reward token (simulating USDC).
```
# Deploy factory contract
forge create src/CampaignFactory.sol:CampaignFactory \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq

-> Deployed to: 0xBfb8395FC0FE59f46A7557275782268ce0aE8146

# Deploy campaign token as NFT (ERC-721)
forge create src/MockERC721Token.sol:MockToken721 \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq

-> Deployed to: 0xf0526618D3919B5770679CA1671f77C912A1a905

# Deploy reward token as ERC-20 
forge create src/MockERC20Token.sol:MockToken20 \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq

-> Deployed to: 0x007272D5F8600A7f6e6b6AfB67bc04c52b383624
```

4. Create a new campaign
```
cast send \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0xBfb8395FC0FE59f46A7557275782268ce0aE8146 "addCampaign(address,address,uint256,uint256,uint256,uint256)" \
    0xf0526618D3919B5770679CA1671f77C912A1a905 0x007272D5F8600A7f6e6b6AfB67bc04c52b383624 3 100 200 1

-> transactionHash         0x2a72ea1e95880b814358f3c0af4c69f89e03d99b793a126269f1bb371309677a
```

5. Determine the new campaign address. There are many ways to do this. I pulled up the transaction on [OP Goerli scan](https://goerli-optimism.etherscan.io/tx/0x2a72ea1e95880b814358f3c0af4c69f89e03d99b793a126269f1bb371309677a#eventlog).
We can also check out campaigns created on The Graph's [OP Goerli playground subgraph](https://thegraph.com/studio/subgraph/refer-optimism-goerli/playground)

 The created contract in this case is `0x39e7a81f51355b8deb4a18f00fcf4ac9ec8b6b5a`.


6. Register as referrer (0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE)
```
cast send \
    --private-key 0xREFERRER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x39e7a81f51355b8deb4a18f00fcf4ac9ec8b6b5a "addReferrer()"
```

7. Claim as referree
```
cast send \
    --private-key 0xREFERREE \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x39e7a81f51355b8deb4a18f00fcf4ac9ec8b6b5a "acceptReferral(address)" \
    0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE
```

8. (Optional) Step 7 will fail unless the referree has enough campaign tokens. Transfer to them if necessary for success.
```
cast send \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0xf0526618D3919B5770679CA1671f77C912A1a905 "safeMint(address,uint256)" \
    0x414afCBd5C0Cf1babe79eF1C5d34C77Ba2F991ba 1
```