import UserImageDefault from '@assets/userPhotoDefault.png'
import Button from '@components/Button'
import { Input } from '@components/Input'
import ScreenHeader from '@components/ScreenHeader'
import ToastMessage from '@components/ToastMessage'
import UserPhoto from '@components/UserPhoto'
import { Center, Heading, Text, useToast, VStack } from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import * as FileSystem from 'expo-file-system'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, TouchableOpacity } from 'react-native'
import * as yup from 'yup'

interface PhotoFileProps {
  uri: string
  type?: string
  name: string
}

const profileSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  name: yup
    .string()
    .required('Nome é obrigatória')
    .min(3, 'E tem que ter no mínimo 3 caracteres'),
  passwordOld: yup.string().optional(),
  newPassword: yup
    .string()
    .min(8, 'Precisa ter no mínimo 8 caracteres.')
    .nullable()
    .transform((value) => value || null)
    .optional(),
  newPasswordConfirmed: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value || null)
    .oneOf([yup.ref('newPassword'), ''], 'Nova senhas  não coincidem.')
    .when('newPassword', {
      is: (value: unknown) => value,
      then: (schema) => schema.required('Informe a confirmação da senha.'),
    }),
})

type FormDataSchema = yup.InferType<typeof profileSchema>

export function Profile() {
  const { user, updateUserProfile } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSchema>({
    defaultValues: {
      email: user.email,
      name: user.name,
    },
    resolver: yupResolver(profileSchema),
  })

  const [isUpdating, setIsUpdating] = useState(false)

  const toast = useToast()

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return false
      }

      const photoURI = photoSelected.assets[0].uri

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: 'top',
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande!"
                description="Está imagem é muito grande. Use uma de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          })
        }
        const fileExtension = photoSelected.assets[0].uri.split('.').pop()

        const photoFile: PhotoFileProps = {
          uri: photoURI,
          type: photoSelected.assets[0].mimeType,
          name: `${user.name}.${fileExtension}`.toLowerCase(),
        }

        const photoBlob = photoFile as unknown as Blob

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoBlob)

        const avatarUpdatedResponse = await api.patch(
          '/users/avatar',
          userPhotoUploadForm,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        await updateUserProfile(userUpdated)

        toast.show({
          placement: 'top',
          render: ({ id }) => (
            <ToastMessage
              id={id}
              action="success"
              title="Foto Atualizada"
              onClose={() => toast.close(id)}
            />
          ),
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleProfileUpdate(data: FormDataSchema) {
    try {
      setIsUpdating(true)

      await api.put('/users', {
        name: data.name,
        password: data.newPassword,
        old_password: data.passwordOld,
      })

      const userUpdated = user
      userUpdated.name = data.name
      await updateUserProfile(userUpdated)

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="success"
            title="Perfil atualizado com sucesso!"
            description="Seus dados foram alterados com sucesso."
            onClose={() => toast.close(id)}
          />
        ),
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Houve um erro ao tentar atualizar o perfil.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto
            source={
              user.avatar
                ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
                : UserImageDefault
            }
            alt="Imagem de perfil"
            size="xl"
          />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
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
          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  bg="$gray600"
                  placeholder="E-mail"
                  isDisabled
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />
          </Center>

          <Heading
            alignSelf="flex-start"
            fontFamily="$heading"
            color="$gray200"
            fontSize="$md"
            mt="$12"
            mb="$2"
          >
            Alterar Senha
          </Heading>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="passwordOld"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha antiga"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.passwordOld?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Nova senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.newPassword?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="newPasswordConfirmed"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Confirme a nova senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.newPasswordConfirmed?.message}
                />
              )}
            />

            <Button
              title="Atualizar"
              onPress={handleSubmit(handleProfileUpdate)}
              isLoading={isUpdating}
            />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  )
}
