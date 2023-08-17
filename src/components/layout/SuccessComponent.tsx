import { Box, Button, Heading, Icon, useToast } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FiCopy, FiExternalLink } from 'react-icons/fi'

const SuccessComponent = ({ link, data, message = '', subtitle = '' }: { link: string | null; data: any; message: string; subtitle: string }) => {
 const toast = useToast()

 const successCopy = () => {
  toast({
   title: 'Link Copied',
   status: 'success',
   duration: 9000,
   isClosable: true,
  })
 }

 return (
  <Box margin={10} top="64px" textAlign="center">
   <Heading as="h3" size="lg" textAlign="center" margin={5}>
    {message}
   </Heading>
   {link ? (
    <Box>
     <Box margin={5}>
      <a href={link}>
       <Heading as="h4" size="md">
        {subtitle}
       </Heading>
      </a>
     </Box>
     <Box>
      <CopyToClipboard text={link} onCopy={successCopy}>
       <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
        <Button
         backgroundColor="purple.300"
         variant="gradient"
         borderRadius="10px"
         border={'0.5px solid #312E2A'}
         boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
         py={2}
         px={12}
         fontFamily="sans-serif"
         color="white"
         type="submit">
         <Icon as={FiCopy} margin="0 5px" /> Copy to clipboard
        </Button>
       </motion.div>
      </CopyToClipboard>
     </Box>
    </Box>
   ) : (
    <Box margin={5}>
     <Heading as="h4" size="md">
      {subtitle}
     </Heading>
    </Box>
   )}

   <Box margin="5">
    <Button variant="link">
     {/* <a href={`https://etherscan.io/tx/${data?.hash}`}> */}
     <a target="_blank" href={`https://goerli-optimism.etherscan.io/tx/${data?.hash}#eventlog`}>
      Check txn
      <Icon as={FiExternalLink} />
     </a>
    </Button>
   </Box>
   {/* DEBUG ONLY */}
   {/* {(isPrepareError || isError) && <div>Error: {(prepareError || error)?.message}</div>} */}
  </Box>
 )
}

export default SuccessComponent
