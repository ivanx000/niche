import { TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import { Cog6ToothIcon } from "react-native-heroicons/outline"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { BoilerplateConfig } from "@/config/boilerplate.config"
import type { MainStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"

export function HomeScreen({ navigation }: MainStackScreenProps<"Home">) {
  const { theme: { colors, spacing } } = useAppTheme()

  return (
    <Screen preset="fixed" safeAreaEdges={["top", "bottom"]} systemBarStyle="dark">
      <View style={[$root, { paddingHorizontal: spacing.md, paddingTop: spacing.sm }]}>
        {/* Header */}
        <View style={$header}>
          <Text style={[$title, { color: colors.text }]}>{BoilerplateConfig.app.name}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Settings")}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Cog6ToothIcon size={24} color={colors.textDim} strokeWidth={1.8} />
          </TouchableOpacity>
        </View>

        {/* Placeholder content — replace with your app's dashboard */}
        <View style={[$placeholder, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[$placeholderText, { color: colors.textDim }]}>
            Your dashboard goes here
          </Text>
        </View>
      </View>
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
  gap: 20,
}

const $header: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingVertical: 8,
}

const $title: TextStyle = {
  fontSize: 28,
  fontWeight: "700",
  lineHeight: 36,
}

const $placeholder: ViewStyle = {
  flex: 1,
  borderRadius: 16,
  borderWidth: 1,
  borderStyle: "dashed",
  alignItems: "center",
  justifyContent: "center",
}

const $placeholderText: TextStyle = {
  fontSize: 15,
}
