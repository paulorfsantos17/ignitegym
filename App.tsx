import { Text, View, StatusBar } from "react-native";
import {useFonts, Roboto_700Bold, Roboto_400Regular} from "@expo-google-fonts/roboto"




export default function App() {
  const [fontsLoaded] = useFonts({Roboto_700Bold, Roboto_400Regular})

  if(!fontsLoaded){
    return <View></View>
  }
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}
