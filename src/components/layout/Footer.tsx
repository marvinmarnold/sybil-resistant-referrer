import { Flex, Text } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'
import { SITE_DESCRIPTION } from 'utils/config'
import { LinkComponent } from './LinkComponent'

interface Props {
 className?: string
}

export function Footer(props: Props) {
 const className = props.className ?? ''

 return (
  <Flex as="footer" className={className} flexDirection="column" justifyContent="center" alignItems="center">
   <Text>{SITE_DESCRIPTION}</Text>

   <Flex color="gray.500" gap={2} alignItems="center" mt={2}>
    <LinkComponent href={`https://github.com/marvinmarnold/sybil-resistant-referrer`}>
     <FaGithub />
    </LinkComponent>
   </Flex>
  </Flex>
 )
}
