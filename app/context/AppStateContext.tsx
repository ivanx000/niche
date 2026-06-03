import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo } from "react"
import { useMMKVNumber, useMMKVString } from "react-native-mmkv"

export interface PauseRecord {
  timestamp: number   // Unix ms
  actionType: string  // 'breathe' | 'stretch' | 'water'
}

type AppStateContextType = {
  selectedIntentions: string[]
  setIntentions: (intentions: string[]) => void

  dailyGoal: number
  setDailyGoal: (goal: number) => void

  pauseLog: PauseRecord[]
  addPause: (actionType: string) => void

  pausesToday: number
  pausesThisWeek: number[]   // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  weekTotal: number
  todayIndex: number         // 0=Mon … 6=Sun
}

const AppStateContext = createContext<AppStateContextType | null>(null)

function computeWeek(log: PauseRecord[]): number[] {
  const now = new Date()
  const dow = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((dow + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  const counts = [0, 0, 0, 0, 0, 0, 0]
  for (const r of log) {
    const diffMs = r.timestamp - monday.getTime()
    const day = Math.floor(diffMs / 86_400_000)
    if (day >= 0 && day < 7) counts[day]++
  }
  return counts
}

function todayDayIndex(): number {
  return (new Date().getDay() + 6) % 7
}

export const AppStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const [intentionsRaw, setIntentionsRaw] = useMMKVString("AppState.selectedIntentions")
  const [storedGoal, setStoredGoal] = useMMKVNumber("AppState.dailyGoal")
  const [pauseLogRaw, setPauseLogRaw] = useMMKVString("AppState.pauseLog")

  const selectedIntentions = useMemo<string[]>(() => {
    if (!intentionsRaw) return ["calm", "presence"]
    try { return JSON.parse(intentionsRaw) } catch { return ["calm", "presence"] }
  }, [intentionsRaw])

  const dailyGoal = storedGoal ?? 3

  const pauseLog = useMemo<PauseRecord[]>(() => {
    if (!pauseLogRaw) return []
    try { return JSON.parse(pauseLogRaw) } catch { return [] }
  }, [pauseLogRaw])

  const pausesThisWeek = useMemo(() => computeWeek(pauseLog), [pauseLog])

  const todayIndex = useMemo(() => todayDayIndex(), [])

  const pausesToday = pausesThisWeek[todayIndex] ?? 0

  const weekTotal = useMemo(() => pausesThisWeek.reduce((s, n) => s + n, 0), [pausesThisWeek])

  const setIntentions = useCallback((intentions: string[]) => {
    setIntentionsRaw(JSON.stringify(intentions))
  }, [setIntentionsRaw])

  const setDailyGoal = useCallback((goal: number) => {
    setStoredGoal(goal)
  }, [setStoredGoal])

  const addPause = useCallback((actionType: string) => {
    const record: PauseRecord = { timestamp: Date.now(), actionType }
    const updated = [...pauseLog, record]
    setPauseLogRaw(JSON.stringify(updated))
  }, [pauseLog, setPauseLogRaw])

  const value = useMemo<AppStateContextType>(
    () => ({
      selectedIntentions,
      setIntentions,
      dailyGoal,
      setDailyGoal,
      pauseLog,
      addPause,
      pausesToday,
      pausesThisWeek,
      weekTotal,
      todayIndex,
    }),
    [
      selectedIntentions, setIntentions,
      dailyGoal, setDailyGoal,
      pauseLog, addPause,
      pausesToday, pausesThisWeek, weekTotal, todayIndex,
    ],
  )

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export const useAppState = () => {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error("useAppState must be used within an AppStateProvider")
  return ctx
}
