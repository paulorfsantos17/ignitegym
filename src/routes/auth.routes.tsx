import type { ParamListBase } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'

interface AuthRoutesParams extends ParamListBase {
  signIn: undefined
  signUp: undefined
}

export type AuthNavigationRoutesProps =
  NativeStackNavigationProp<AuthRoutesParams>

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesParams>()

export default function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="signIn" component={SignIn} />
      <Screen name="signUp" component={SignUp} />
    </Navigator>
  )
}
