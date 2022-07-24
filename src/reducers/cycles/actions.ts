import { ActionTypes, Cycle } from './types'

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function interruptCycleAction() {
  return {
    type: ActionTypes.INTERRUPT_CYCLE,
  }
}

export function markCycleAsFinishedAction() {
  return {
    type: ActionTypes.MARK_CYCLE_AS_FINISHED,
  }
}
