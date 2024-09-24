import BodySvg from '@assets/body.svg'
import RepetitionSvg from '@assets/repetitions.svg'
import SeriesSvg from '@assets/series.svg'
import Button from '@components/Button'
import { Loading } from '@components/Loading'
import ToastMessage from '@components/ToastMessage'
import type { ExerciseDTO } from '@dtos/ExerciseDTO'
import {
  Box,
  Center,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import { useNavigation, useRoute } from '@react-navigation/native'
import type { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { ArrowLeft } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'

interface RouteParamsProps {
  exerciseId: string
}

export function Exercise() {
  const [exerciseDetails, setExerciseDetails] = useState<ExerciseDTO>()

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingCheckExercise, setIsSubmittingCheckExercise] =
    useState(false)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()

  const toast = useToast()

  const { exerciseId } = route.params as RouteParamsProps

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExerciseDetails(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o exercícios. Tente novamente mais tarde.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            onClose={() => toast.close(id)}
            action="error"
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setIsSubmittingCheckExercise(true)
      await api.post(`/history`, {
        exercise_id: exerciseId,
      })

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Parabéns! Exercício registrado no seu histórico."
            onClose={() => toast.close(id)}
            action="success"
          />
        ),
      })
      navigation.navigate('history')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível marcar o exercício como realizado.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title={title}
            onClose={() => toast.close(id)}
            action="error"
          />
        ),
      })
    } finally {
      setIsSubmittingCheckExercise(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  if (isLoading) {
    return (
      <Center w="$full" flex={1}>
        <Loading />
      </Center>
    )
  }

  return (
    <VStack flex={1}>
      <VStack px="$8" bg="$gray600" pt="$12">
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={ArrowLeft} color="$green500" size="xl" />
        </TouchableOpacity>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt="$4"
          mb="$8"
        >
          <Heading
            color="$gray100"
            fontSize="$lg"
            fontFamily="$heading"
            flexShrink={1}
          >
            {exerciseDetails?.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />
            <Text color="$gray200" ml="$1" textTransform="capitalize">
              {exerciseDetails?.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <VStack p="$8">
          <Box rounded="$lg" mb="$3" overflow="hidden">
            <Image
              w="$full"
              h="$80"
              source={{
                uri: `${api.defaults.baseURL}/exercise/demo/${exerciseDetails?.demo}`,
              }}
              alt="Exercício"
              resizeMode="cover"
            />
          </Box>

          <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
            <HStack
              alignItems="center"
              justifyContent="space-around"
              mb="$6"
              mt="$5"
            >
              <HStack>
                <SeriesSvg />
                <Text color="$gray200" ml="$2">
                  {exerciseDetails?.series} séries
                </Text>
              </HStack>
              <HStack>
                <RepetitionSvg />
                <Text color="$gray200" ml="$2">
                  {exerciseDetails?.repetitions} repetições
                </Text>
              </HStack>
            </HStack>
            <Button
              title="Marcar como  realizado"
              isLoading={isSubmittingCheckExercise}
              onPress={handleExerciseHistoryRegister}
            />
          </Box>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
