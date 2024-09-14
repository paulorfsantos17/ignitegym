import Group from '@components/Group'
import HomeHeader from '@components/HomeHeader'
import { HStack, VStack } from '@gluestack-ui/themed'
import { useState } from 'react'

export function Home() {
  const [groupSelected, setGroupSelected] = useState('biceps')
  return (
    <VStack>
      <HomeHeader />
      <HStack gap="$3">
        <Group
          name="Biceps"
          isActive={groupSelected === 'biceps'}
          onPress={() => setGroupSelected('biceps')}
        />
        <Group
          name="Costa"
          isActive={groupSelected === 'costa'}
          onPress={() => setGroupSelected('costa')}
        />
        <Group
          name="Perna"
          isActive={groupSelected === 'perna'}
          onPress={() => setGroupSelected('perna')}
        />
      </HStack>
    </VStack>
  )
}
