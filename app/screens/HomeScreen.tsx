import { useRef, useState } from "react"
import {
  Animated,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import Svg, { Circle, Path } from "react-native-svg"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useAppState } from "@/context/AppStateContext"
import type { MainStackScreenProps } from "@/navigators/navigationTypes"
import { N } from "@/theme/niche"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function formatDate(): string {
  const now = new Date()
  return `${DAYS[now.getDay()]} · ${now.getDate()} ${MONTHS[now.getMonth()]}`
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning."
  if (h < 17) return "Good afternoon."
  return "Good evening."
}

// Maps each intention key to a two-line phrase shown in the sage band.
const INTENTION_PHRASES: Record<string, string> = {
  calm:       "Let things be slow today.\nNo rush, no force.",
  focus:      "One thing at a time.\nThat's enough.",
  presence:   "Notice what's here.\nJust this moment.",
  connection: "Be with the people\naround you today.",
}

// Underlined accent word for each intention (shown inline in the phrase).
const INTENTION_ACCENTS: Record<string, { before: string; accent: string; after: string }> = {
  calm:       { before: "Let things be ", accent: "slow",      after: " today.\nNo rush, no force." },
  focus:      { before: "",                accent: "One thing", after: " at a time.\nThat's enough." },
  presence:   { before: "Notice what's ",  accent: "here",     after: ".\nJust this moment." },
  connection: { before: "Be with the ",    accent: "people",   after: "\naround you today." },
}

