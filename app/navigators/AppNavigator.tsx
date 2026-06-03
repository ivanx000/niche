import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import Config from "@/config"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { LegalScreen } from "@/screens/LegalScreen"
import { useAppTheme } from "@/theme/context"
import { N } from "@/theme/niche"

import { MainNavigator } from "./MainNavigator"
import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

const exitRoutes = Config.exitRoutes

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: N.stone,
        contentStyle: { backgroundColor: N.stone },
      }}
      initialRouteName="Main"
    >
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Legal" component={LegalScreen} />
    </Stack.Navigator>
  )
}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
      <ErrorBoundary catchErrors={Config.catchErrors}>
        <AppStack />
      </ErrorBoundary>
    </NavigationContainer>
  )
}
