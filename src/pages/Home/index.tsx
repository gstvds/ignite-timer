import { useEffect, useState } from 'react'
import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { differenceInSeconds } from 'date-fns'

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  DurationInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  duration: zod
    .number()
    .min(1, 'O ciclo precisa ser de no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type CreateNewCycleForm = zod.infer<typeof newCycleFormSchema>

interface Cycle {
  id: string
  task: string
  duration: number
  startDate: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  const cycleDurationInSeconds = activeCycle ? activeCycle.duration * 60 : 0
  const cycleTotalSeconds = activeCycle
    ? cycleDurationInSeconds - secondsPassed
    : 0
  const currentCycleMinutesDirty = Math.floor(cycleTotalSeconds / 60)
  const currentCycleSecondsDirty = cycleTotalSeconds % 60

  const currentCycleMinutes = String(currentCycleMinutesDirty).padStart(2, '0')
  const currentCycleSeconds = String(currentCycleSecondsDirty).padStart(2, '0')
  const { register, handleSubmit, watch, reset } = useForm<CreateNewCycleForm>({
    resolver: zodResolver(newCycleFormSchema),
    defaultValues: {
      task: '',
      duration: 0,
    },
  })
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

    setCycles((previousCycles) => [...previousCycles, newCycle])
    reset()
  }

  useEffect(() => {
    if (activeCycle) {
      setInterval(() => {
        setSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
    }
  }, [activeCycle])

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1"></option>
            <option value="Projeto 2"></option>
            <option value="Banana"></option>
          </datalist>

          <label htmlFor="duration">durante</label>
          <DurationInput
            type="number"
            id="duration"
            placeholder="00"
            step={5}
            min={1}
            max={60}
            {...register('duration', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{currentCycleMinutes[0]}</span>
          <span>{currentCycleMinutes[1]}</span>
          <Separator>:</Separator>
          <span>{currentCycleSeconds[0]}</span>
          <span>{currentCycleSeconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
