import { Text, Button, Box } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'
import styled from '@emotion/styled'

import Background from 'components/Background'

const Container = styled(Box)`
 background-color: gray.50;
 height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 0 16px;
`

export default function Home() {
 return (
  <>
   <Head />
   <Container>
    <Box justifyContent="center">
     <Background />

     <Box>
      <HeadingComponent as="h2">Create a campaign</HeadingComponent>
      <Text></Text>
      <Button py={4}>
       <LinkComponent href="CreateCampaign">Create campaign</LinkComponent>
      </Button>
     </Box>
     <Box>
      <HeadingComponent as="h2">Create referral link</HeadingComponent>
      <Button py={4}>
       <LinkComponent href="createlink">Create ref link</LinkComponent>
      </Button>
     </Box>
    </Box>
   </Container>
  </>
 )
}
