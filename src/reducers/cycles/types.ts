export interface Cycle {
  id: string
  task: string
  duration: number
  startDate: Date
  interruptedDate?: Date
  endDate?: Date
}

export interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export enum ActionTypes {
  ADD_NEW_CYCLE = 'cycle/ADD_NEW_CYCLE',
  INTERRUPT_CYCLE = 'cycle/INTERRUPT_CYCLE',
  MARK_CYCLE_AS_FINISHED = 'cycle/MARK_CYCLE_AS_FINISHED',
}
