/* eslint-disable camelcase */
import { AuthContext, AuthContextProvider } from '@contexts/AuthContext'
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { GluestackUIProvider } from '@gluestack-ui/themed'
import { Routes } from '@routes/index'
import { StatusBar } from 'react-native'

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

      <AuthContextProvider>{fontsLoaded && <Routes />}</AuthContextProvider>
    </GluestackUIProvider>
  )
}
