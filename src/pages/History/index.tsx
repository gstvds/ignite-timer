import { formatDistanceToNow } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { useCycles } from '../../contexts/CyclesContext'
import { HistoryContainer, HistoryList, Status } from './styles'

export function History() {
  const { cycles } = useCycles()

  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.duration} minutos</td>
                <td>
                  {formatDistanceToNow(cycle.startDate, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </td>
                <td>
                  {cycle.endDate && (
                    <Status status="completed">Concluído</Status>
                  )}
                  {cycle.interruptedDate && (
                    <Status status="canceled">Interrompido</Status>
                  )}
                  {!cycle.endDate && !cycle.interruptedDate && (
                    <Status status="ongoing">Em andamento</Status>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
