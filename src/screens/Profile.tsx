import ScreenHeader from '@components/ScreenHeader'
import UserPhoto from '@components/UserPhoto'
import { Center, Text, VStack } from '@gluestack-ui/themed'
import { ScrollView, TouchableOpacity } from 'react-native'

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
          <TouchableOpacity>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar Foto
            </Text>
          </TouchableOpacity>
        </Center>
      </ScrollView>
    </VStack>
  )
}
