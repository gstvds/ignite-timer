import { useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { CycleForm } from './components/CycleForm'
import { Countdown } from './components/Countdown'
import { CyclesContext, Cycle } from '../../contexts/CyclesContext'

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  duration: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type CreateNewCycleForm = zod.infer<typeof newCycleFormSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const newCycleForm = useForm<CreateNewCycleForm>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: '',
      duration: 0,
    },
  })
  const { handleSubmit, watch, reset } = newCycleForm
  const task = watch('task')
  const isSubmitDisabled = !task

  function handleCreateNewCycle({ task, duration }: CreateNewCycleForm) {
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
    reset()
  }

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

  function handleInterruptCycle() {
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
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider
          value={{
            activeCycle,
            activeCycleId,
            secondsPassed,
            markCycleAsFinished,
            updateSecondsPassed,
          }}
        >
          <FormProvider {...newCycleForm}>
            <CycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleInterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
