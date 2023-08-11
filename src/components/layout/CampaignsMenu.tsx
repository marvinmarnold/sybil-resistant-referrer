import { Box, Menu, MenuButton, MenuList, MenuItem, Button, useTheme } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'

const CampaignsMenu = ({ campaigns, selectedCampaign, setSelectedCampaign }: any) => {
 const theme = useTheme()

 return (
  <Box margin={10}>
   <Menu>
    {({ isOpen }) => (
     <>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} borderRadius="md">
       {selectedCampaign?.id ? selectedCampaign?.param0 : 'Select Campaign'}
      </MenuButton>
      <MenuList border="none" boxShadow="sm" borderRadius="md" mt={1} zIndex={1}>
       {campaigns.map((campaign: any) => (
        <MenuItem key={campaign.id} onClick={() => setSelectedCampaign(campaign)}>
         {campaign.param0}
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
