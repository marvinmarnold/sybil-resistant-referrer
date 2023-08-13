import { Text, Box, Heading, Flex } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { LinkComponent } from 'components/layout/LinkComponent'
import styled from '@emotion/styled'
import HomeBackground from 'components/HomeBackground'
import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { staggerContainer } from 'utils/variants'
const Container = styled(Box)`
 background-color: gray.50;
 height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 0 16px;
`

export default function Home() {
 const targetRef = useRef(null)

 const { scrollYProgress } = useScroll({
  target: targetRef,
  offset: ['end end', 'end start'],
 })

 const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
   opacity: 1,
   y: 0,
   transition: {
    ease: 'easeInOut',
    duration: 1.3,
   },
  },
 }

 const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
 return (
  <>
   <Head />
   <div
    style={{
     width: '1420px',
     borderTop: '2px solid black',
     position: 'absolute',
     left: '50px',
     top: '56px',
     height: '350px',
     borderRight: '2px solid black',
    }}>
    <div
     style={{
      width: '100px',
      height: '100px',
      borderRight: '2px solid black',
      borderTop: '2px solid black',
      borderRadius: '0px 100px 0px 0px',
      position: 'absolute',
      right: '0px',
     }}></div>
   </div>
   <motion.div variants={staggerContainer} initial="initial" animate="animate">
    <Container style={{ overflowX: 'hidden' }}>
     <HomeBackground />

     <motion.section style={{ opacity }} ref={targetRef}>
      <Flex w="100%" h="100vh">
       <Heading as="h1" fontSize="75px" w="650px" mt="130px" position="absolute" left="150px" fontFamily="Dm Sans">
        Sybil Resistant <span style={{ color: '#A45EE5' }}>Referrer</span>
       </Heading>
       <h3
        style={{ fontSize: '22px', width: '650px', marginTop: '300px', position: 'absolute', left: '150px', fontFamily: 'Dm Sans', color: 'gray' }}>
        Create onchain referral campaigns that can&apos;t be gamed by bots
       </h3>

       {/* <Button
        backgroundColor="purple.300"
        variant="gradient"
        borderRadius="0px"
        border={'0.5px solid #312E2A'}
        boxShadow={'2.8px 3.8px 0px 0px #312E2A'}
        py={2}
        px={28}
        fontFamily="Dm Sans"
        color="white"
        style={{ marginTop: '380px', position: 'absolute', left: '150px' }}>
        Get Started
       </Button> */}
      </Flex>

      <Flex w="1420px" borderTop="2px solid black" position="absolute" left="50px" top="560px" h="150px" justifyContent="center">
       <Flex
        w="30%"
        h="150px"
        borderTop="2px solid black"
        borderRight="2px solid black"
        borderTopRightRadius="50px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <LinkComponent href="/CreateCampaign">
         <h2
          style={{
           fontFamily: 'Dm Sans',
           fontSize: '24px',
           fontWeight: '600',
           borderBottom: '2px solid black',
           display: 'flex',
           justifyContent: 'center',
          }}>
          Create campaign-&gt;{' '}
         </h2>
        </LinkComponent>
        <p style={{ fontFamily: 'Dm Sans', display: 'flex', justifyContent: 'center', margin: '10px', color: 'gray' }}>
         If you need to grow the adoption of your protocol, use Refer to onboard and reward new users.
        </p>
       </Flex>
       <Flex
        w="30%"
        h="150px"
        borderLeft="2px solid black"
        borderTop="2px solid black"
        borderRight="2px solid black"
        borderTopLeftRadius="50px"
        borderTopRightRadius="50px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <LinkComponent href="/createlink">
         <h2
          style={{
           fontFamily: 'Dm Sans',
           fontSize: '24px',
           fontWeight: '600',
           borderBottom: '2px solid black',
           display: 'flex',
           justifyContent: 'center',
          }}>
          Generate Referrals-&gt;
         </h2>
        </LinkComponent>
        <p style={{ fontFamily: 'Dm Sans', display: 'flex', justifyContent: 'center', margin: '10px', color: 'gray' }}>
         For users of protocols that want to earn rewards by spreading the word.
        </p>
       </Flex>
       {/* <Flex
        w="30%"
        h="150px"
        borderTop="2px solid black"
        borderLeft="2px solid black"
        borderTopLeftRadius="50px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center">
        <LinkComponent href="CreateCampaign">
         <h2
          style={{
           fontFamily: 'Dm Sans',
           fontSize: '24px',
           fontWeight: '600',
           borderBottom: '2px solid black',
           display: 'flex',
           justifyContent: 'center',
          }}>
          Take Actions-&gt;{' '}
         </h2>
        </LinkComponent>
        <p style={{ fontFamily: 'Dm Sans', display: 'flex', justifyContent: 'center', margin: '10px', color: 'gray' }}>
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, molestias ut. Nam exercitationem molestias ipsam cupiditate corrupti.
        </p>
       </Flex> */}
      </Flex>
     </motion.section>

     <motion.section style={{ marginTop: '650px' }}>
      <Heading as="h2" fontSize="60px" w="650px" mt="30px" position="absolute" left="150px" fontFamily="Dm Sans">
       How it Works?
      </Heading>

      <Flex
       w="1420px"
       paddingLeft="100px"
       paddingRight="100px"
       position="absolute"
       left="50px"
       mt="220px"
       h="150px"
       justifyContent="space-between"
       alignItems="center">
       <Box>
        <Heading as="h3" fontSize="40px" fontFamily="Dm Sans">
         Step 01
        </Heading>
        <Heading as="h3" fontSize="20px" fontFamily="Dm Sans">
         Protocol team creates a Campaign to reward adoption
        </Heading>
       </Box>
       <Box>
        <Image src="/1.png" alt="Create a Campaign" width={650} height={550} priority />
       </Box>
      </Flex>
      <Flex
       w="1420px"
       paddingLeft="100px"
       paddingRight="100px"
       position="absolute"
       left="50px"
       mt="720px"
       h="150px"
       justifyContent="space-between"
       alignItems="center">
       <Box>
        <Heading as="h3" fontSize="40px" fontFamily="Dm Sans">
         Step 02
        </Heading>
        <Heading as="h3" fontSize="20px" fontFamily="Dm Sans">
         Referrer users generate referrals and share the link
        </Heading>
       </Box>
       <Box>
        <Image src="/2.png" alt="Create a Campaign" width={650} height={550} priority />
       </Box>
      </Flex>
      <Flex
       w="1420px"
       paddingLeft="100px"
       paddingRight="100px"
       position="absolute"
       left="50px"
       mt="1220px"
       h="150px"
       justifyContent="space-between"
       alignItems="center">
       <Box>
        <Heading as="h3" fontSize="40px" fontFamily="Dm Sans">
         Step 03
        </Heading>
        <Heading as="h3" fontSize="20px" fontFamily="Dm Sans">
         Referral users take action and claim rewards <br /> for them and the referrer who shared a link.
        </Heading>
       </Box>
       <Box>
        <Image src="/2.png" alt="Create a Campaign" width={650} height={550} priority />
       </Box>
      </Flex>
     </motion.section>
     <section>
      <div
       style={{
        width: '1420px',
        borderTop: '2px solid black',
        position: 'absolute',
        left: '50px',
        top: '2300px',
        height: '100px',
        borderLeft: '2px solid black',
       }}>
       <div
        style={{
         width: '100px',
         height: '130px',
         borderLeft: '2px solid black',
         borderTop: '2px solid black',
         borderRadius: '100px 00px 0px 0px',
         position: 'absolute',
         left: '0px',
        }}></div>
       <Box as="footer" py="4" marginTop="20px">
        <Flex justifyContent="center" alignItems="center">
         <Text>&copy; 2023 Refer 🤝. All rights reserved.</Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center" mt="2">
         <LinkComponent href="/CreateCampaign">Create campaign</LinkComponent>
         <Text mx="2">|</Text>
         <LinkComponent href="/createlink">Create Link</LinkComponent>
        </Flex>
        <Flex color="gray.500" gap={2} alignItems="center" mt={2} justifyContent="center">
         <LinkComponent href={`https://github.com/marvinmarnold/sybil-resistant-referrer`}>
          <FaGithub />
         </LinkComponent>
        </Flex>
       </Box>
      </div>
     </section>
    </Container>
   </motion.div>
  </>
 )
}
