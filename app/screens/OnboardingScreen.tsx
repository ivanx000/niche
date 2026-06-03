import { useState } from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Svg, { Path } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppState } from "@/context/AppStateContext"
import { usePurchases } from "@/context/PurchasesContext"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { N } from "@/theme/niche"

const INTENTIONS_DEFAULT = ["calm", "presence"]

const INTENTIONS = [
  { key: "calm",       n: "01", label: "Calm",       hint: "less reactive" },
  { key: "focus",      n: "02", label: "Focus",      hint: "one thing fully" },
  { key: "presence",   n: "03", label: "Presence",   hint: "just here, now" },
  { key: "connection", n: "04", label: "Connection", hint: "with people" },
]

export function OnboardingScreen({ navigation }: AppStackScreenProps<"Onboarding">) {
  const { setOnboardingComplete, setIntentions, setDailyGoal } = useAppState()
  const { isPremium } = usePurchases()
  const insets = useSafeAreaInsets()
  const [picked, setPicked] = useState<string[]>(INTENTIONS_DEFAULT)
  const [goal, setGoalState] = useState(3)

  const toggle = (k: string) =>
    setPicked(p => (p.includes(k) ? p.filter(x => x !== k) : [...p, k]))

  const setGoal = (n: number) => setGoalState(n)

  const finish = () => {
    setIntentions(picked.length ? picked : INTENTIONS_DEFAULT)
    setDailyGoal(goal)
    setOnboardingComplete()
    if (isPremium) {
      navigation.reset({ index: 0, routes: [{ name: "Main" }] })
    } else {
      navigation.navigate("Paywall")
    }
  }

  return (
    <View style={[s.root, { backgroundColor: N.stone }]}>
      {/* status bar spacer */}
      <View style={{ height: insets.top + 12 }} />

      {/* top row */}
      <View style={s.topRow}>
        <Text style={s.step}>
          <Text style={{ color: N.ink }}>02</Text>
          {" / 03"}
        </Text>
        <TouchableOpacity onPress={finish} hitSlop={8}>
          <Text style={s.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* progress bar */}
      <View style={s.progressTrack}>
        <View style={[s.progressFill, { width: "66%" }]} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* editorial title */}
        <View style={s.titleArea}>
          <Text style={s.title}>
            {"What do you want to feel "}
            <Text style={s.titleAccent}>more</Text>
            {" of?"}
          </Text>
          <Text style={s.subtitle}>
            Pick what feels true today. We hold these gently in the background — not as goals.
          </Text>
        </View>

        {/* intentions */}
        <View style={s.intentionsList}>
          {INTENTIONS.map((it, i) => {
            const active = picked.includes(it.key)
            return (
              <Pressable
                key={it.key}
                onPress={() => toggle(it.key)}
                style={[
                  s.intentionRow,
                  active && s.intentionRowActive,
                  !active && i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: N.border },
                ]}
              >
                <Text style={[s.intentionNumber, active && s.intentionNumberActive]}>
                  {it.n}
                </Text>
                <View style={s.intentionBody}>
                  <Text style={[s.intentionLabel, active && s.intentionLabelActive]}>
                    {it.label}
                  </Text>
                  <Text style={[s.intentionHint, active && s.intentionHintActive]}>
                    {it.hint}
                  </Text>
                </View>
                <View style={[s.intentionCheck, active && s.intentionCheckActive]}>
                  {active && (
                    <Svg width={12} height={12} viewBox="0 0 12 12">
                      <Path
                        d="M2 6.5l2.5 2.5L10 3"
                        fill="none"
                        stroke="#FFF"
                        strokeWidth={1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  )}
                </View>
              </Pressable>
            )
          })}
        </View>

        {/* full-bleed sand band — daily goal */}
        <View style={[s.goalBand, { backgroundColor: N.sand }]}>
          <Text style={s.goalLabel}>A soft daily goal</Text>
          <View style={s.goalNumber}>
            <Text style={s.goalDigit}>{goal}</Text>
            <Text style={s.goalUnit}>
              {goal === 1 ? "pause" : "pauses"}{"\n"}a day
            </Text>
          </View>
          <View style={s.goalButtons}>
            {[1, 2, 3, 4, 5].map(n => {
              const active = n <= goal
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => setGoal(n)}
                  style={[
                    s.goalBtn,
                    active
                      ? { backgroundColor: N.ink, borderColor: N.ink }
                      : { backgroundColor: "transparent", borderColor: N.border },
                  ]}
                >
                  <Text style={[s.goalBtnText, { color: active ? N.stone : N.muted }]}>
                    {n}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          <Text style={s.goalNote}>No streaks. No penalties. Change it anytime.</Text>
        </View>
      </ScrollView>

      {/* footer */}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          onPress={picked.length ? finish : undefined}
          activeOpacity={picked.length ? 0.85 : 1}
          style={[
            s.cta,
            { backgroundColor: picked.length ? N.ink : N.border },
          ]}
        >
          <Text style={[s.ctaText, { color: picked.length ? N.stone : N.muted }]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 14,
  },
  step: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  skip: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
  },
  progressTrack: {
    marginHorizontal: 28,
    marginTop: 14,
    height: 2,
    backgroundColor: N.border,
    borderRadius: 1,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: N.ink,
    borderRadius: 1,
  },
  titleArea: {
    paddingHorizontal: 28,
    paddingTop: 28,
    marginBottom: 38,
  },
  title: {
    fontSize: 46,
    fontFamily: "DMSans_700Bold",
    lineHeight: 50,
    letterSpacing: -1.6,
    color: N.ink,
  },
  titleAccent: {
    color: N.sage,
    textDecorationLine: "underline",
    textDecorationColor: N.sage,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
    marginTop: 20,
    lineHeight: 21,
    maxWidth: 280,
  },
  intentionsList: {
    marginBottom: 36,
    paddingHorizontal: 28,
  },
  intentionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingVertical: 20,
    paddingHorizontal: 22,
    backgroundColor: "transparent",
    borderRadius: 0,
  },
  intentionRowActive: {
    backgroundColor: N.sage,
    borderRadius: 18,
    marginVertical: 6,
    marginHorizontal: -4,
  },
  intentionNumber: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 28,
    color: N.faint,
    minWidth: 36,
  },
  intentionNumberActive: {
    color: "rgba(255,255,255,0.7)",
  },
  intentionBody: {
    flex: 1,
  },
  intentionLabel: {
    fontSize: 26,
    fontFamily: "DMSans_600SemiBold",
    letterSpacing: -0.5,
    lineHeight: 29,
    color: N.ink,
  },
  intentionLabelActive: {
    color: "#FFFFFF",
  },
  intentionHint: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    marginTop: 4,
    color: N.muted,
  },
  intentionHintActive: {
    color: "rgba(255,255,255,0.7)",
  },
  intentionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: N.border,
    alignItems: "center",
    justifyContent: "center",
  },
  intentionCheckActive: {
    borderColor: "#FFFFFF",
  },
  goalBand: {
    paddingHorizontal: 28,
    paddingVertical: 32,
    marginBottom: 24,
  },
  goalLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  goalNumber: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 14,
    marginBottom: 22,
  },
  goalDigit: {
    fontSize: 72,
    fontFamily: "DMSans_700Bold",
    color: N.ink,
    lineHeight: 72,
    letterSpacing: -2,
  },
  goalUnit: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 26,
    color: N.muted,
    lineHeight: 31,
    paddingBottom: 4,
  },
  goalButtons: {
    flexDirection: "row",
    gap: 8,
  },
  goalBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  goalBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  goalNote: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
    marginTop: 14,
    lineHeight: 17,
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 8,
    backgroundColor: N.stone,
  },
  cta: {
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    letterSpacing: -0.2,
  },
})
