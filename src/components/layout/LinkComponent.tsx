import { Link, useColorModeValue } from '@chakra-ui/react'
import NextLink from 'next/link'
import { ReactNode } from 'react'
import { THEME_COLOR_SCHEME } from 'utils/config'

interface Props {
 href: string
 children: ReactNode
 isExternal?: boolean
 className?: string
}

export function LinkComponent(props: Props) {
 const className = props.className ?? 'margin-left'
 const isExternal = props.href.match(/^([a-z0-9]*:|.{0})\/\/.*$/) || props.isExternal
 const color = useColorModeValue(`${THEME_COLOR_SCHEME}.600`, `${THEME_COLOR_SCHEME}.400`)

 if (isExternal) {
  return (
   <Link className={className} _hover={{ color: color }} href={props.href} target="_blank" rel="noopener noreferrer">
    {props.children}
   </Link>
  )
 }

 return (
  <Link as={NextLink} className={className} _hover={{ color: color }} href={props.href}>
   {props.children}
  </Link>
 )
}
