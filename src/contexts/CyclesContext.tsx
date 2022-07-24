import {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  useState,
} from 'react'

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

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      switch (action.type) {
        case 'ADD_NEW_CYCLE':
          return {
            ...state,
            cycles: [...state.cycles, action.payload.newCycle],
            activeCycleId: action.payload.newCycle.id,
          }
        case 'INTERRUPT_CYCLE':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === state.activeCycleId) {
                return { ...cycle, interruptedDate: new Date() }
              }
              return cycle
            }),
            activeCycleId: null,
          }
        case 'MARK_CYCLE_AS_FINISHED':
          return {
            ...state,
            cycles: state.cycles.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, endDate: new Date() }
              }
              return cycle
            }),
          }
        default:
          return state
      }
    },
    { cycles: [], activeCycleId: null },
  )
  const { cycles, activeCycleId } = cyclesState
  const [secondsPassed, setSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function markCycleAsFinished() {
    dispatch({
      type: 'MARK_CYCLE_AS_FINISHED',
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
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
  }

  function interruptCycle() {
    dispatch({
      type: 'INTERRUPT_CYCLE',
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
