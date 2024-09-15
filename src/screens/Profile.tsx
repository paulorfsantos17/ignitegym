import ScreenHeader from '@components/ScreenHeader'
import UserPhoto from '@components/UserPhoto'
import { Center, VStack } from '@gluestack-ui/themed'
import { ScrollView } from 'react-native'

export function Profile() {
  return (
    <VStack>
      <ScreenHeader title="Perfil" />
      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={{ uri: 'https:github.com/paulorfsantos17.png' }}
            alt="Imagem de perfil"
            size="xl"
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
