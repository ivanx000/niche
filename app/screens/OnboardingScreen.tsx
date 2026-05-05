import { useState } from "react"
import {
  Dimensions,
  Image,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native"
import { ChevronLeftIcon } from "react-native-heroicons/outline"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import * as Notifications from "expo-notifications"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { BoilerplateConfig } from "@/config/boilerplate.config"
import { useAppState } from "@/context/AppStateContext"
import { usePurchases } from "@/context/PurchasesContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const SLIDES = BoilerplateConfig.onboarding.slides

export function OnboardingScreen({ navigation, route }: AppStackScreenProps<"Onboarding">) {
  const { setOnboardingComplete } = useAppState()
  const { isPremium } = usePurchases()
  const { theme: { colors, spacing } } = useAppTheme()
  const insets = useSafeAreaInsets()
  const [step, setStep] = useState(route.params?.initialStep ?? 0)
  const [requestingPermission, setRequestingPermission] = useState(false)
  const translateX = useSharedValue(0)

  const goToStep = (next: number) => {
    translateX.value = withTiming(-next * SCREEN_WIDTH, { duration: 320 })
    setStep(next)
  }

  const finish = () => {
    setOnboardingComplete()
    if (isPremium) {
      navigation.reset({ index: 0, routes: [{ name: "Main" }] })
    } else {
      navigation.navigate("Paywall")
    }
  }

  const handleNext = async () => {
    if (step < SLIDES.length - 1) {
      goToStep(step + 1)
      return
    }
    if (BoilerplateConfig.onboarding.requestNotifications) {
      await requestNotifications()
    }
    finish()
  }

  const requestNotifications = async () => {
    if (requestingPermission) return
    setRequestingPermission(true)
    try {
      const { status } = await Notifications.getPermissionsAsync()
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync()
      }
    } catch {
      // Permission denied or unsupported — not blocking
    } finally {
      setRequestingPermission(false)
    }
  }

  const animatedSlider = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const isLastStep = step === SLIDES.length - 1

  return (
    <Screen preset="fixed" safeAreaEdges={["bottom"]} systemBarStyle="dark" contentContainerStyle={$screenContent}>
      <View style={[$root, { paddingTop: Math.max(insets.top, 60) }]}>
        {/* Back button */}
        {step > 0 && (
          <TouchableOpacity
            style={[$backBtn, { top: insets.top + 8 }]}
            onPress={() => goToStep(step - 1)}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <ChevronLeftIcon size={18} color={colors.tint} strokeWidth={2} />
            <Text style={[$backText, { color: colors.tint }]}>Back</Text>
          </TouchableOpacity>
        )}

        {/* Slides */}
        <View style={$slideViewport}>
          <Animated.View style={[$slideTrack, animatedSlider, { width: SCREEN_WIDTH * SLIDES.length }]}>
            {SLIDES.map((s, i) => (
              <View key={i} style={[$slide, { width: SCREEN_WIDTH }]}>
                {s.image ? (
                  <View style={$imageContainer}>
                    <Image
                      source={s.image}
                      style={[
                        $slideImage,
                        {
                          width: SCREEN_WIDTH * (s.imageScale ?? 0.9),
                          height: SCREEN_WIDTH * (s.imageScale ?? 0.9),
                          transform: [{ translateY: s.imageOffsetY ?? 0 }],
                        },
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <View style={[$imageContainer, $imagePlaceholder, { backgroundColor: colors.card }]} />
                )}
                <Text style={[$title, { color: colors.text }]}>{s.title}</Text>
                <Text style={[$body, { color: colors.textDim }]}>{s.body}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Bottom controls */}
        <View style={[$bottom, { paddingHorizontal: spacing.md, paddingBottom: spacing.xl }]}>
          {/* Dots */}
          <View style={$dots}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  $dot,
                  {
                    backgroundColor: i === step ? colors.tint : colors.border,
                    width: i === step ? 20 : 6,
                  },
                ]}
              />
            ))}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[$cta, { backgroundColor: colors.tint }]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={[$ctaText, { color: colors.background }]}>
              {isLastStep && BoilerplateConfig.onboarding.requestNotifications
                ? "Enable notifications"
                : isLastStep
                ? "Get started"
                : "Next"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[$skipBtn, { opacity: isLastStep ? 1 : 0 }]}
            onPress={isLastStep ? finish : undefined}
            activeOpacity={0.7}
          >
            <Text style={[$skipText, { color: colors.textDim }]}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  )
}

const $backBtn: ViewStyle = {
  position: "absolute",
  left: 20,
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  zIndex: 10,
}

const $backText: TextStyle = {
  fontSize: 16,
  fontWeight: "500",
}

const $screenContent: ViewStyle = {
  flex: 1,
  justifyContent: "flex-start",
}

const $root: ViewStyle = {
  flex: 1,
  justifyContent: "space-between",
}

const $slideViewport: ViewStyle = {
  flex: 1,
  overflow: "hidden",
  width: SCREEN_WIDTH,
}

const $slideTrack: ViewStyle = {
  flexDirection: "row",
  flex: 1,
}

const $slide: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
  paddingHorizontal: 40,
  paddingBottom: 60,
  gap: 16,
}

const $imageContainer: ViewStyle = {
  width: SCREEN_WIDTH,
  height: SCREEN_WIDTH * 0.8,
  alignItems: "center",
  justifyContent: "center",
}

const $imagePlaceholder: ViewStyle = {
  borderRadius: 20,
  width: SCREEN_WIDTH * 0.7,
  height: SCREEN_WIDTH * 0.7,
}

const $slideImage: ImageStyle = {}

const $title: TextStyle = {
  fontSize: 28,
  fontWeight: "700",
  textAlign: "center",
  lineHeight: 34,
}

const $body: TextStyle = {
  fontSize: 16,
  textAlign: "center",
  lineHeight: 24,
}

const $bottom: ViewStyle = {
  gap: 16,
}

const $dots: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: 6,
}

const $dot: ViewStyle = {
  height: 6,
  borderRadius: 3,
}

const $cta: ViewStyle = {
  borderRadius: 999,
  paddingVertical: 16,
  alignItems: "center",
}

const $ctaText: TextStyle = {
  fontSize: 16,
  fontWeight: "700",
}

const $skipBtn: ViewStyle = {
  alignItems: "center",
  paddingVertical: 8,
}

const $skipText: TextStyle = {
  fontSize: 14,
}
