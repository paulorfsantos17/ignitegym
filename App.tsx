import {View, StatusBar } from "react-native";
import {useFonts, Roboto_700Bold, Roboto_400Regular} from "@expo-google-fonts/roboto"
import { Center, GluestackUIProvider, Text } from "@gluestack-ui/themed";
import { config } from './config/gluestack-ui.config'




export default function App() {
  const [fontsLoaded] = useFonts({Roboto_700Bold, Roboto_400Regular})

  if(!fontsLoaded){
    return <Center></Center>
  }
  return (
    <GluestackUIProvider config={config}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
      <Center flex={1} bg="$gray600">
        <Text color="white">Open up App.tsx to start working on your app!</Text>
      </Center>
    </GluestackUIProvider>
  );
}
