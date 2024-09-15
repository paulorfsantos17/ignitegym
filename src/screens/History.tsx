import HistoryCard from '@components/HistoryCard'
import ScreenHeader from '@components/ScreenHeader'
import { Heading, Text, VStack } from '@gluestack-ui/themed'
import { useState } from 'react'
import { SectionList } from 'react-native'

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: '15.09.2024',
      data: ['Remada Unilateral', 'Remada Frontal'],
    },
    {
      title: '15.09.2024',
      data: ['Remada Unilateral'],
    },
  ])

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico" />
      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={() => (
          <Text color="$gray100" textAlign="center">
            Não há exercícios registrados ainda. {'\n'} Vamos Fazer exercícios
            hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  )
}
