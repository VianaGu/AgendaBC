export interface Cliente {
  id: string
  nome: string
  telefone: string
  dataCadastro: Date
}

export interface Agendamento {
  id: string
  clienteId: string
  clienteNome: string
  data: Date
  hora: string
  servico: string
  preco: number
  status: "agendado" | "concluido" | "cancelado"
}

export interface FotoPortfolio {
  id: string
  url: string
  descricao: string
  dataUpload: Date
}

export interface Servico {
  id: string
  nome: string
  preco: number
  duracao: number // em minutos
}

// Dados mockados para demonstração
const clientesMock: Cliente[] = [
  {
    id: "1",
    nome: "Maria Silva",
    telefone: "(11) 99999-9999",
    dataCadastro: new Date("2024-01-15"),
  },
  {
    id: "2",
    nome: "Ana Santos",
    telefone: "(11) 88888-8888",
    dataCadastro: new Date("2024-02-10"),
  },
  {
    id: "3",
    nome: "Julia Costa",
    telefone: "(11) 77777-7777",
    dataCadastro: new Date("2024-03-05"),
  },
]

const agendamentosMock: Agendamento[] = [
  {
    id: "1",
    clienteId: "1",
    clienteNome: "Maria Silva",
    data: new Date(),
    hora: "09:00",
    servico: "Esmaltação Gel",
    preco: 45.0,
    status: "agendado",
  },
  {
    id: "2",
    clienteId: "2",
    clienteNome: "Ana Santos",
    data: new Date(),
    hora: "14:00",
    servico: "Alongamento + Decoração",
    preco: 80.0,
    status: "agendado",
  },
  {
    id: "3",
    clienteId: "3",
    clienteNome: "Julia Costa",
    data: new Date(Date.now() - 86400000), // ontem
    hora: "16:00",
    servico: "Manicure Simples",
    preco: 25.0,
    status: "concluido",
  },
]

const portfolioMock: FotoPortfolio[] = [
  {
    id: "1",
    url: "/placeholder-nj0e1.png",
    descricao: "Nail art com flores delicadas",
    dataUpload: new Date("2024-03-01"),
  },
  {
    id: "2",
    url: "/elegant-french-manicure.png",
    descricao: "Francesinha clássica elegante",
    dataUpload: new Date("2024-03-05"),
  },
  {
    id: "3",
    url: "/colorful-geometric-nails.png",
    descricao: "Design geométrico colorido",
    dataUpload: new Date("2024-03-10"),
  },
]

const servicosMock: Servico[] = [
  {
    id: "1",
    nome: "Manicure Simples",
    preco: 25.0,
    duracao: 30,
  },
  {
    id: "2",
    nome: "Esmaltação Gel",
    preco: 45.0,
    duracao: 45,
  },
  {
    id: "3",
    nome: "Alongamento + Decoração",
    preco: 80.0,
    duracao: 90,
  },
  {
    id: "4",
    nome: "Francesinha",
    preco: 35.0,
    duracao: 40,
  },
  {
    id: "5",
    nome: "Nail Art",
    preco: 60.0,
    duracao: 60,
  },
]

// Funções para gerenciar dados localmente
export const getClientes = (): Cliente[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nail-designer-clientes")
    return stored ? JSON.parse(stored) : clientesMock
  }
  return clientesMock
}

export const saveClientes = (clientes: Cliente[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("nail-designer-clientes", JSON.stringify(clientes))
  }
}

export const getAgendamentos = (): Agendamento[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nail-designer-agendamentos")
    return stored ? JSON.parse(stored) : agendamentosMock
  }
  return agendamentosMock
}

export const saveAgendamentos = (agendamentos: Agendamento[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("nail-designer-agendamentos", JSON.stringify(agendamentos))
  }
}

export const getPortfolio = (): FotoPortfolio[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nail-designer-portfolio")
    return stored ? JSON.parse(stored) : portfolioMock
  }
  return portfolioMock
}

export const savePortfolio = (portfolio: FotoPortfolio[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("nail-designer-portfolio", JSON.stringify(portfolio))
  }
}

export const getServicos = (): Servico[] => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nail-designer-servicos")
    return stored ? JSON.parse(stored) : servicosMock
  }
  return servicosMock
}

export const saveServicos = (servicos: Servico[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("nail-designer-servicos", JSON.stringify(servicos))
  }
}

// Funções utilitárias
export const getAgendamentosHoje = (): Agendamento[] => {
  const agendamentos = getAgendamentos()
  const hoje = new Date()
  return agendamentos.filter((agendamento) => {
    const dataAgendamento = new Date(agendamento.data)
    return dataAgendamento.toDateString() === hoje.toDateString()
  })
}

export const getReceitaTotal = (): number => {
  const agendamentos = getAgendamentos()
  return agendamentos
    .filter((agendamento) => agendamento.status === "concluido")
    .reduce((total, agendamento) => total + agendamento.preco, 0)
}
