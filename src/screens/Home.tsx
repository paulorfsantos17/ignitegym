import { ExerciseCard } from '@components/ExerciseCard'
import Group from '@components/Group'
import HomeHeader from '@components/HomeHeader'
import { Loading } from '@components/Loading'
import ToastMessage from '@components/ToastMessage'
import type { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Heading, HStack, Text, useToast, VStack } from '@gluestack-ui/themed'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useCallback, useEffect, useState } from 'react'
import { FlatList } from 'react-native'

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groupSelected, setGroupSelected] = useState('costas')

  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExercisesDetails() {
    navigation.navigate('exercise')
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            action="error"
            title={title}
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/by-group/${groupSelected}`)
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os grupos musculares.'

      toast.show({
        render: ({ id }) => (
          <ToastMessage
            id={id}
            onClose={() => toast.close(id)}
            action="error"
            title={title}
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected]),
  )

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
            mx="$2"
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack px="$8" flex={1}>
          <HStack justifyContent="space-between" mb="$4" alignItems="center">
            <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
              Exercícios
            </Heading>
            <Text color="$gray200" fontSize="$sm" fontFamily="$body">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ExerciseCard data={item} onPress={handleOpenExercisesDetails} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  )
}
