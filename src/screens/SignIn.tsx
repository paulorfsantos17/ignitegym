import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import Button from '@components/Button'
import { Input } from '@components/Input'
import ToastMessage from '@components/ToastMessage'
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAuth } from '@hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import type { AuthNavigationRoutesProps } from '@routes/auth.routes'
import { AppError } from '@utils/AppError'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

const signInSchema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .required('Senha é obrigatória'),
})

type FormDataSchema = yup.InferType<typeof signInSchema>

export function SignIn() {
  const toast = useToast()
  const { signIn } = useAuth()

  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataSchema>({
    resolver: yupResolver(signInSchema),
  })

  const navigator = useNavigation<AuthNavigationRoutesProps>()

  function handleNewAccount() {
    navigator.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormDataSchema) {
    try {
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <ToastMessage
              id={id}
              title={title}
              onClose={() => toast.close(id)}
              action="error"
            />
          )
        },
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoa Treinando"
          position="absolute"
        />
        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />
            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e o seu corpo.
            </Text>
          </Center>
          <Center gap="$2">
            <Heading color="$gray100">Acesse a conta.</Heading>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  errorMessage={errors.email?.message}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Senha"
                  errorMessage={errors.password?.message}
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Button
              title="Acessar"
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
          </Center>

          <Center flex={1} justifyContent="flex-end" mt="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
              Ainda não tem acesso?
            </Text>
            <Button
              title="Criar Conta"
              variant="outline"
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}
