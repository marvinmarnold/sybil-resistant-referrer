import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { gql, request } from 'graphql-request'
import { useEffect, useState } from 'react'
import { CampaignType } from 'types/index'
import { networks } from 'utils/network'
import { v4 as uuidv4 } from 'uuid'
import { useNetwork } from 'wagmi'

// param0 is the contract address
const query = gql`
 {
  campaignCreateds {
   id
   owner
   campaign
   actionId
  }
 }
`

const CampaignsMenu = ({ selectedCampaign, setSelectedCampaign, isActive }: any) => {
 const network = useNetwork()
 const [currentEndpoint, setCurrentEndpoint] = useState('')
 const [campaigns, setCampaigns] = useState<CampaignType[]>([])

 const chainId: number = network.chain?.id ?? 5

 useEffect(() => {
  const endpoint = networks[chainId]?.factorySubgraph
  setCurrentEndpoint(endpoint)
 }, [chainId])

 useEffect(() => {
  ;(async () => {
   try {
    if (currentEndpoint.length > 0) {
     const resp: any = await request(currentEndpoint, query)
     console.log('🚀 ~ file: CampaignsMenu.tsx:39 ~ ; ~ resp?.campaignCreateds:', resp?.campaignCreateds)
     setCampaigns(resp?.campaignCreateds)
    }
   } catch (error) {
    console.error(error)
   }
  })()
 }, [currentEndpoint])

 return (
  <Box margin={10} textAlign="center">
   <Menu>
    <MenuButton
     as={Button}
     backgroundColor="purple.300"
     variant="gradient"
     border={'0.5px solid #312E2A'}
     boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
     py={2}
     px={28}
     fontFamily="Dm Sans"
     color="white"
     rightIcon={<ChevronDownIcon />}
     borderRadius="md"
     disabled={!isActive}>
     {selectedCampaign?.id ? selectedCampaign?.actionId : 'Select Campaign'}
    </MenuButton>
    <MenuList boxShadow="md" border={'2px solid #B794F4'} w="380px" borderRadius="md" mt={1} zIndex={1}>
     {campaigns.map((campaign: any) => (
      <MenuItem key={uuidv4()} fontFamily="Dm Sans" onClick={() => setSelectedCampaign(campaign)}>
       Campaign {campaign.actionId}
      </MenuItem>
     ))}
    </MenuList>
   </Menu>
  </Box>
 )
}

export default CampaignsMenu
