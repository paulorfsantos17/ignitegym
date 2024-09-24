import { ExerciseDTO } from '@dtos/ExerciseDTO'
import {
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from '@gluestack-ui/themed'
import { api } from '@services/api'
import { ChevronRight } from 'lucide-react-native'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native'

interface ExerciseCardProps extends TouchableOpacityProps {
  data: ExerciseDTO
}

export function ExerciseCard({ data, ...rest }: ExerciseCardProps) {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="$gray500"
        alignItems="center"
        justifyContent="space-between"
        p="$2"
        pr="$4"
        rounded="$md"
        mb="$3"
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
          }}
          alt="Exemplo de Exercício"
          w="$16"
          h="$16"
          mr="$4"
          rounded="$md"
          resizeMode="cover"
        />
        <VStack flex={1}>
          <Heading fontSize="$lg" color="$white" fontFamily="$heading">
            {data.name}
          </Heading>
          <Text fontSize="$sm" color="$gray200" mt="$1" numberOfLines={2}>
            3 Séries de x 12 repetições
          </Text>
        </VStack>
        <Icon as={ChevronRight} color="$gray300" />
      </HStack>
    </TouchableOpacity>
  )
}
