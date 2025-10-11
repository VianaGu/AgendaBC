export interface Cliente {
  id: string
  nome: string
  telefone: string
  cpf: string
  dataCadastro?: Date
  created_at?: string
}

export interface Agendamento {
  id: string
  cliente_id: string
  clienteNome?: string
  data_agendamento: string
  hora_agendamento: string
  servico_id?: string
  servico?: string
  preco: number
  status: "agendado" | "concluido" | "cancelado"
  observacoes?: string
  created_at?: string
}

export interface FotoPortfolio {
  id: string
  titulo: string
  descricao?: string
  imagem_url: string
  created_at?: string
}

export interface Servico {
  id: string
  nome: string
  preco: number
  duracao: number // em minutos
  created_at?: string
}

const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36)

// Funções de Clientes
export const getClientes = (): Cliente[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("clientes")
  return data ? JSON.parse(data) : []
}

export const saveCliente = (cliente: Omit<Cliente, "id" | "created_at">): Cliente => {
  const novoCliente: Cliente = {
    ...cliente,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  const clientes = getClientes()
  clientes.push(novoCliente)
  localStorage.setItem("clientes", JSON.stringify(clientes))
  return novoCliente
}

export const updateCliente = (id: string, cliente: Partial<Cliente>): Cliente | null => {
  const clientes = getClientes()
  const index = clientes.findIndex((c) => c.id === id)
  if (index === -1) return null

  clientes[index] = { ...clientes[index], ...cliente }
  localStorage.setItem("clientes", JSON.stringify(clientes))
  return clientes[index]
}

export const deleteCliente = (id: string): boolean => {
  const clientes = getClientes()
  const filtered = clientes.filter((c) => c.id !== id)
  localStorage.setItem("clientes", JSON.stringify(filtered))
  return true
}

export const checkCpfExists = (cpf: string, excludeId?: string): boolean => {
  const clientes = getClientes()
  return clientes.some((c) => c.cpf === cpf && c.id !== excludeId)
}

// Funções de Agendamentos
export const getAgendamentos = (): Agendamento[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("agendamentos")
  const agendamentos = data ? JSON.parse(data) : []
  const clientes = getClientes()
  const servicos = getServicos()

  return agendamentos.map((ag: Agendamento) => {
    const cliente = clientes.find((c) => c.id === ag.cliente_id)
    const servico = servicos.find((s) => s.id === ag.servico_id)
    return {
      ...ag,
      clienteNome: cliente?.nome,
      servico: servico?.nome,
      preco: servico?.preco || ag.preco || 0,
    }
  })
}

export const saveAgendamento = (
  agendamento: Omit<Agendamento, "id" | "created_at" | "clienteNome" | "servico">,
): Agendamento => {
  const servicos = getServicos()
  const servico = servicos.find((s) => s.id === agendamento.servico_id)

  const novoAgendamento: Agendamento = {
    ...agendamento,
    id: generateId(),
    preco: servico?.preco || agendamento.preco || 0,
    created_at: new Date().toISOString(),
  }

  const agendamentos = getAgendamentos()
  agendamentos.push(novoAgendamento)
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos))

  const clientes = getClientes()
  const cliente = clientes.find((c) => c.id === agendamento.cliente_id)

  return {
    ...novoAgendamento,
    clienteNome: cliente?.nome,
    servico: servico?.nome,
  }
}

export const updateAgendamento = (id: string, agendamento: Partial<Agendamento>): Agendamento | null => {
  const agendamentos = getAgendamentos()
  const index = agendamentos.findIndex((a) => a.id === id)
  if (index === -1) return null

  agendamentos[index] = { ...agendamentos[index], ...agendamento }
  localStorage.setItem("agendamentos", JSON.stringify(agendamentos))
  return agendamentos[index]
}

export const deleteAgendamento = (id: string): boolean => {
  const agendamentos = getAgendamentos()
  const filtered = agendamentos.filter((a) => a.id !== id)
  localStorage.setItem("agendamentos", JSON.stringify(filtered))
  return true
}

export const getAgendamentosHoje = (): Agendamento[] => {
  const hoje = new Date().toISOString().split("T")[0]
  return getAgendamentos().filter((ag) => ag.data_agendamento === hoje)
}

export const getReceitaTotal = (): number => {
  const agendamentos = getAgendamentos()
  return agendamentos.filter((ag) => ag.status === "concluido").reduce((total, ag) => total + ag.preco, 0)
}

// Funções de Serviços
export const getServicos = (): Servico[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("servicos")
  return data ? JSON.parse(data) : []
}

export const saveServico = (servico: Omit<Servico, "id" | "created_at">): Servico => {
  const novoServico: Servico = {
    ...servico,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  const servicos = getServicos()
  servicos.push(novoServico)
  localStorage.setItem("servicos", JSON.stringify(servicos))
  return novoServico
}

export const updateServico = (id: string, servico: Partial<Servico>): Servico | null => {
  const servicos = getServicos()
  const index = servicos.findIndex((s) => s.id === id)
  if (index === -1) return null

  servicos[index] = { ...servicos[index], ...servico }
  localStorage.setItem("servicos", JSON.stringify(servicos))
  return servicos[index]
}

export const deleteServico = (id: string): boolean => {
  const servicos = getServicos()
  const filtered = servicos.filter((s) => s.id !== id)
  localStorage.setItem("servicos", JSON.stringify(filtered))
  return true
}

// Funções de Portfólio
export const getPortfolio = (): FotoPortfolio[] => {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("portfolio")
  return data ? JSON.parse(data) : []
}

export const savePortfolio = (foto: Omit<FotoPortfolio, "id" | "created_at">): FotoPortfolio => {
  const novaFoto: FotoPortfolio = {
    ...foto,
    id: generateId(),
    created_at: new Date().toISOString(),
  }
  const portfolio = getPortfolio()
  portfolio.push(novaFoto)
  localStorage.setItem("portfolio", JSON.stringify(portfolio))
  return novaFoto
}

export const deletePortfolio = (id: string): boolean => {
  const portfolio = getPortfolio()
  const filtered = portfolio.filter((f) => f.id !== id)
  localStorage.setItem("portfolio", JSON.stringify(filtered))
  return true
}
