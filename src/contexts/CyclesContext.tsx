import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react'

import { cyclesReducer } from '../reducers/cycles'
import { ActionTypes, Cycle } from '../reducers/cycles/types'

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
  const [cyclesState, dispatch] = useReducer(cyclesReducer, {
    cycles: [],
    activeCycleId: null,
  })
  const { cycles, activeCycleId } = cyclesState
  const [secondsPassed, setSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCycleAsFinished() {
    dispatch({
      type: ActionTypes.MARK_CYCLE_AS_FINISHED,
      payload: {
        activeCycleId,
      },
    })
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
    dispatch({
      type: ActionTypes.ADD_NEW_CYCLE,
      payload: {
        newCycle,
      },
    })
  }

  function interruptCycle() {
    dispatch({
      type: ActionTypes.INTERRUPT_CYCLE,
      payload: {
        activeCycleId,
      },
    })
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
