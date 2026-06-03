import { Alert, Linking, StyleSheet, TouchableOpacity, View, Text } from "react-native"
import * as Application from "expo-application"
import { ChevronRightIcon } from "react-native-heroicons/outline"
import Svg, { Path } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BoilerplateConfig } from "@/config/boilerplate.config"
import { useAppState } from "@/context/AppStateContext"
import { usePurchases } from "@/context/PurchasesContext"
import type { MainStackScreenProps } from "@/navigators/navigationTypes"
import { N } from "@/theme/niche"

const INTENTIONS = [
  { key: "calm",       label: "Calm",       hint: "less reactive" },
  { key: "focus",      label: "Focus",      hint: "one thing fully" },
  { key: "presence",   label: "Presence",   hint: "just here, now" },
  { key: "connection", label: "Connection", hint: "with people" },
]

export function SettingsScreen({ navigation }: MainStackScreenProps<"Settings">) {
  const insets = useSafeAreaInsets()
  const { isPremium, restorePurchases, customerInfo } = usePurchases()
  const { selectedIntentions, setIntentions, dailyGoal, setDailyGoal } = useAppState()

  const handleRestore = async () => {
    const success = await restorePurchases()
    Alert.alert(
      success ? "Restored" : "Nothing to restore",
      success ? "Your subscription has been restored." : "No active subscription found.",
    )
  }

  const subscriptionStatus = () => {
    if (!customerInfo) return "Loading…"
    const entitlement = customerInfo.entitlements.active[BoilerplateConfig.revenueCat.entitlementName]
    if (!entitlement) return "Free"
    const exp = entitlement.expirationDate
    return exp ? `Renews ${new Date(exp).toLocaleDateString()}` : "Active"
  }

  const toggleIntention = (key: string) => {
    const next = selectedIntentions.includes(key)
      ? selectedIntentions.filter(k => k !== key)
      : [...selectedIntentions, key]
    // require at least one
    if (next.length > 0) setIntentions(next)
  }

  const appVersion = Application.nativeApplicationVersion ?? "—"
  const buildVersion = Application.nativeBuildVersion ?? "—"

  return (
    <View style={[s.root, { backgroundColor: N.stone }]}>
      <View style={{ height: insets.top }} />

      {/* header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Path
              d="M9 2L3 7l6 5"
              fill="none"
              stroke={N.muted}
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={s.heading}>Settings</Text>
      </View>

      <View style={s.scroll}>
        {/* Intentions */}
        <Text style={s.sectionLabel}>Your intentions</Text>
        <View style={s.card}>
          {INTENTIONS.map((it, i) => {
            const active = selectedIntentions.includes(it.key)
            const last = i === INTENTIONS.length - 1
            return (
              <TouchableOpacity
                key={it.key}
                onPress={() => toggleIntention(it.key)}
                activeOpacity={0.7}
                style={[s.intentionRow, !last && s.rowBorder]}
              >
                <View style={s.intentionText}>
                  <Text style={s.intentionLabel}>{it.label}</Text>
                  <Text style={s.intentionHint}>{it.hint}</Text>
                </View>
                <View style={[s.check, active && s.checkActive]}>
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
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Daily goal */}
        <Text style={s.sectionLabel}>Daily pause goal</Text>
        <View style={s.card}>
          <View style={s.goalRow}>
            <Text style={s.goalLabel}>Pauses per day</Text>
            <View style={s.goalButtons}>
              {[1, 2, 3, 4, 5].map(n => {
                const active = n === dailyGoal
                return (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setDailyGoal(n)}
                    style={[
                      s.goalBtn,
                      { backgroundColor: active ? N.ink : "transparent", borderColor: active ? N.ink : N.border },
                    ]}
                  >
                    <Text style={[s.goalBtnText, { color: active ? N.stone : N.muted }]}>{n}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
          <Text style={s.goalNote}>No streaks. No penalties. Change it anytime.</Text>
        </View>

        {/* Subscription */}
        <Text style={s.sectionLabel}>Subscription</Text>
        <View style={s.card}>
          <SettingsRow label="Plan" value={isPremium ? "Premium" : "Free"} last={!isPremium} />
          {isPremium && (
            <SettingsRow label="Status" value={subscriptionStatus()} />
          )}
          {isPremium ? (
            <SettingsRow
              label="Manage subscription"
              onPress={() => Linking.openURL("https://apps.apple.com/account/subscriptions")}
              chevron last
            />
          ) : (
            <SettingsRow label="Restore purchases" onPress={handleRestore} chevron last />
          )}
        </View>

        {/* Legal */}
        <Text style={s.sectionLabel}>Legal</Text>
        <View style={s.card}>
          <SettingsRow
            label="Privacy Policy"
            onPress={() => navigation.navigate("Legal", { type: "privacy" })}
            chevron
          />
          <SettingsRow
            label="Terms of Service"
            onPress={() => navigation.navigate("Legal", { type: "terms" })}
            chevron last
          />
        </View>

        {/* About */}
        <Text style={s.sectionLabel}>About</Text>
        <View style={s.card}>
          <SettingsRow
            label="Contact support"
            onPress={() => Linking.openURL(`mailto:${BoilerplateConfig.app.supportEmail}`)}
            chevron
          />
          <SettingsRow
            label="Version"
            value={`${appVersion} (${buildVersion})`}
            last
          />
        </View>

        <View style={{ height: Math.max(insets.bottom + 16, 32) }} />
      </View>
    </View>
  )
}

// ─── Settings row ─────────────────────────────────────────────────────────────

function SettingsRow({
  label,
  value,
  onPress,
  chevron,
  last,
}: {
  label: string
  value?: string
  onPress?: () => void
  chevron?: boolean
  last?: boolean
}) {
  const inner = (
    <View style={[sr.row, !last && sr.rowBorder]}>
      <Text style={sr.label}>{label}</Text>
      <View style={sr.right}>
        {value ? <Text style={sr.value}>{value}</Text> : null}
        {chevron && onPress ? <ChevronRightIcon size={16} color={N.muted} strokeWidth={2} /> : null}
      </View>
    </View>
  )

  return onPress ? (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{inner}</TouchableOpacity>
  ) : inner
}

const sr = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: N.border,
  },
  label: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: N.ink,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  value: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
  },
})

// ─── Main styles ──────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontFamily: "DMSans_600SemiBold",
    color: N.ink,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 16,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: N.edge,
    overflow: "hidden",
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: N.border,
  },
  intentionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  intentionText: {
    flex: 1,
  },
  intentionLabel: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: N.ink,
    letterSpacing: -0.2,
  },
  intentionHint: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
    marginTop: 2,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: N.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkActive: {
    backgroundColor: N.sage,
    borderColor: N.sage,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  goalLabel: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: N.ink,
  },
  goalButtons: {
    flexDirection: "row",
    gap: 6,
  },
  goalBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
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
    color: N.faint,
    paddingHorizontal: 16,
    paddingBottom: 14,
    lineHeight: 17,
  },
})
