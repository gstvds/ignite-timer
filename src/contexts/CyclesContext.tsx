import { createContext, ReactNode, useContext, useState } from 'react'

interface CreateCycleData {
  task: string
  duration: number
}

export interface Cycle {
  id: string
  task: string
  duration: number
  startDate: Date
  interruptedDate?: Date
  endDate?: Date
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle?: Cycle
  secondsPassed: number
  activeCycleId: string | null
  markCycleAsFinished: () => void
  updateSecondsPassed: (seconds: number) => void
  createCycle: (payload: CreateCycleData) => void
  interruptCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCycleAsFinished() {
    setCycles((previousCycles) =>
      previousCycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, endDate: new Date() }
        }
        return cycle
      }),
    )
  }

  function updateSecondsPassed(seconds: number) {
    setSecondsPassed(seconds)
  }

  function createCycle({ task, duration }: CreateCycleData) {
    const id = new Date().getTime().toString()

    const newCycle: Cycle = {
      id,
      task,
      duration,
      startDate: new Date(),
    }
    setActiveCycleId(id)
    setSecondsPassed(0)

    setCycles((previousCycles) => [...previousCycles, newCycle])
  }

  function interruptCycle() {
    setCycles((previousCycle) =>
      previousCycle.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        }
        return cycle
      }),
    )
    setActiveCycleId(null)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        secondsPassed,
        markCycleAsFinished,
        updateSecondsPassed,
        createCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export function useCycles() {
  return useContext(CyclesContext)
}
