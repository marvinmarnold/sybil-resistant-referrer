# Quickstart

1. Install pre-requisites: node and foundry installed
2. Install dependencies: `pnpm i`
3. Deploy campaign factory, campaign token (simulating a NFT), and reward token (simulating USDC).

```
# Deploy factory contract
forge create src/CampaignFactory.sol:CampaignFactory \
    --private-key 0xOWNER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq

-> Deployed to: 0xf2761B5e177261fb3Ead3b7B992a11Fce8592898

# Deploy campaign token as ERC-20
forge create src/MockERC20Token.sol:MockToken20 \
    --private-key 0xOWNER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    --constructor-args "CampaignToken"

-> Deployed to: 0x352801EcDE99171F346de6033094e47D6b4AcB33

# Deploy reward token as ERC-20
forge create src/MockERC20Token.sol:MockToken20 \
    --private-key 0xOWNER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    --constructor-args "RewardToken"

-> Deployed to: 0x1d4396c22Ea22c371742A3A9d61e8a3E0AcCCFD0
```

4. Create a new campaign

```
cast send \
    --private-key 0xOWNER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0xf2761B5e177261fb3Ead3b7B992a11Fce8592898 "addCampaign(address,address,uint256,uint256,uint256,uint256,string,uint256)" \
    0x352801EcDE99171F346de6033094e47D6b4AcB33 0x1d4396c22Ea22c371742A3A9d61e8a3E0AcCCFD0 3 100 200 1 '1002' 1002

-> transactionHash         0x55059d76df011122a8397cac776eac2753ba8f7777528e1e9def8de3413c4ea3
```

5. Determine the new campaign address. There are many ways to do this. I pulled up the transaction on [OP Goerli scan](https://goerli-optimism.etherscan.io/tx/0x55059d76df011122a8397cac776eac2753ba8f7777528e1e9def8de3413c4ea3#eventlog).
   We can also check out campaigns created on The Graph's [OP Goerli playground subgraph](https://thegraph.com/studio/subgraph/refer-optimism-goerli/playground)

The created contract in this case is `0x694e95ffa7819a7c67a14dfda6cd3a150e9453ad`.

6. Approve TOKEN contract to spend up to a campaign limit

```
cast send \
    --private-key 0xOWNER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x1d4396c22Ea22c371742A3A9d61e8a3E0AcCCFD0 "approve(address,uint256)" \
    0x694e95ffa7819a7c67a14dfda6cd3a150e9453ad 1000000000000000000000000000000
```

7. Register as referrer (0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE)

```
cast send \
    --private-key 0xREFERER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x694e95ffa7819a7c67a14dfda6cd3a150e9453ad "addReferrer(address,uint256,uint256,uint256[8])" \
    0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE 21033963174941457782922200444364895243291178687747582951200320446857594710317 3027698692353572665061506340302137697821860165714252971857424084583371648181 "[2348695132075412218627114319874779021907682653771035164384284687372292139852,5074056723417751931745282128039648534373264082162127432921163421707133719824,12506249992413520558521468953190695927231402160813575617923961223241477021343,1133779710778933394533624837773298317160366655418341170203780957697886312100,11021316290023242382104163864441589180849117151017674589820074001135975144399,8189112571150707071181749463994940394240659285865004994484207787416020295688,14812795260316958268387172528373197680751915472690778296490046806493848153799,873347684321642134107973785227004429002397923700611927240542740564537129924]"
```

8. (Optional) Step 7 will fail unless the referree has enough campaign tokens. Transfer to them if necessary for success.

```
cast send \
    --private-key 0xOWNER \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x352801EcDE99171F346de6033094e47D6b4AcB33 "transfer(address,uint256)" \
    0x414afCBd5C0Cf1babe79eF1C5d34C77Ba2F991ba 1000
```

9. Claim as referree (0x414afCBd5C0Cf1babe79eF1C5d34C77Ba2F991ba)

```
 cast send \
    --private-key 0xREFERREE \
    --rpc-url https://opt-goerli.g.alchemy.com/v2/7idjAuh5bHGIoE95AvxwPaFZblFUgyIq \
    0x694e95ffa7819a7c67a14dfda6cd3a150e9453ad "acceptReferral(address,address,uint256,uint256,uint256[8])" \
    0x1635b64e3f897C4E3E5bA9972ea4618ee682dADE 0x414afCBd5C0Cf1babe79eF1C5d34C77Ba2F991ba 21033963174941457782922200444364895243291178687747582951200320446857594710317 13643106306322025725536513627976501586555005912624623792592256571866799015193 "[17282972984557761698260150263034839747942311293248776802203576825662883521098,20627476458334297370676645432766309395813851435944097763030049099705561211718,10314433193786584695418531670771991943649400267239398652830579133991701675171,20768683511810491232326427424826242245972929722548394435359934032292910361177,10352506482455620533253255820118115742758348591453758469974842591797733042285,1008945925331096252999973915358777387665432520681366881637560170394082972223,20373861530229859487525335076797714479656722531019047491973487878603501947919,2534191008195528074094992104065243082786653779334709650894665489993071338834]"
```
