import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'

export default function HistoryCard() {
  return (
    <HStack
      w="$full"
      px="$5"
      py="$4"
      mt="$3"
      bg="$gray600"
      rounded="$md"
      alignItems="center"
      justifyContent="space-between"
    >
      <VStack>
        <Heading
          color="$white"
          fontSize="$md"
          fontFamily="$heading"
          textTransform="capitalize"
        >
          Costas
        </Heading>
        <Text
          color="$gray100"
          fontSize="$lg"
          fontFamily="$body"
          numberOfLines={1}
        >
          Puxada Frontal
        </Text>
      </VStack>
      <Text color="$gray300" fontSize="$md">
        08:34
      </Text>
    </HStack>
  )
}
