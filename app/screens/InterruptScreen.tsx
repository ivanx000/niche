import { useEffect, useRef, useState } from "react"
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { BlurView } from "expo-blur"
import Svg, { Path, Circle, Rect } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import type { MainStackScreenProps } from "@/navigators/navigationTypes"
import { N } from "@/theme/niche"

const ACTIONS = [
  { key: "breathe", label: "Three slow breaths",  meta: "60 sec" },
  { key: "stretch", label: "A small stretch",     meta: "90 sec" },
  { key: "water",   label: "Sip of water",        meta: "now"    },
]

const POSTS = [
  { tone: "warm" as const, who: "samira_l",     dur: "2h", likes: "1.2k" },
  { tone: "cool" as const, who: "noahandbecca", dur: "4h", likes: "847" },
  { tone: "sage" as const, who: "mikasiv",      dur: "6h", likes: "2.4k" },
]

const STRIPE_COLORS: Record<string, [string, string]> = {
  warm: ["#EAD9C5", "#F4E8DD"],
  cool: ["#D2DBDF", "#E5EAEC"],
  sage: ["#CFE3D6", "#E1F0E7"],
}

export function InterruptScreen({ navigation }: MainStackScreenProps<"Interrupt">) {
  const insets = useSafeAreaInsets()
  const [pickedAction, setPickedAction] = useState<string | null>(null)
  const sheetY = useRef(new Animated.Value(0)).current
  const dotOpacity = useRef(new Animated.Value(0.65)).current

  useEffect(() => {
    // pulsing dot animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotOpacity, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 0.65, duration: 1200, useNativeDriver: true }),
      ])
    ).start()
  }, [])

  const dismiss = () => {
    Animated.timing(sheetY, {
      toValue: 600,
      duration: 320,
      useNativeDriver: true,
    }).start(() => navigation.goBack())
  }

  const proceed = () => {
    if (!pickedAction) return
    navigation.navigate("MicroAction")
  }

  return (
    <View style={s.root}>
      {/* blurred feed behind */}
      <View style={s.feedWrap}>
        <FakeFeed />
        <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        <View style={s.scrim} />
      </View>

      {/* bottom sheet */}
      <Animated.View
        style={[s.sheet, { transform: [{ translateY: sheetY }], paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        {/* grabber */}
        <View style={s.grabber} />

        {/* coral banner */}
        <View style={s.banner}>
          <Animated.View style={[s.bannerDot, { opacity: dotOpacity }]} />
          <View style={{ flex: 1 }}>
            <Text style={s.bannerEyebrow}>23 minutes · scrolling</Text>
            <Text style={s.bannerSub}>Your usual stretch is 8 min.</Text>
          </View>
        </View>

        {/* huge headline */}
        <View style={s.headline}>
          <Text style={s.headlineText}>
            Still <Text style={s.headlineAccent}>there?</Text>
          </Text>
          <Text style={s.headlineSub}>
            How do you actually feel right now? Just a gentle tap — no pressure.
          </Text>
        </View>

        {/* actions */}
        <View style={s.actionsWrap}>
          <Text style={s.actionsEyebrow}>Something gentle</Text>
          <View style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: N.border }}>
            {ACTIONS.map(a => {
              const active = pickedAction === a.key
              return (
                <TouchableOpacity
                  key={a.key}
                  onPress={() => setPickedAction(a.key)}
                  style={s.actionRow}
                  activeOpacity={0.7}
                >
                  <View style={[s.actionCheck, active && s.actionCheckActive]}>
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
                  <Text style={s.actionLabel}>{a.label}</Text>
                  <Text style={s.actionMeta}>{a.meta}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* CTA */}
        <View style={s.ctaWrap}>
          <TouchableOpacity
            onPress={proceed}
            activeOpacity={pickedAction ? 0.85 : 1}
            style={[
              s.cta,
              { backgroundColor: pickedAction ? N.sage : N.sageMist },
            ]}
          >
            <Text style={[s.ctaText, { color: pickedAction ? "#FFFFFF" : N.muted }]}>
              {pickedAction ? "Begin" : "Pick something first"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={dismiss} style={s.ghostBtn}>
            <Text style={s.ghostText}>Keep scrolling · that's okay too</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

// ─── Fake social feed ─────────────────────────────────────────────────────────

function FakeFeed() {
  return (
    <View style={f.root}>
      <View style={f.header}>
        <Text style={f.feedTitle}>feed</Text>
        <View style={f.headerIcons}>
          {[0, 1, 2].map(i => (
            <View key={i} style={f.iconCircle} />
          ))}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {POSTS.map((p, i) => (
          <View key={i} style={f.post}>
            <View style={f.postHeader}>
              <View style={f.avatar} />
              <View style={{ flex: 1 }}>
                <Text style={f.username}>{p.who}</Text>
                <Text style={f.postTime}>{p.dur} ago</Text>
              </View>
              <Text style={f.more}>•••</Text>
            </View>
            <View
              style={[
                f.postImage,
                {
                  backgroundColor: STRIPE_COLORS[p.tone]?.[0] ?? "#EEE",
                },
              ]}
            />
            <View style={f.postFooter}>
              <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke={N.ink} strokeWidth={1.5}>
                <Path d="M11 18s-7-4.5-7-9a4 4 0 017-2.5A4 4 0 0118 9c0 4.5-7 9-7 9z" />
              </Svg>
              <Svg width={22} height={22} viewBox="0 0 22 22" fill="none" stroke={N.ink} strokeWidth={1.5}>
                <Path d="M3 4h16v11H8l-5 3V4z" />
              </Svg>
              <Text style={f.likes}>{p.likes}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

const f = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 60,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: N.edge,
  },
  feedTitle: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 24,
    color: N.ink,
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 14,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.4,
    borderColor: N.muted,
  },
  post: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: N.edge,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: N.sand,
  },
  username: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: N.ink,
  },
  postTime: {
    fontSize: 11,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
  },
  more: {
    color: N.muted,
    fontSize: 18,
  },
  postImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: N.edge,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  likes: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
    color: N.ink,
    marginLeft: "auto",
  },
})

// ─── Sheet styles ─────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  feedWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(20,18,14,0.4)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: N.stone,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -20 },
    shadowOpacity: 0.25,
    shadowRadius: 60,
    overflow: "hidden",
  },
  grabber: {
    width: 44,
    height: 4,
    backgroundColor: N.border,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
  },
  banner: {
    backgroundColor: N.coral,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 28,
    paddingVertical: 18,
    marginTop: 16,
  },
  bannerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
  },
  bannerEyebrow: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: "#FFFFFF",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  bannerSub: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  headline: {
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 14,
  },
  headlineText: {
    fontSize: 72,
    fontFamily: "DMSans_700Bold",
    lineHeight: 66,
    letterSpacing: -3,
    color: N.ink,
  },
  headlineAccent: {
    color: N.sage,
    textDecorationLine: "underline",
    textDecorationColor: N.sage,
  },
  headlineSub: {
    fontSize: 15,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
    marginTop: 20,
    maxWidth: 300,
    lineHeight: 22,
  },
  actionsWrap: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 12,
  },
  actionsEyebrow: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: N.border,
  },
  actionCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: N.border,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  actionCheckActive: {
    backgroundColor: N.sage,
    borderColor: N.sage,
  },
  actionLabel: {
    flex: 1,
    fontSize: 18,
    fontFamily: "DMSans_500Medium",
    color: N.ink,
    letterSpacing: -0.3,
  },
  actionMeta: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 18,
    color: N.muted,
  },
  ctaWrap: {
    paddingHorizontal: 28,
    paddingTop: 18,
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
  ghostBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  ghostText: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
  },
})
