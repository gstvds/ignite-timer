import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { CycleForm } from './components/CycleForm'
import { Countdown } from './components/Countdown'
import { useCycles } from '../../contexts/CyclesContext'

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  duration: zod
    .number()
    .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type CreateNewCycleForm = zod.infer<typeof newCycleFormSchema>

export function Home() {
  const { activeCycle, createCycle, interruptCycle } = useCycles()
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

  function handleCreateNewCycle(data: CreateNewCycleForm) {
    createCycle(data)
    reset()
  }

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <CycleForm />
        </FormProvider>
        <Countdown />
        {activeCycle ? (
          <StopCountdownButton type="button" onClick={interruptCycle}>
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
