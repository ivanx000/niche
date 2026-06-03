import { ScrollView, TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { BoilerplateConfig } from "@/config/boilerplate.config"
import type { MainStackScreenProps } from "@/navigators/navigationTypes"
import { useAppTheme } from "@/theme/context"

const APP_NAME = BoilerplateConfig.app.name
const SUPPORT_EMAIL = BoilerplateConfig.app.supportEmail

const PRIVACY_POLICY = `Last updated: [DATE]

This page explains what information we collect, how we use it, and your rights.

Information We Collect

We do not collect any personally identifiable information. The app operates entirely on-device. Your data is stored locally on your device and never transmitted to our servers.

How We Use Information

All data you enter into ${APP_NAME} stays on your device. We do not sell, share, or transmit your data to third parties.

Push Notifications

If you grant permission, we send local notifications to enhance your experience. These are generated on-device and do not involve any external server.

Children's Privacy

${APP_NAME} is not directed at children under 13. We do not knowingly collect information from children.

Changes to This Policy

We may update this policy from time to time. Continued use of the app after changes constitutes acceptance of the updated policy.

Contact Us

If you have questions about this privacy policy, please contact us at ${SUPPORT_EMAIL}.`

const TERMS_OF_SERVICE = `Last updated: [DATE]

By downloading or using ${APP_NAME}, you agree to these Terms of Service. Please read them carefully.

License

We grant you a limited, non-exclusive, non-transferable license to use ${APP_NAME} for personal, non-commercial purposes.

Subscriptions

${APP_NAME} offers auto-renewing subscriptions. Subscriptions are billed through your Apple ID. You can manage or cancel your subscription at any time in your device's App Store settings. Cancellation takes effect at the end of the current billing period. We do not offer refunds for partial subscription periods.

A free trial may be offered for new subscribers. Any unused portion of a free trial period will be forfeited upon purchase of a subscription.

Acceptable Use

You agree not to misuse the app, reverse-engineer it, or use it for any unlawful purpose.

Disclaimer of Warranties

${APP_NAME} is provided "as is" without warranties of any kind. We do not guarantee that the app will be error-free or uninterrupted.

Limitation of Liability

To the fullest extent permitted by law, ${APP_NAME} and its developers are not liable for any indirect, incidental, or consequential damages arising from your use of the app.

Changes to These Terms

We may update these terms at any time. Continued use of the app after changes constitutes your acceptance of the new terms.

Contact Us

For questions about these terms, please contact us at ${SUPPORT_EMAIL}.`

type Props = MainStackScreenProps<"Legal">

export function LegalScreen({ navigation, route }: Props) {
  const { theme: { colors, spacing } } = useAppTheme()
  const insets = useSafeAreaInsets()
  const { type } = route.params

  const title = type === "privacy" ? "Privacy Policy" : "Terms of Service"
  const body = type === "privacy" ? PRIVACY_POLICY : TERMS_OF_SERVICE

  return (
    <View style={[$root, { backgroundColor: colors.background }]}>
      <View style={[$header, { paddingTop: insets.top + 8, paddingHorizontal: spacing.md, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={$backBtn} activeOpacity={0.7}>
          <Text style={[$backText, { color: colors.tint }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[$heading, { color: colors.text }]}>{title}</Text>
      </View>
      <ScrollView
        contentContainerStyle={[$scroll, { paddingHorizontal: spacing.md, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[$body, { color: colors.text }]}>{body}</Text>
      </ScrollView>
    </View>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $header: ViewStyle = {
  paddingBottom: 12,
  gap: 8,
}

const $backBtn: ViewStyle = {
  alignSelf: "flex-start",
}

const $backText: TextStyle = {
  fontSize: 16,
}

const $heading: TextStyle = {
  fontSize: 28,
  fontWeight: "700",
  lineHeight: 36,
}

const $scroll: ViewStyle = {
  paddingTop: 16,
}

const $body: TextStyle = {
  fontSize: 15,
  lineHeight: 24,
}
