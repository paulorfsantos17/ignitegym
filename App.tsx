/* eslint-disable camelcase */
import { StatusBar } from 'react-native'
import {
  useFonts,
  Roboto_700Bold,
  Roboto_400Regular,
} from '@expo-google-fonts/roboto'
import { Center, GluestackUIProvider, Text } from '@gluestack-ui/themed'
import { config } from './config/gluestack-ui.config'
import { Loading } from './src/components/Loading'

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_700Bold, Roboto_400Regular })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      {!fontsLoaded && <Loading />}
      {fontsLoaded && (
        <Center flex={1} bgColor="$gray700">
          <Text color="white">
            Open up App.tsx to start working on your app!
          </Text>
        </Center>
      )}
    </GluestackUIProvider>
  )
}
