import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Worldcoin from './worldcoin'

const Home: NextPage = () => {
 return (
  <div className={styles.container}>
   <Head>
    <title>Sibyl resistance referral campaigns</title>
    <meta content="Generated by @rainbow-me/create-rainbowkit" name="description" />
    <link href="/favicon.ico" rel="icon" />
   </Head>

   <main className={styles.main}>
    <Worldcoin />
   </main>

   <footer className={styles.footer}>
    <h1>footer</h1>
   </footer>
  </div>
 )
}

export default Home
