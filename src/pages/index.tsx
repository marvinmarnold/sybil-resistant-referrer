import { Text } from '@chakra-ui/react';
import { Head } from 'components/layout/Head';
import { HeadingComponent } from 'components/layout/HeadingComponent';
import { LinkComponent } from 'components/layout/LinkComponent';

export default function Home() {
  return (
    <>
      <Head />

      <main>
        <HeadingComponent as="h2">Create a campaign</HeadingComponent>
        <Text>Quickly ship Web3 Apps ⚡</Text>
        <Text py={4}>
          <LinkComponent href="examples">View examples</LinkComponent> to
          bootstrap development.
        </Text>
        <HeadingComponent as="h2">Create ref link</HeadingComponent>
      </main>
    </>
  );
}
