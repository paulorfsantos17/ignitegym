import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'
interface HistoryCardProps {
  group: string
  name: string
  hour: string
}

export default function HistoryCard({ group, hour, name }: HistoryCardProps) {
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
      <VStack flex={1}>
        <Heading
          color="$white"
          fontSize="$md"
          fontFamily="$heading"
          textTransform="capitalize"
          numberOfLines={1}
        >
          {group}
        </Heading>
        <Text
          color="$gray100"
          fontSize="$lg"
          fontFamily="$body"
          numberOfLines={1}
        >
          {name}
        </Text>
      </VStack>
      <Text color="$gray300" fontSize="$md">
        {hour}
      </Text>
    </HStack>
  )
}