function wordFor(v: number, words: string[]): string {
  return words[Math.min(words.length - 1, Math.floor((v / 100) * words.length))]
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export function HomeScreen({ navigation }: MainStackScreenProps<"Home">) {
  const insets = useSafeAreaInsets()
  const {
    selectedIntentions,
    pausesToday,
    pausesThisWeek,
    weekTotal,
    todayIndex,
  } = useAppState()

  const [mood, setMood] = useState(62)
  const [energy, setEnergy] = useState(66)

  const moodWord   = wordFor(mood,   ["heavy", "foggy", "okay", "spacious"])
  const energyWord = wordFor(energy, ["low",   "soft",  "steady", "lively"])

  // Pick the first selected intention for the sage band (or fall back to calm).
  const activeIntention = selectedIntentions[0] ?? "calm"
  const phrase = INTENTION_ACCENTS[activeIntention] ?? INTENTION_ACCENTS.calm

  return (
    <View style={[s.root, { backgroundColor: N.stone }]}>
      <View style={{ height: insets.top }} />

      {/* top row */}
      <View style={s.topRow}>
        <Text style={s.dateLabel}>{formatDate()}</Text>
        <TouchableOpacity
          style={s.menuBtn}
          onPress={() => navigation.navigate("Settings")}
          hitSlop={8}
        >
          <Svg width={14} height={14} viewBox="0 0 14 14">
            <Circle cx={7} cy={3} r={1.4} fill={N.muted} />
            <Circle cx={7} cy={7} r={1.4} fill={N.muted} />
            <Circle cx={7} cy={11} r={1.4} fill={N.muted} />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom + 20, 40) }}
      >
        {/* greeting */}
        <View style={s.greeting}>
          <Text style={s.greetingName}>{getGreeting()}</Text>
          <Text style={s.greetingTagline}>Glad you're here.</Text>
        </View>

        {/* full-bleed sage band — today's intention */}
        <View style={s.sageBand}>
          <View style={s.sageBlob} />
          <Text style={s.intentionLabel}>Today's intention</Text>
          <Text style={s.intentionText}>
            {phrase.before}
            <Text style={s.intentionAccent}>{phrase.accent}</Text>
            {phrase.after}
          </Text>
          <TouchableOpacity
            style={s.swapBtn}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={s.swapBtnText}>Change intention</Text>
            <Svg width={11} height={11} viewBox="0 0 11 11">
              <Path
                d="M3 1l4 4.5L3 10"
                fill="none"
                stroke="#FFF"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* mood + energy sliders */}
        <View style={s.sliderSection}>
          <View style={s.sliderHeader}>
            <Text style={s.sliderSectionLabel}>How are you, really?</Text>
            <Text style={s.dragHint}>Drag to set</Text>
          </View>
          <NSlider
            label="Mood"
            value={mood}
            onChange={setMood}
            accent={N.coral}
            track={N.blush}
            leftWord="heavy"
            rightWord="spacious"
            readout={moodWord}
          />
          <View style={{ height: 28 }} />
          <NSlider
            label="Energy"
            value={energy}
            onChange={setEnergy}
            accent={N.sage}
            track={N.sageMist}
            leftWord="low"
            rightWord="lively"
            readout={energyWord}
          />
        </View>

        {/* THIS WEEK feature card */}
        <View style={s.weekCardWrap}>
          <View style={s.weekCard}>
            <Text style={s.weekEyebrow}>This week</Text>
            <View style={s.weekPullquote}>
              <Text style={s.weekNumber}>{weekTotal}</Text>
              <View style={s.weekCaption}>
                <Text style={s.weekCaptionMain}>mindful pauses</Text>
                <Text style={s.weekCaptionSub}>
                  {"Today you've taken "}
                  <Text style={{ color: N.sage, fontFamily: "DMSans_500Medium" }}>
                    {pausesToday}
                  </Text>
                  {`.`}
                </Text>
              </View>
            </View>
            <View style={s.weekDivider} />
            <View style={s.weekDots}>
              {pausesThisWeek.map((c, i) => {
                const isToday = i === todayIndex
                return (
                  <View key={i} style={s.weekDayCol}>
                    <View style={s.weekDotStack}>
                      {Array.from({ length: 5 }).map((_, k) => (
                        <View
                          key={k}
                          style={[
                            s.dot,
                            {
                              backgroundColor: k < c
                                ? isToday ? N.sage : N.ink
                                : N.sand,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text
                      style={[
                        s.dayLabel,
                        {
                          color: isToday ? N.sage : N.muted,
                          fontFamily: isToday ? "DMSans_600SemiBold" : "DMSans_400Regular",
                        },
                      ]}
                    >
                      {DAY_LABELS[i]}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        {/* bottom quote */}
        <View style={s.quote}>
          <Text style={s.quoteText}>"What you notice grows."</Text>
        </View>

        {/* quick access */}
        <View style={s.quickRow}>
          <TouchableOpacity
            style={s.quickBtn}
            onPress={() => navigation.navigate("Interrupt")}
          >
            <Text style={s.quickBtnText}>Soft interrupt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.quickBtn}
            onPress={() => navigation.navigate("MicroAction")}
          >
            <Text style={s.quickBtnText}>Three breaths</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

// ─── Custom slider ────────────────────────────────────────────────────────────

interface NSliderProps {
  label: string
  value: number
  onChange: (v: number) => void
  accent: string
  track: string
  leftWord: string
  rightWord: string
  readout: string
}

function NSlider({ label, value, onChange, accent, track, leftWord, rightWord, readout }: NSliderProps) {
  const trackWidth = useRef(0)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        if (trackWidth.current > 0) {
          onChange(Math.max(0, Math.min(100, (e.nativeEvent.locationX / trackWidth.current) * 100)))
        }
      },
      onPanResponderMove: (e) => {
        if (trackWidth.current > 0) {
          onChange(Math.max(0, Math.min(100, (e.nativeEvent.locationX / trackWidth.current) * 100)))
        }
      },
    })
  ).current

  return (
    <View>
      <View style={sl.labelRow}>
        <Text style={sl.label}>{label}</Text>
        <Text style={[sl.readout, { color: accent }]}>{readout}</Text>
      </View>
      <View
        {...panResponder.panHandlers}
        style={sl.hitArea}
        onLayout={e => { trackWidth.current = e.nativeEvent.layout.width }}
      >
        <View style={[sl.track, { backgroundColor: track }]} />
        <View style={[sl.filled, { width: `${value}%` as `${number}%`, backgroundColor: accent }]} />
        <View style={[sl.thumbWrap, { left: `${value}%` as `${number}%` }]}>
          <Animated.View style={[sl.pulse, { backgroundColor: accent }]} />
          <View style={[sl.thumb, { backgroundColor: accent }]} />
        </View>
      </View>
      <View style={sl.ends}>
        <Text style={sl.endWord}>{leftWord}</Text>
        <Text style={sl.endWord}>{rightWord}</Text>
      </View>
    </View>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sl = StyleSheet.create({
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    color: N.ink,
    letterSpacing: -0.2,
  },
  readout: {
    fontSize: 15,
    fontFamily: "DMSans_500Medium",
  },
  hitArea: {
    height: 36,
    justifyContent: "center",
    position: "relative",
  },
  track: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 4,
  },
  filled: {
    position: "absolute",
    left: 0,
    height: 8,
    borderRadius: 4,
  },
  thumbWrap: {
    position: "absolute",
    top: "50%",
    marginTop: -11,
    marginLeft: -11,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    opacity: 0.16,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  ends: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  endWord: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: N.faint,
  },
})

const s = StyleSheet.create({
  root: { flex: 1 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 14,
    paddingBottom: 4,
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: N.border,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 30,
  },
  greetingName: {
    fontSize: 38,
    fontFamily: "DMSans_600SemiBold",
    color: N.ink,
    lineHeight: 40,
    letterSpacing: -1,
  },
  greetingTagline: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 26,
    color: N.muted,
    marginTop: 6,
  },
  sageBand: {
    backgroundColor: N.sage,
    padding: 28,
    paddingBottom: 32,
    overflow: "hidden",
    position: "relative",
  },
  sageBlob: {
    position: "absolute",
    right: -60,
    top: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  intentionLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  intentionText: {
    fontSize: 26,
    fontFamily: "DMSans_600SemiBold",
    color: "#FFFFFF",
    lineHeight: 31,
    letterSpacing: -0.5,
    maxWidth: 300,
  },
  intentionAccent: {
    color: "#FFFFFF",
    textDecorationLine: "underline",
    textDecorationColor: "rgba(255,255,255,0.6)",
  },
  swapBtn: {
    marginTop: 22,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  swapBtnText: {
    fontSize: 13,
    fontFamily: "DMSans_500Medium",
    color: "#FFFFFF",
  },
  sliderSection: {
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 24,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 22,
  },
  sliderSectionLabel: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  dragHint: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
    color: N.faint,
  },
  weekCardWrap: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    paddingTop: 14,
  },
  weekCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 28,
    paddingBottom: 30,
    borderWidth: 1,
    borderColor: N.edge,
    overflow: "hidden",
  },
  weekEyebrow: {
    fontSize: 11,
    fontFamily: "DMSans_500Medium",
    color: N.muted,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 18,
  },
  weekPullquote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 28,
  },
  weekNumber: {
    fontSize: 108,
    fontFamily: "DMSans_700Bold",
    color: N.ink,
    lineHeight: 92,
    letterSpacing: -3,
  },
  weekCaption: {
    flex: 1,
    paddingTop: 18,
  },
  weekCaptionMain: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 22,
    color: N.ink,
    lineHeight: 25,
  },
  weekCaptionSub: {
    fontSize: 13,
    fontFamily: "DMSans_400Regular",
    color: N.muted,
    marginTop: 6,
    lineHeight: 20,
  },
  weekDivider: {
    height: 1,
    backgroundColor: N.edge,
    marginBottom: 22,
  },
  weekDots: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  weekDayCol: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  weekDotStack: {
    flexDirection: "column-reverse",
    gap: 4,
    height: 64,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  quote: {
    paddingHorizontal: 28,
    paddingBottom: 24,
  },
  quoteText: {
    fontFamily: "InstrumentSerif_400Regular_Italic",
    fontSize: 22,
    color: N.muted,
    lineHeight: 29,
    maxWidth: 280,
  },
  quickRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 22,
    paddingBottom: 8,
  },
  quickBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: N.border,
    alignItems: "center",
    justifyContent: "center",
  },
  quickBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    color: N.ink,
  },
})
