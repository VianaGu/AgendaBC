import { createClient } from "@/lib/supabase/client"

export interface Cliente {
  id: string
  nome: string
  telefone: string
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

export const getClientes = async (): Promise<Cliente[]> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("clientes").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar clientes:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return []
  }
}

export const saveCliente = async (cliente: Omit<Cliente, "id" | "created_at">): Promise<Cliente | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("clientes").insert([cliente]).select().single()

    if (error) {
      console.error("Erro ao salvar cliente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return null
  }
}

export const updateCliente = async (id: string, cliente: Partial<Cliente>): Promise<Cliente | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("clientes").update(cliente).eq("id", id).select().single()

    if (error) {
      console.error("Erro ao atualizar cliente:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return null
  }
}

export const deleteCliente = async (id: string): Promise<boolean> => {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("clientes").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar cliente:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return false
  }
}

export const getAgendamentos = async (): Promise<Agendamento[]> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("agendamentos")
      .select(`
        *,
        clientes(nome),
        servicos(nome, preco)
      `)
      .order("data_agendamento", { ascending: true })
      .order("hora_agendamento", { ascending: true })

    if (error) {
      console.error("Erro ao buscar agendamentos:", error)
      return []
    }

    return (
      data?.map((item) => ({
        id: item.id,
        cliente_id: item.cliente_id,
        clienteNome: item.clientes?.nome,
        data_agendamento: item.data_agendamento,
        hora_agendamento: item.hora_agendamento,
        servico_id: item.servico_id,
        servico: item.servicos?.nome,
        preco: item.servicos?.preco || item.preco || 0,
        status: item.status,
        observacoes: item.observacoes,
        created_at: item.created_at,
      })) || []
    )
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return []
  }
}

export const saveAgendamento = async (
  agendamento: Omit<Agendamento, "id" | "created_at" | "clienteNome" | "servico">,
): Promise<Agendamento | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("agendamentos")
      .insert([agendamento])
      .select(`
      *,
      clientes(nome),
      servicos(nome, preco)
    `)
      .single()

    if (error) {
      console.error("Erro ao salvar agendamento:", error)
      return null
    }

    return {
      id: data.id,
      cliente_id: data.cliente_id,
      clienteNome: data.clientes?.nome,
      data_agendamento: data.data_agendamento,
      hora_agendamento: data.hora_agendamento,
      servico_id: data.servico_id,
      servico: data.servicos?.nome,
      preco: data.servicos?.preco || data.preco || 0,
      status: data.status,
      observacoes: data.observacoes,
      created_at: data.created_at,
    }
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return null
  }
}

export const updateAgendamento = async (id: string, agendamento: Partial<Agendamento>): Promise<Agendamento | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("agendamentos")
      .update(agendamento)
      .eq("id", id)
      .select(`
      *,
      clientes(nome),
      servicos(nome, preco)
    `)
      .single()

    if (error) {
      console.error("Erro ao atualizar agendamento:", error)
      return null
    }

    return {
      id: data.id,
      cliente_id: data.cliente_id,
      clienteNome: data.clientes?.nome,
      data_agendamento: data.data_agendamento,
      hora_agendamento: data.hora_agendamento,
      servico_id: data.servico_id,
      servico: data.servicos?.nome,
      preco: data.servicos?.preco || data.preco || 0,
      status: data.status,
      observacoes: data.observacoes,
      created_at: data.created_at,
    }
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return null
  }
}

export const deleteAgendamento = async (id: string): Promise<boolean> => {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("agendamentos").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar agendamento:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return false
  }
}

export const getServicos = async (): Promise<Servico[]> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("servicos").select("*").order("nome", { ascending: true })

    if (error) {
      console.error("Erro ao buscar serviços:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return []
  }
}

export const saveServico = async (servico: Omit<Servico, "id" | "created_at">): Promise<Servico | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("servicos").insert([servico]).select().single()

    if (error) {
      console.error("Erro ao salvar serviço:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return null
  }
}

export const updateServico = async (id: string, servico: Partial<Servico>): Promise<Servico | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("servicos").update(servico).eq("id", id).select().single()

    if (error) {
      console.error("Erro ao atualizar serviço:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return null
  }
}

export const deleteServico = async (id: string): Promise<boolean> => {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("servicos").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar serviço:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return false
  }
}

export const getPortfolio = async (): Promise<FotoPortfolio[]> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar portfólio:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return []
  }
}

export const savePortfolio = async (foto: Omit<FotoPortfolio, "id" | "created_at">): Promise<FotoPortfolio | null> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from("portfolio").insert([foto]).select().single()

    if (error) {
      console.error("Erro ao salvar foto do portfólio:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return null
  }
}

export const deletePortfolio = async (id: string): Promise<boolean> => {
  try {
    const supabase = createClient()
    const { error } = await supabase.from("portfolio").delete().eq("id", id)

    if (error) {
      console.error("Erro ao deletar foto do portfólio:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return false
  }
}

export const getAgendamentosHoje = async (): Promise<Agendamento[]> => {
  try {
    const hoje = new Date().toISOString().split("T")[0]
    const supabase = createClient()
    const { data, error } = await supabase
      .from("agendamentos")
      .select(`
        *,
        clientes(nome),
        servicos(nome, preco)
      `)
      .eq("data_agendamento", hoje)
      .order("hora_agendamento", { ascending: true })

    if (error) {
      console.error("Erro ao buscar agendamentos de hoje:", error)
      return []
    }

    return (
      data?.map((item) => ({
        id: item.id,
        cliente_id: item.cliente_id,
        clienteNome: item.clientes?.nome,
        data_agendamento: item.data_agendamento,
        hora_agendamento: item.hora_agendamento,
        servico_id: item.servico_id,
        servico: item.servicos?.nome,
        preco: item.servicos?.preco || item.preco || 0,
        status: item.status,
        observacoes: item.observacoes,
        created_at: item.created_at,
      })) || []
    )
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return []
  }
}

export const getReceitaTotal = async (): Promise<number> => {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("agendamentos")
      .select(`
        servicos(preco)
      `)
      .eq("status", "concluido")

    if (error) {
      console.error("Erro ao calcular receita total:", error)
      return 0
    }

    return data?.reduce((total, item) => total + (item.servicos?.preco || 0), 0) || 0
  } catch (error) {
    console.error("Erro ao conectar com Supabase:", error)
    return 0
  }
}
