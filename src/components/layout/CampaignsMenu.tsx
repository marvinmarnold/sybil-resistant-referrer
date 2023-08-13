import { useNetwork } from 'wagmi'
import { Box, Menu, MenuButton, MenuList, MenuItem, Button, useTheme } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { request, gql } from 'graphql-request'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { CampaignType } from 'types/index'
import { networks } from 'utils/network'

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
  const endpoint = networks[chainId].factorySubgraph
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
    {({ isOpen }) => (
     <>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} borderRadius="md" disabled={!isActive}>
       {selectedCampaign?.id ? selectedCampaign?.actionId : 'Select Campaign'}
      </MenuButton>
      <MenuList border="none" boxShadow="sm" borderRadius="md" mt={1} zIndex={1}>
       {campaigns.map((campaign: any, idx: number) => (
        <MenuItem key={uuidv4()} onClick={() => setSelectedCampaign(campaign)}>
         Campaign #{idx} - {campaign.actionId}
        </MenuItem>
       ))}
      </MenuList>
     </>
    )}
   </Menu>
  </Box>
 )
}

export default CampaignsMenu
