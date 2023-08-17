import { Box } from '@chakra-ui/react'
import styled from '@emotion/styled'

const Background = () => {
 const Blob = styled(Box)`
  position: absolute;
  width: 352px;
  height: 352px;
  border-radius: 50%;
  mix-blend-mode: multiply;
  filter: blur(20px);
  opacity: 0.5;
  animation: blob 8s infinite;
 `

 const keyframes = `
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, 40px) scale(1.9);
    }
    66% {
      transform: translate(20px, 20px) scale(0.8);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
`

 return (
  <>
   <style>{keyframes}</style>
   <Box position="absolute" width="100%" maxWidth="lg">
    <Blob bottom="-85px" left="-100px" backgroundColor="purple.300" style={{ animationDelay: '0s' }}></Blob>
    <Blob bottom="-85px" right="-100px" backgroundColor="yellow.300" style={{ animationDelay: '4s' }}></Blob>
   </Box>
  </>
 )
}

export default Background
