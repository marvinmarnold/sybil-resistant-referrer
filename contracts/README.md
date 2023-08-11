# Quickstart
1. Install pre-requisites: node and foundry installed
2. Install dependencies: `pnpm i`
3. Deploy campaign factory, campaign token (simulating a NFT), and reward token (simulating USDC).
```
# Deploy factory contract
forge create src/CampaignFactory.sol:CampaignFactory \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq

-> Deployed to: 0xb2485BDCc9be2A30F7De9c5f81dC500f2985e555

# Deploy campaign token as ERC-20
forge create src/MockERC20Token.sol:MockToken20 \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    --constructor-args "CampaignToken"

-> Deployed to: 0x811D7F863FF5Ee56759d01EAe604f1E0F23FD671

# Deploy reward token as ERC-20 
forge create src/MockERC20Token.sol:MockToken20 \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    --constructor-args "RewardToken"

-> Deployed to: 0x396A252Ba486ecE8f2f4a4DA16Cbbd36f4f1d17F
```

4. Create a new campaign
```
cast send \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0xb2485BDCc9be2A30F7De9c5f81dC500f2985e555 "addCampaign(address,address,uint256,uint256,uint256,uint256)" \
    0xe9dd310dCacf58ee208a84Edf823Ad7A0c6D9B0f 0x007272D5F8600A7f6e6b6AfB67bc04c52b383624 3 100 200 1

-> transactionHash         0xc44da2b0ea9ba14c05b7aaceccd8b3a4fd576f4a3e7d628fce1a9ca0bfaf8e82
```

5. Determine the new campaign address. There are many ways to do this. I pulled up the transaction on [OP Goerli scan](https://goerli-optimism.etherscan.io/tx/0xc44da2b0ea9ba14c05b7aaceccd8b3a4fd576f4a3e7d628fce1a9ca0bfaf8e82#eventlog).
We can also check out campaigns created on The Graph's [OP Goerli playground subgraph](https://thegraph.com/studio/subgraph/refer-optimism-goerli/playground)

 The created contract in this case is `0x24ec59d4b8d295fe22228cf87416a7e34eec9dc2`.

6. Approve contract to spend up to a campaign limit
```
cast send \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x396A252Ba486ecE8f2f4a4DA16Cbbd36f4f1d17F "approve(address,uint256)" \
    0x24ec59d4b8d295fe22228cf87416a7e34eec9dc2 1000000000000000000000000000000
```

7. Register as referrer (0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE)
```
cast send \
    --private-key 0xREFERRER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x24ec59d4b8d295fe22228cf87416a7e34eec9dc2 "addReferrer(address,uint256,uint256,uint256[8])" \
    0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE 18989627463441882781187710708155130770886416034312277086349585890036109010582 18422803259246508922691071586734354001208372718627092815696322179744084458042 "[17192478543446874043834066466465448338404854700713195691987632034681344423485,17780063256866013600728194000792532517191122266230807369921032814895250301907,16772734351233397487761731073527626767027121057253619657309926772123162088049,11472537862669826663590713251996732998149964835478752161044642915074880447063,18612139412153099857171036756939226599961128219201026712472403426786386904346,17855721734339821581674594147806831926561167113212414554468281828857136426305,1694392938171240116948660117275822880134466545408202839849698568568866106253,10082090730963713555674199880905537398245287853500865418581064714899829109298]"
```

8. (Optional) Step 7 will fail unless the referree has enough campaign tokens. Transfer to them if necessary for success.
```
cast send \
    --private-key 0xMANAGER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x811D7F863FF5Ee56759d01EAe604f1E0F23FD671 "transfer(address,uint256)" \
    0x414afCBd5C0Cf1babe79eF1C5d34C77Ba2F991ba 1000
```

9. Claim as referree
```
 cast send \
    --private-key 0xREFERREE \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x24ec59d4b8d295fe22228cf87416a7e34eec9dc2 "acceptReferral(address,address,uint256,uint256,uint256[8])" \
    0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE 0x414afCBd5C0Cf1babe79eF1C5d34C77Ba2F991ba 18989627463441882781187710708155130770886416034312277086349585890036109010582 18422803259246508922691071586734354001208372718627092815696322179744084458042 "[17192478543446874043834066466465448338404854700713195691987632034681344423485,17780063256866013600728194000792532517191122266230807369921032814895250301907,16772734351233397487761731073527626767027121057253619657309926772123162088049,11472537862669826663590713251996732998149964835478752161044642915074880447063,18612139412153099857171036756939226599961128219201026712472403426786386904346,17855721734339821581674594147806831926561167113212414554468281828857136426305,1694392938171240116948660117275822880134466545408202839849698568568866106253,10082090730963713555674199880905537398245287853500865418581064714899829109298]"
```
