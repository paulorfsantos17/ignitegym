import UserImageDefault from '@assets/userPhotoDefault.png'
import {
  Heading,
  HStack,
  Icon,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { LogOut } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

import ToastMessage from './ToastMessage'
import UserPhoto from './UserPhoto'

export default function HomeHeader() {
  const toast = useToast()
  const { user, signOut } = useAuth()

  function handleSignOut() {
    try {
      signOut()
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Aconteceu um erro inesperado tente novamente mais tarde'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            title={title}
            action="error"
            id={id}
            onClose={() => toast.close(id)}
          />
        ),
      })
    }
  }

  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
            : UserImageDefault
        }
        w="$16"
        h="$16"
        alt="Image do Usuário."
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">
          Olá,
        </Text>
        <Heading color="$gray100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon as={LogOut} color="$gray200" size="xl" />
      </TouchableOpacity>
    </HStack>
  )
}
