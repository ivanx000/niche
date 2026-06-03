import { useEffect, useRef, useState } from "react"
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Svg, { Path, Circle } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppState } from "@/context/AppStateContext"
import type { MainStackScreenProps } from "@/navigators/navigationTypes"
import { N } from "@/theme/niche"

const TOTAL_CYCLES = 3

const SEQUENCE = [
  { phase: "inhale" as const, ms: 4000 },
  { phase: "hold"   as const, ms: 2000 },
  { phase: "exhale" as const, ms: 6000 },
]

const PHASE_LABEL: Record<string, string> = {
  inhale: "Breathe in",
  hold:   "Hold",
  exhale: "Breathe out",
}

const PHASE_DUR: Record<string, string> = {
  inhale: "4 sec",
  hold:   "2 sec",
  exhale: "6 sec",
}

export function MicroActionScreen({ navigation, route }: MainStackScreenProps<"MicroAction">) {
  const insets = useSafeAreaInsets()
  const { addPause } = useAppState()
  const [done, setDone] = useState(false)

  const actionType = (route.params as { actionType?: string } | undefined)?.actionType ?? "breathe"

  const handleDone = () => {
    addPause(actionType)
    setDone(true)
  }

  const startBreathing = () => setDone(false)

  if (done) {
    return <CompletionMoment insets={insets} onAgain={startBreathing} onHome={() => navigation.navigate("Home")} />
  }

  return <BreathingView insets={insets} onBack={() => navigation.goBack()} onDone={handleDone} />
}

// ─── Breathing view ───────────────────────────────────────────────────────────

interface BreathingViewProps {
  insets: { top: number; bottom: number }
  onBack: () => void
  onDone: () => void
}

function BreathingView({ insets, onBack, onDone }: BreathingViewProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [cycle, setCycle] = useState(1)
  const orbScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    let cancelled = false
    let step = 0
    let currentCycle = 1

    const runStep = () => {
      if (cancelled) return
      const s = SEQUENCE[step]
      setPhase(s.phase)

      const toScale = s.phase === "inhale" ? 1 : s.phase === "hold" ? 1 : 0.55

      Animated.timing(orbScale, {
        toValue: toScale,
        duration: s.ms,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (cancelled) return
        step++
        if (step >= SEQUENCE.length) {
          step = 0
          currentCycle++
          if (currentCycle > TOTAL_CYCLES) {
            onDone()
            return
          }
          setCycle(currentCycle)
        }
        runStep()
      })
    }

    runStep()
    return () => {
      cancelled = true
      orbScale.stopAnimation()
    }
  }, [])

  return (
    <View style={[b.root, { backgroundColor: N.stone }]}>
      <View style={{ height: insets.top }} />

      <View style={b.topRow}>
        <TouchableOpacity style={b.backBtn} onPress={onBack} hitSlop={8}>
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
        <Text style={b.cycleLabel}>
          Breath{" "}
          <Text style={{ color: N.ink }}>{cycle}</Text>
          {" of "}
          {TOTAL_CYCLES}
        </Text>
        <View style={{ width: 38 }} />
      </View>

      <View style={b.center}>
        <View style={b.orbContainer}>
          {/* outer reference ring */}
          <View style={b.orbRing} />
          {/* breathing orb */}
          <Animated.View style={[b.orb, { transform: [{ scale: orbScale }] }]}>
            <Text style={b.orbPhase}>{PHASE_LABEL[phase]}</Text>
            <Text style={b.orbDur}>{PHASE_DUR[phase]}</Text>
          </Animated.View>
        </View>

        {/* cycle dots */}
        <View style={b.cycleDots}>
          {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
            <View
              key={i}
              style={[
                b.cycleDot,
                {
                  backgroundColor: i < cycle ? N.sage : N.border,
                  opacity: i < cycle ? 1 : 0.4,
                },
              ]}
            />
          ))}
        </View>

        <Text style={b.hint}>
          Follow the circle. If your mind wanders, that's part of it.
        </Text>
      </View>

      <View style={[b.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity style={b.earlyBtn} onPress={onDone}>
          <Text style={b.earlyText}>I'm done early</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

// ─── Completion moment ────────────────────────────────────────────────────────

interface CompletionProps {
  insets: { top: number; bottom: number }
  onAgain: () => void
  onHome: () => void
}

// SVG stroke length for M30,52 L46,68 L74,38 ≈ 67
const CHECK_LEN = 75

function CompletionMoment({ insets, onAgain, onHome }: CompletionProps) {
  const [stage, setStage] = useState(0)
  const circleScale = useRef(new Animated.Value(0)).current
  const checkProgress = useRef(new Animated.Value(CHECK_LEN)).current
  const textOpacity = useRef(new Animated.Value(0)).current
  const textTranslate = useRef(new Animated.Value(8)).current
  const footerOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const t1 = setTimeout(() => {
      // 1. Scale circle in
      setStage(1)
      Animated.timing(circleScale, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }).start(() => {
        // 2. Draw checkmark
        setStage(2)
        Animated.timing(checkProgress, {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }).start(() => {
          // 3. Fade in text + footer
          setTimeout(() => {
            setStage(3)
            Animated.parallel([
              Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
              Animated.timing(textTranslate, { toValue: 0, duration: 300, useNativeDriver: true }),
              Animated.timing(footerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]).start()
          }, 200)
        })
      })
    }, 60)
    return () => clearTimeout(t1)
  }, [])

  return (
    <View style={[c.root, { backgroundColor: N.stone }]}>
      <View style={{ height: insets.top }} />

      <View style={c.topRow}>
        <TouchableOpacity style={c.closeBtn} onPress={onHome} hitSlop={8}>
          <Svg width={12} height={12} viewBox="0 0 12 12">
            <Path
              d="M2 2l8 8M10 2l-8 8"
              stroke={N.muted}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={c.center}>
        {/* animated sage circle with checkmark */}
        <Animated.View style={[c.circleWrap, { transform: [{ scale: circleScale }] }]}>
          <View style={c.circle} />
          <View style={c.innerHalo} />
          {/* SVG checkmark drawn via dashoffset */}
          <Svg
            viewBox="0 0 104 104"
            width={220}
            height={220}
            style={StyleSheet.absoluteFill}
          >
            <AnimatedPath
              d="M30,52 L46,68 L74,38"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={`${CHECK_LEN}`}
              strokeDashoffset={checkProgress}
            />
          </Svg>
        </Animated.View>

        {/* "That's it." */}
        <Animated.View
          style={[
            c.textWrap,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslate }],
            },
          ]}
        >
          <Text style={c.thatText}>That's it.</Text>
          <Text style={c.thatSub}>
            Three slow breaths is plenty. Notice if anything in your body shifted — or didn't.
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          c.footer,
          { opacity: footerOpacity, paddingBottom: Math.max(insets.bottom, 24) },
        ]}
      >
        <TouchableOpacity style={c.homeCta} onPress={onHome}>
          <Text style={c.homeCtaText}>Back to home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={c.againBtn} onPress={onAgain}>
          <Text style={c.againText}>One more round</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

