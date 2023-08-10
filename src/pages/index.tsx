import { Text, Button } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { HeadingComponent } from 'components/layout/HeadingComponent'
import { LinkComponent } from 'components/layout/LinkComponent'

export default function Home() {
 return (
  <>
   <Head />

   <main>
    <HeadingComponent as="h2">Create a campaign</HeadingComponent>
    <Text></Text>
    <Button py={4}>
     <LinkComponent href="create">Create campaign</LinkComponent>
    </Button>
    <HeadingComponent as="h2">Create ref link</HeadingComponent>
    <Button py={4}>
     <LinkComponent href="createlink">Create ref link</LinkComponent>
    </Button>
   </main>
  </>
 )
}
