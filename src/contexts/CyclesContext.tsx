import { differenceInSeconds } from 'date-fns'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  addNewCycleAction,
  interruptCycleAction,
  markCycleAsFinishedAction,
} from '../reducers/cycles/actions'

import { cyclesReducer } from '../reducers/cycles/reducer'
import { Cycle } from '../reducers/cycles/types'

interface CreateCycleData {
  task: string
  duration: number
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
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const stored = localStorage.getItem('@ignite-timer:cycles-state-1.0.0')
      if (stored) {
        return JSON.parse(stored)
      }

      return { cycles: [], activeCycleId: null }
    },
  )
  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const [secondsPassed, setSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  function markCycleAsFinished() {
    dispatch(markCycleAsFinishedAction)
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
    setSecondsPassed(0)
    dispatch(addNewCycleAction(newCycle))
  }

  function interruptCycle() {
    dispatch(interruptCycleAction)
  }

  useEffect(() => {
    const state = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', state)
  }, [cyclesState])

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
