import { Box, useBreakpointValue, useColorMode, useTheme } from '@chakra-ui/react'

const History = () => {
 const theme = useTheme()
 const { colorMode } = useColorMode()
 const formWidth = useBreakpointValue({ base: '90%', md: '600p' })

 return (
  <Box display="flex" justifyContent="center">
   <div
    style={{
     color: 'gray.400',
     fontFamily: 'Montserrat',
     padding: '36px',
     margin: '10px',
     height: 'fit',
     width: formWidth,
     backgroundColor: colorMode === 'dark' ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)',
     boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
     backdropFilter: 'blur(70px)',
     borderRadius: '40px',
     border: '1px solid rgba(179, 186, 209, 0.5)',
    }}>
    <h2
     style={{
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      fontFamily: 'sans-serif',
     }}>
     History
    </h2>
   </div>
  </Box>
 )
}

export default History
