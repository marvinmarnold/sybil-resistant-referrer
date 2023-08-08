/* eslint-disable */
import { useEffect, useState } from 'react'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { Button, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import campaigns from 'utils/campaigns'
import { RewardAbi, MintAbi } from 'abis'

function ClaimReward() {
 const router = useRouter()
 const [ref, setRef] = useState(null)
 const [receipt, setReceipt] = useState(null)
 const [campaignId, setCampaignId] = useState(null)
 const [campaign, setCampaign] = useState(null)

 function getCampaignById(campaignId: string | null) {
  if (campaignId === null) return
  return campaigns.find((campaign) => campaign.campaignId === campaignId)
 }

 useEffect(() => {
  const currentCampaign = getCampaignById(campaignId)
  if (currentCampaign) {
   setCampaign(currentCampaign)
  }
 }, [campaignId])

 useEffect(() => {
  const { ref: refParam, campaignId: campaignIdParam } = router.query

  if (refParam) {
   setRef(refParam)
  }

  if (campaignIdParam) {
   setCampaignId(campaignIdParam)
  }
 }, [router.query])

 const prepareMint = usePrepareContractWrite({
  address: campaign?.contractAddress,
  abi: MintAbi,
  functionName: 'mint',
 })

 const mintNFT = useContractWrite(prepareMint.config)
 const waitForMintTransaction = useWaitForTransaction({ hash: mintNFT.data?.hash })

 const handleMintNFT = () => {
  mintNFT.write?.()
 }

 useEffect(() => {
  const prevReceipt = localStorage.getItem('receipt')
  if (prevReceipt === null) return
  setReceipt(prevReceipt)
 }, [])

 useEffect(() => {
  if (waitForMintTransaction.isSuccess) {
   localStorage.setItem('receipt', mintNFT.data?.hash)
   setReceipt(mintNFT.data?.hash)
  }
 }, [waitForMintTransaction.isSuccess])

 const prepareReward = usePrepareContractWrite({
  address: campaign?.contractAddress,
  abi: RewardAbi,
  functionName: 'claimReward',
  //   params: [receipt, ref],
 })

 const claimReward = useContractWrite(prepareReward.config)
 const waitForRewardTransaction = useWaitForTransaction({ hash: claimReward.data?.hash })

 const handleClaimReward = () => {
  claimReward.write?.()
 }

 return (
  <div>
   <Heading as="h3" fontSize="xl" my={4}>
    Claim Reward
   </Heading>
   {!receipt ? (
    <Button width="full" disabled={waitForMintTransaction.isLoading || mintNFT.isLoading || !mintNFT.write} mt={4} onClick={handleMintNFT}>
     {waitForMintTransaction.isLoading ? 'Minting NFT...' : mintNFT.isLoading ? 'Check your wallet' : 'Mint NFT'}
    </Button>
   ) : (
    <Button
     width="full"
     disabled={waitForRewardTransaction.isLoading || claimReward.isLoading || !claimReward.write}
     mt={4}
     onClick={handleClaimReward}>
     {waitForRewardTransaction.isLoading ? 'Claiming reward...' : claimReward.isLoading ? 'Check your wallet' : 'Claim Reward'}
    </Button>
   )}
   {waitForRewardTransaction.isSuccess && (
    <div>
     <Text mt={2} fontSize="lg">
      Successfully claimed reward!
     </Text>
    </div>
   )}
   {waitForRewardTransaction.isError && (
    <div>
     <Text mt={2} color="red" fontSize="lg">
      Error claiming reward
     </Text>
     <Text color="red" fontSize="lg" fontWeight="bold">
      {waitForRewardTransaction.error?.message}
     </Text>
    </div>
   )}
  </div>
 )
}

export default ClaimReward
