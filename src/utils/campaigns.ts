interface campaignType {
 contractAddress: `0x${string}`
 campaignId: string
 campaignName: string
}

const campaigns: campaignType[] = [
 {
  contractAddress: '0x...',
  campaignId: '1',
  campaignName: 'Campaign 1',
  // add other details here
 },
 {
  contractAddress: '0x...',
  campaignId: '2',
  campaignName: 'Campaign 2',
  // add other details here
 },
 // add more campaigns here
]

export default campaigns
