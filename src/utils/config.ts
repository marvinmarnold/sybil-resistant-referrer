import { ThemingProps } from '@chakra-ui/react'
import { goerli, optimismGoerli, baseGoerli, zoraTestnet } from '@wagmi/chains'
import { Chain } from '@wagmi/core'

export const modeTestnet = {
 id: 919,
 name: 'Mode Testnet',
 network: 'mode',
 nativeCurrency: {
  decimals: 18,
  name: 'ETH',
  symbol: 'ETH',
 },
 rpcUrls: {
  public: { http: ['https://sepolia.mode.network'] },
  default: { http: ['https://sepolia.mode.network'] },
 },
 blockExplorers: {
  etherscan: { name: 'BlockScout', url: 'https://sepolia.explorer.mode.network/' },
  default: { name: 'BlockScout', url: 'https://sepolia.explorer.mode.network/' },
 },
} as const satisfies Chain

export const SITE_NAME = '🤝 Refer'
export const SITE_DESCRIPTION = 'Sibyl resistance referral campaigns '
export const SITE_URL = 'https://nexth.vercel.app'

export const THEME_INITIAL_COLOR = 'light'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'purple'
export const THEME_CONFIG = {
 initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'refer'
export const SOCIAL_GITHUB = 'refer'

export const ETH_CHAINS = [goerli, optimismGoerli, baseGoerli, zoraTestnet, modeTestnet]

export const SERVER_SESSION_SETTINGS = {
 cookieName: SITE_NAME,
 password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
 cookieOptions: {
  secure: process.env.NODE_ENV === 'production',
 },
}
