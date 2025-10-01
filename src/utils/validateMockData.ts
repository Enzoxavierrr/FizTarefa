import { mockAgents } from '../mocks/agentsMock'
import { AgentSchema } from '../schemas/agentSchema'

export function validateMockData() {
  console.log('🔍 Validando dados mockados...')

  const errors: string[] = []

  mockAgents.forEach((agent, index) => {
    try {
      AgentSchema.parse(agent)
      console.log(` Agente ${index + 1} (${agent.name}) - Válido`)
    } catch (error) {
      const errorMessage = ` Agente ${index + 1} (${agent.name}) - Erro: ${error}`
      errors.push(errorMessage)
      console.error(errorMessage)
    }
  })

  if (errors.length === 0) {
    console.log('🎉 Todos os dados mockados estão válidos!')
  } else {
    console.log(`⚠️ ${errors.length} erro(s) encontrado(s)`)
  }

  return errors
}

if (typeof window !== 'undefined') {
  validateMockData()
}
