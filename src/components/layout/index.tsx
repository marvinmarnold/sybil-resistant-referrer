import { Box, Container } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { Header } from './Header'
// import { Footer } from './Footer'
// import { NetworkStatus } from './NetworkStatus'

interface Props {
 children: ReactNode
}

export function Layout(props: Props) {
 return (
  <Box margin="0 auto" minH="100vh">
   <Header />

   <Container maxW="container.lg" style={{ overflowX: 'hidden' }}>
    {props.children}
   </Container>

   <Box position="fixed" bottom={2} right={2}>
    {/* <NetworkStatus /> */}
   </Box>
  </Box>
 )
}
