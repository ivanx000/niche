import { createNativeStackNavigator } from "@react-navigation/native-stack"

import { HomeScreen } from "@/screens/HomeScreen"
import { InterruptScreen } from "@/screens/InterruptScreen"
import { LegalScreen } from "@/screens/LegalScreen"
import { MicroActionScreen } from "@/screens/MicroActionScreen"
import { SettingsScreen } from "@/screens/SettingsScreen"
import { N } from "@/theme/niche"

import type { MainStackParamList } from "./navigationTypes"

const Stack = createNativeStackNavigator<MainStackParamList>()

export function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: N.stone },
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen
        name="Interrupt"
        component={InterruptScreen}
        options={{ presentation: "transparentModal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="MicroAction" component={MicroActionScreen} />
    </Stack.Navigator>
  )
}
