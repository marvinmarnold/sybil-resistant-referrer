import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <Box maxW="container.md" mx="auto" p={8}>
      <Head>
        <title>Create Campaign</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>
    </Box>
  );
};

export default Home;
