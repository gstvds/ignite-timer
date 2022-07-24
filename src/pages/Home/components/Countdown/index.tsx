import { differenceInSeconds } from 'date-fns'
import { useEffect } from 'react'
import { useCycles } from '../../../../contexts/CyclesContext'
import { CountdownContainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycleId,
    activeCycle,
    secondsPassed,
    updateSecondsPassed,
    markCycleAsFinished,
  } = useCycles()
  const cycleDurationInSeconds = activeCycle ? activeCycle.duration * 60 : 0
  const cycleTotalSeconds = activeCycle
    ? cycleDurationInSeconds - secondsPassed
    : 0
  const currentCycleMinutesDirty = Math.floor(cycleTotalSeconds / 60)
  const currentCycleSecondsDirty = cycleTotalSeconds % 60

  const currentCycleMinutes = String(currentCycleMinutesDirty).padStart(2, '0')
  const currentCycleSeconds = String(currentCycleSecondsDirty).padStart(2, '0')

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const difference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (difference >= cycleTotalSeconds) {
          markCycleAsFinished()
          updateSecondsPassed(cycleTotalSeconds)
          clearInterval(interval)
        } else {
          updateSecondsPassed(difference)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    cycleTotalSeconds,
    activeCycleId,
    markCycleAsFinished,
    updateSecondsPassed,
  ])

  useEffect(() => {
    if (activeCycle)
      document.title = `${currentCycleMinutes}:${currentCycleSeconds}`
  }, [activeCycle, currentCycleMinutes, currentCycleSeconds])

  return (
    <CountdownContainer>
      <span>{currentCycleMinutes[0]}</span>
      <span>{currentCycleMinutes[1]}</span>
      <Separator>:</Separator>
      <span>{currentCycleSeconds[0]}</span>
      <span>{currentCycleSeconds[1]}</span>
    </CountdownContainer>
  )
}