// Animated SVG Path wrapper (stroke-dashoffset uses Animated.Value)
const AnimatedPath = Animated.createAnimatedComponent(Path)

// ─── Breathing styles ─────────────────────────────────────────────────────────

const b = StyleSheet.create({
  root: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: N.border,
    alignItems: "center",
    justifyContent: "center",
  },
  cycleLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  orbContainer: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  orbRing: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: N.edge,
  },
  orb: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: N.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  orbPhase: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 36,
    color: "#FFFFFF",
  },
  orbDur: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  cycleDots: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
  },
  cycleDot: {
    width: 36,
    height: 3,
    borderRadius: 2,
  },
  hint: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    textAlign: "center",
    maxWidth: 280,
    color: N.muted,
    lineHeight: 21,
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  earlyBtn: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: N.border,
    alignItems: "center",
    justifyContent: "center",
  },
  earlyText: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: N.ink,
    letterSpacing: -0.2,
  },
})

// ─── Completion styles ────────────────────────────────────────────────────────

const c = StyleSheet.create({
  root: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: N.border,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  circleWrap: {
    width: 220,
    height: 220,
    marginBottom: 56,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 110,
    backgroundColor: N.sage,
  },
  innerHalo: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  textWrap: {
    alignItems: "center",
    width: "100%",
  },
  thatText: {
    fontSize: 64,
    fontFamily: "DMSans_700Bold",
    lineHeight: 64,
    letterSpacing: -2,
    color: N.ink,
  },
  thatSub: {
    fontSize: 16,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
    lineHeight: 25,
    marginTop: 32,
    maxWidth: 280,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  homeCta: {
    height: 56,
    borderRadius: 14,
    backgroundColor: N.sage,
    alignItems: "center",
    justifyContent: "center",
  },
  homeCtaText: {
    fontSize: 16,
    fontFamily: "DMSans_500Medium",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  againBtn: {
    alignItems: "center",
    paddingVertical: 14,
  },
  againText: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
  },
})
