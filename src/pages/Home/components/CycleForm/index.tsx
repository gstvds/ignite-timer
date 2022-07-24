import { useFormContext } from 'react-hook-form'
import { DurationInput, FormContainer, TaskInput } from './styles'

import { useCycles } from '../../../../contexts/CyclesContext'

export function CycleForm() {
  const { activeCycle } = useCycles()
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        id="task"
        placeholder="Dê um nome para o seu projeto"
        disabled={!!activeCycle}
        {...register('task')}
      />

      <label htmlFor="duration">durante</label>
      <DurationInput
        type="number"
        id="duration"
        placeholder="00"
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle}
        {...register('duration', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
