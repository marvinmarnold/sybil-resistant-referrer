import { Box, Text, Flex, Heading } from '@chakra-ui/react'
import styled from '@emotion/styled'

const HomeBackground = () => {
 const Blob = styled(Box)`
  position: absolute;

  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(25px);
  opacity: 0.5;
  animation: blob 8s infinite;
 `
 const keyframes = `
  @keyframes blob {
    0% {
      transform:  scale(1);
    }
    50% {
      transform:  scale(0.8);
    }
   
    100% {
      transform:  scale(1);
    }
  }
`

 return (
  <>
   <style>{keyframes}</style>
   <Box position="absolute" width="100%" maxWidth="lg">
    <Blob
     bottom="80px"
     left="-650px"
     backgroundColor="blue.300"
     style={{ width: '450px', height: '450px', animationDelay: '0s', zIndex: '-1' }}></Blob>
    <Blob
     bottom="-200px"
     left="330px"
     backgroundColor="yellow.300"
     style={{ width: '750px', height: '750px', animationDelay: '4s', zIndex: '-1' }}></Blob>
   </Box>
  </>
 )
}

export default HomeBackground
