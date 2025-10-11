"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Users,
  DollarSign,
  Camera,
  Plus,
  Edit,
  Trash2,
  User,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Lock,
  Unlock,
  Play,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react"
import {
  getClientes,
  saveCliente,
  updateCliente,
  deleteCliente,
  getAgendamentos,
  saveAgendamento,
  updateAgendamento,
  deleteAgendamento,
  getPortfolio,
  savePortfolio,
  deletePortfolio,
  getAgendamentosHoje,
  getReceitaTotal,
  getServicos,
  saveServico,
  updateServico,
  deleteServico,
  checkCpfExists,
  type Cliente,
  type Agendamento,
  type FotoPortfolio,
  type Servico,
} from "@/lib/data"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [stats, setStats] = useState({
    totalClientes: 0,
    agendamentosHoje: 0,
    receitaTotal: 0,
    totalFotos: 0,
    receitaMes: 0,
    clientesNovos: 0,
  })
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null)
  const [isAgendamentoDialogOpen, setIsAgendamentoDialogOpen] = useState(false)
  const [agendamentosHoje, setAgendamentosHoje] = useState<Agendamento[]>([])
  const [clienteAtual, setClienteAtual] = useState<{
    cliente: string
    agendamentos: (Agendamento & { servicoNome?: string; servicoPreco?: number })[]
  } | null>(null)

  const updateStats = () => {
    try {
      const clientes = getClientes()
      const agendamentosHojeData = getAgendamentosHoje()
      const receitaTotal = getReceitaTotal()
      const portfolio = getPortfolio()

      setAgendamentosHoje(agendamentosHojeData)

      const hoje = new Date()
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

      // Para receita do mês e clientes novos, vamos usar dados locais por enquanto
      const receitaMes = receitaTotal // Simplificado por enquanto
      const clientesNovos = clientes.length // Simplificado por enquanto

      setStats({
        totalClientes: clientes.length,
        agendamentosHoje: agendamentosHojeData.length,
        receitaTotal,
        totalFotos: portfolio.length,
        receitaMes,
        clientesNovos,
      })
    } catch (error) {
      console.error("Erro ao atualizar estatísticas:", error)
    }
  }

  useEffect(() => {
    updateStats()
  }, [])

  const updateAgendamentoStatus = (id: string, status: "concluido" | "cancelado") => {
    try {
      updateAgendamento(id, { status })
      setAgendamentosHoje((prevAgendamentos) =>
        prevAgendamentos.map((agendamento) => (agendamento.id === id ? { ...agendamento, status } : agendamento)),
      )
      if (clienteAtual?.cliente === id) {
        setClienteAtual(null)
      }
      updateStats()
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error)
    }
  }

  const iniciarAtendimento = (agendamento: Agendamento) => {
    try {
      const servicos = getServicos()
      const agendamentos = getAgendamentos()

      // Buscar todos os agendamentos do mesmo cliente na mesma data
      const agendamentosDoCliente = agendamentos.filter(
        (a) =>
          a.cliente_id === agendamento.cliente_id &&
          a.data_agendamento === agendamento.data_agendamento &&
          a.status === "agendado",
      )

      // Enriquecer cada agendamento com dados do serviço
      const agendamentosCompletos = agendamentosDoCliente.map((ag) => {
        const servico = servicos.find((s) => s.id === ag.servico_id)
        return {
          ...ag,
          servicoNome: servico?.nome || "Serviço não encontrado",
          servicoPreco: servico?.preco || 0,
        }
      })

      setClienteAtual({
        cliente: agendamento.clienteNome,
        agendamentos: agendamentosCompletos,
      })
    } catch (error) {
      console.error("Erro ao buscar dados dos serviços:", error)
    }
  }

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Melhorando responsividade do cabeçalho para mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-rose-900 mb-2">Dashboard</h1>
            <p className="text-rose-600">Visão geral do seu negócio</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-rose-600">Hoje</p>
            <p className="text-lg font-semibold text-rose-900">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {clienteAtual && (
          <Card className="border-2 border-green-300 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente em Atendimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-green-600 font-medium">Cliente</p>
                <p className="text-xl font-semibold text-green-900">{clienteAtual.cliente}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-green-600 font-medium mb-3">Serviços Contratados</p>
                <div className="space-y-2">
                  {clienteAtual.agendamentos.map((agendamento, index) => (
                    <div
                      key={agendamento.id}
                      className="flex justify-between items-center bg-white p-3 rounded-lg border border-green-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-green-900">{agendamento.servicoNome}</p>
                        <p className="text-sm text-green-600">{agendamento.horario}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-900">R$ {agendamento.servicoPreco?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-green-800">Total do Atendimento:</p>
                    <p className="text-xl font-bold text-green-900">
                      R$ {clienteAtual.agendamentos.reduce((total, ag) => total + (ag.servicoPreco || 0), 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    clienteAtual.agendamentos.forEach((ag) => {
                      updateAgendamentoStatus(ag.id, "concluido")
                    })
                    setClienteAtual(null)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Finalizar Atendimento
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setClienteAtual(null)}
                  className="border-green-300 text-green-700 hover:bg-green-50 flex-1"
                >
                  Pausar Atendimento
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cards de estatísticas com melhor responsividade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-rose-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-600">Total de Clientes</p>
                  <p className="text-2xl sm:text-3xl font-bold text-rose-900">{stats.totalClientes}</p>
                </div>
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-600">Agendamentos Hoje</p>
                  <p className="text-2xl sm:text-3xl font-bold text-rose-900">{stats.agendamentosHoje}</p>
                </div>
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-600">Receita Total</p>
                  <p className="text-2xl sm:text-3xl font-bold text-rose-900">R$ {stats.receitaTotal.toFixed(2)}</p>
                </div>
                <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-rose-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-rose-600">Fotos Portfólio</p>
                  <p className="text-2xl sm:text-3xl font-bold text-rose-900">{stats.totalFotos}</p>
                </div>
                <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-rose-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumo rápido com badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Metas do Mês
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-rose-600">Receita</span>
                  <span className="text-rose-900 font-medium">R$ {stats.receitaMes.toFixed(2)} / R$ 3.000</span>
                </div>
                <Progress value={(stats.receitaMes / 3000) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-rose-600">Novos Clientes</span>
                  <span className="text-rose-900 font-medium">{stats.clientesNovos} / 10</span>
                </div>
                <Progress value={(stats.clientesNovos / 10) * 100} className="h-2" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary" className="bg-rose-100 text-rose-700">
                  {stats.agendamentosHoje > 0 ? "Dia Ativo" : "Dia Livre"}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {stats.receitaTotal > 1000 ? "Meta Atingida" : "Em Progresso"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Agendamentos de Hoje */}
          <Card>
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agendamentos de Hoje ({agendamentosHoje.filter((a) => a.status !== "concluido").length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agendamentosHoje.filter((agendamento) => agendamento.status !== "concluido").length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum agendamento pendente para hoje</p>
              ) : (
                <div className="space-y-3">
                  {agendamentosHoje
                    .filter((agendamento) => agendamento.status !== "concluido")
                    .map((agendamento) => (
                      <div
                        key={agendamento.id}
                        className={`
                      p-3 sm:p-4 rounded-lg border-l-4 
                      ${agendamento.status === "cancelado" ? "bg-red-50 border-red-400" : "bg-blue-50 border-blue-400"}
                    `}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                              <span className="font-semibold text-gray-900">{agendamento.hora_agendamento}</span>
                              <span className="text-gray-700">{agendamento.clienteNome}</span>
                            </div>
                            {agendamento.observacoes && (
                              <p className="text-sm text-gray-600 mt-1">{agendamento.observacoes}</p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {agendamento.status === "agendado" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => iniciarAtendimento(agendamento)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  disabled={clienteAtual !== null}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Iniciar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => updateAgendamentoStatus(agendamento.id, "concluido")}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateAgendamentoStatus(agendamento.id, "cancelado")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {agendamento.status === "concluido" && (
                              <span className="text-green-600 font-medium text-sm">✓ Concluído</span>
                            )}
                            {agendamento.status === "cancelado" && (
                              <span className="text-red-600 font-medium text-sm">✗ Cancelado</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center gap-2 text-lg">
              <Camera className="h-5 w-5" />
              Portfólio Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <img
                src="/classic-french-manicure.png"
                alt="Classic French Manicure"
                className="aspect-square object-cover rounded-md"
              />
              <img src="/floral-nail-art.png" alt="Floral Nail Art" className="aspect-square object-cover rounded-md" />
              <img
                src="/glitter-nail-art-sparkly.png"
                alt="Glitter Nail Art Sparkly"
                className="aspect-square object-cover rounded-md"
              />
              <img
                src="/minimalist-nude-nails.png"
                alt="Minimalist Nude Nails"
                className="aspect-square object-cover rounded-md"
              />
              <img
                src="/ombre-nail-gradient.png"
                alt="Ombre Nail Gradient"
                className="aspect-square object-cover rounded-md"
              />
              <img src="/placeholder-6unsb.png" alt="Placeholder" className="aspect-square object-cover rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleScheduleFromClient = (clienteId: string) => {
    setSelectedClienteId(clienteId)
    setActiveTab("agendamentos")
    setIsAgendamentoDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "outline"}
              onClick={() => setActiveTab("dashboard")}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Dashboard
            </Button>
            <Button
              variant={activeTab === "clientes" ? "default" : "outline"}
              onClick={() => setActiveTab("clientes")}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Clientes
            </Button>
            <Button
              variant={activeTab === "agendamentos" ? "default" : "outline"}
              onClick={() => setActiveTab("agendamentos")}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Agendamentos
            </Button>
            <Button
              variant={activeTab === "servicos" ? "default" : "outline"}
              onClick={() => setActiveTab("servicos")}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Serviços
            </Button>
            <Button
              variant={activeTab === "portfolio" ? "default" : "outline"}
              onClick={() => setActiveTab("portfolio")}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Portfólio
            </Button>
          </div>
        </nav>

        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "clientes" && <CadastroClientes onUpdate={updateStats} onSchedule={handleScheduleFromClient} />}
        {activeTab === "agendamentos" && (
          <SistemaAgendamentos
            onUpdate={updateStats}
            selectedClienteId={selectedClienteId}
            isDialogOpen={isAgendamentoDialogOpen}
            onDialogClose={() => setIsAgendamentoDialogOpen(false)}
          />
        )}
        {activeTab === "servicos" && <GerenciamentoServicos onUpdate={updateStats} />}
        {activeTab === "portfolio" && <GaleriaPortfolio onUpdate={updateStats} />}
      </div>
    </div>
  )
}

function CadastroClientes({
  onUpdate,
  onSchedule,
}: { onUpdate?: () => void; onSchedule: (clienteId: string) => void }) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [historicoCliente, setHistoricoCliente] = useState<{
    cliente: Cliente
    agendamentos: Agendamento[]
  } | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    cpf: "",
  })

  const loadClientes = () => {
    const clientesData = getClientes()
    setClientes(clientesData)
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.telefone || !formData.cpf) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const cpfLimpo = formData.cpf.replace(/\D/g, "")
    if (cpfLimpo.length !== 11) {
      alert("CPF deve ter 11 dígitos")
      return
    }

    try {
      const cpfExiste = checkCpfExists(formData.cpf, editingCliente?.id)
      if (cpfExiste) {
        alert("Já existe um cliente cadastrado com este CPF")
        return
      }

      if (editingCliente) {
        const clienteAtualizado = updateCliente(editingCliente.id, formData)
        if (clienteAtualizado) {
          setClientes(clientes.map((c) => (c.id === editingCliente.id ? clienteAtualizado : c)))
        }
      } else {
        const novoCliente = saveCliente(formData)
        if (novoCliente) {
          setClientes([...clientes, novoCliente])
        }
      }

      setFormData({ nome: "", telefone: "", cpf: "" })
      setEditingCliente(null)
      onUpdate?.()
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      alert("Erro ao salvar cliente")
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      cpf: cliente.cpf,
    })
  }

  const formatCpf = (value: string) => {
    const cpf = value.replace(/\D/g, "")
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCpf(e.target.value)
    setFormData({ ...formData, cpf: formatted })
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      const sucesso = deleteCliente(id)
      if (sucesso) {
        setClientes(clientes.filter((c) => c.id !== id))
        onUpdate?.()
      }
    }
  }

  const clientesFiltrados = clientes.filter((cliente) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      cliente.nome.toLowerCase().includes(searchLower) ||
      cliente.telefone.includes(searchTerm) ||
      cliente.cpf.includes(searchTerm)
    )
  })

  const carregarHistorico = (cliente: Cliente) => {
    try {
      const agendamentos = getAgendamentos()
      const agendamentosCliente = agendamentos
        .filter((ag) => ag.cliente_id === cliente.id && ag.status === "concluido")
        .sort((a, b) => {
          // Ordenar do mais recente para o mais antigo
          const dataA = new Date(a.data_agendamento + "T" + a.hora_agendamento)
          const dataB = new Date(b.data_agendamento + "T" + b.hora_agendamento)
          return dataB.getTime() - dataA.getTime()
        })

      setHistoricoCliente({
        cliente,
        agendamentos: agendamentosCliente,
      })
    } catch (error) {
      console.error("Erro ao carregar histórico:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-900 mb-2">Cadastro de Clientes</h1>
          <p className="text-rose-600">Gerencie sua base de clientes</p>
        </div>
      </div>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">{editingCliente ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={handleCpfChange}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                {editingCliente ? "Atualizar" : "Cadastrar"}
              </Button>
              {editingCliente && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingCliente(null)
                    setFormData({ nome: "", telefone: "", cpf: "" })
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Lista de Clientes</CardTitle>
          <div className="mt-4">
            <Input
              placeholder="Pesquisar por nome, telefone ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientesFiltrados.length === 0 ? (
              <p className="text-rose-600 text-center py-4">
                {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
              </p>
            ) : (
              clientesFiltrados.map((cliente) => (
                <div
                  key={cliente.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50 rounded-lg gap-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-rose-900">{cliente.nome}</p>
                    <p className="text-rose-600 text-sm">{cliente.telefone}</p>
                    <p className="text-rose-500 text-xs">CPF: {cliente.cpf}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => carregarHistorico(cliente)}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Histórico
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSchedule(cliente.id)}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      Agendar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(cliente)}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(cliente.id)}
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={historicoCliente !== null} onOpenChange={() => setHistoricoCliente(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Histórico de Procedimentos - {historicoCliente?.cliente.nome}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {historicoCliente?.agendamentos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhum procedimento realizado ainda</p>
            ) : (
              historicoCliente?.agendamentos.map((agendamento) => (
                <Card key={agendamento.id} className="border-rose-100">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700">Concluído</Badge>
                          <span className="text-sm text-gray-600">
                            {new Date(agendamento.data_agendamento).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-rose-900">💅 {agendamento.servico}</p>
                          <p className="text-sm text-rose-600">🕐 {agendamento.hora_agendamento}</p>
                          <p className="text-sm text-rose-600">💰 R$ {agendamento.preco.toFixed(2)}</p>
                          {agendamento.observacoes && (
                            <p className="text-sm text-gray-600 italic">📝 {agendamento.observacoes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {historicoCliente && historicoCliente.agendamentos.length > 0 && (
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-rose-900">Total de Procedimentos:</span>
                  <span className="text-lg font-bold text-rose-900">{historicoCliente.agendamentos.length}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-medium text-rose-900">Valor Total Gasto:</span>
                  <span className="text-lg font-bold text-rose-900">
                    R$ {historicoCliente.agendamentos.reduce((total, ag) => total + ag.preco, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SistemaAgendamentos({
  onUpdate,
  selectedClienteId,
  isDialogOpen,
  onDialogClose,
}: { onUpdate?: () => void; selectedClienteId?: string; isDialogOpen: boolean; onDialogClose: () => void }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [servicos, setServicos] = useState<Servico[]>([])
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isBlockingMode, setIsBlockingMode] = useState(false)
  const [blockedDates, setBlockedDates] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("blockedDates")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [showBlockDialog, setShowBlockDialog] = useState(false)
  const [formData, setFormData] = useState({
    cliente_id: selectedClienteId || "",
    data_agendamento: "",
    hora_agendamento: "",
    servico_ids: [] as string[],
    observacoes: "",
  })

  const loadData = () => {
    try {
      const agendamentosData = getAgendamentos()
      const clientesData = getClientes()
      const servicosData = getServicos()

      setAgendamentos(agendamentosData)
      setClientes(clientesData)
      setServicos(servicosData)

      // Carregar datas bloqueadas do localStorage
      const blocked = localStorage.getItem("blockedDates")
      if (blocked) {
        setBlockedDates(JSON.parse(blocked))
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedClienteId) {
      setFormData((prev) => ({ ...prev, cliente_id: selectedClienteId }))
    }
  }, [selectedClienteId])

  const handleStatusChange = (agendamentoId: string, novoStatus: "concluido" | "cancelado") => {
    try {
      const agendamentoAtualizado = updateAgendamento(agendamentoId, { status: novoStatus })
      if (agendamentoAtualizado) {
        setAgendamentos(agendamentos.map((a) => (a.id === agendamentoId ? agendamentoAtualizado : a)))
        onUpdate?.()
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const formatDateForInput = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      throw new Error("Data inválida fornecida para formatDate")
    }
    return date.toISOString().split("T")[0]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.data_agendamento) {
      alert("Por favor, selecione uma data para o agendamento")
      return
    }

    const dataAgendamento = new Date(formData.data_agendamento)
    if (isNaN(dataAgendamento.getTime())) {
      alert("Data de agendamento inválida")
      return
    }

    if (isDateBlocked(dataAgendamento)) {
      alert("Esta data está bloqueada para agendamentos!")
      return
    }

    if (!formData.cliente_id || !formData.hora_agendamento || formData.servico_ids.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    try {
      for (const servico_id of formData.servico_ids) {
        const agendamentoData = {
          cliente_id: formData.cliente_id,
          data_agendamento: formData.data_agendamento,
          hora_agendamento: formData.hora_agendamento,
          servico_id,
          observacoes: formData.observacoes,
          status: "agendado" as const,
          preco: 0, // O preço será buscado na lista de serviços do cliente atual
        }

        if (editingAgendamento) {
          updateAgendamento(editingAgendamento.id, agendamentoData)
        } else {
          saveAgendamento(agendamentoData)
        }
      }

      loadData()
      onDialogClose()
      resetForm()
      onUpdate?.()
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error)
      alert("Erro ao salvar agendamento")
    }
  }

  const handleEdit = (agendamento: Agendamento) => {
    setEditingAgendamento(agendamento)
    setFormData({
      cliente_id: agendamento.cliente_id,
      data_agendamento: agendamento.data_agendamento,
      hora_agendamento: agendamento.hora_agendamento,
      servico_ids: [agendamento.servico_id || ""],
      observacoes: agendamento.observacoes || "",
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      const sucesso = deleteAgendamento(id)
      if (sucesso) {
        setAgendamentos(agendamentos.filter((a) => a.id !== id))
        onUpdate?.()
      }
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Dias do mês anterior para completar a primeira semana
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i)
      days.push({ date: prevDate, isCurrentMonth: false })
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true })
    }

    // Dias do próximo mês para completar a última semana
    const remainingDays = 42 - days.length // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false })
    }

    return days
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const getAgendamentosForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return agendamentos.filter((ag) => ag.data_agendamento === dateStr)
  }

  const isDateBlocked = (date: Date) => {
    return blockedDates.includes(formatDate(date))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const resetForm = () => {
    setFormData({
      cliente_id: selectedClienteId || "",
      data_agendamento: "",
      hora_agendamento: "",
      servico_ids: [],
      observacoes: "",
    })
    setEditingAgendamento(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-900 mb-2">Calendário de Agendamentos</h1>
          <p className="text-rose-600">Visualize e gerencie sua agenda mensal</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant={isBlockingMode ? "destructive" : "outline"}
            onClick={() => setIsBlockingMode(!isBlockingMode)}
            className="w-full sm:w-auto"
          >
            {isBlockingMode ? (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Sair do Modo Bloqueio
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Modo Bloqueio
              </>
            )}
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
        <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAgendamento ? "Editar Agendamento" : "Novo Agendamento"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select
                value={formData.cliente_id}
                onValueChange={(value) => setFormData({ ...formData, cliente_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data_agendamento}
                  onChange={(e) => setFormData({ ...formData, data_agendamento: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora_agendamento}
                  onChange={(e) => setFormData({ ...formData, hora_agendamento: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="servicos">Serviços</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {servicos.map((servico) => (
                  <div key={servico.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`servico-${servico.id}`}
                      checked={formData.servico_ids.includes(servico.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            servico_ids: [...formData.servico_ids, servico.id],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            servico_ids: formData.servico_ids.filter((id) => id !== servico.id),
                          })
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`servico-${servico.id}`} className="text-sm cursor-pointer flex-1">
                      {servico.nome} - R$ {servico.preco.toFixed(2)}
                    </label>
                  </div>
                ))}
              </div>

              {formData.servico_ids.length > 0 && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-md">
                  <h4 className="text-sm font-medium text-rose-800 mb-2">Serviços Selecionados:</h4>
                  <div className="space-y-1">
                    {servicos
                      .filter((s) => formData.servico_ids.includes(s.id))
                      .map((servico) => (
                        <div key={servico.id} className="flex justify-between text-sm text-rose-700">
                          <span>{servico.nome}</span>
                          <span>R$ {servico.preco.toFixed(2)}</span>
                        </div>
                      ))}
                    <div className="border-t border-rose-300 pt-1 mt-2">
                      <div className="flex justify-between text-sm font-medium text-rose-800">
                        <span>Total:</span>
                        <span>
                          R${" "}
                          {servicos
                            .filter((s) => formData.servico_ids.includes(s.id))
                            .reduce((total, s) => total + s.preco, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações adicionais (opcional)"
                className="min-h-[60px]"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700 flex-1 h-11">
                {editingAgendamento ? "Atualizar Agendamento" : "Confirmar Agendamento"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onDialogClose()
                  resetForm()
                }}
                className="flex-1 h-11"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="border-rose-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-rose-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-rose-700 bg-rose-50 rounded">
                {day}
              </div>
            ))}
          </div>

          {/* Grid do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dateStr = formatDate(day.date)
              const dayAgendamentos = getAgendamentosForDate(day.date)
              const isBlocked = blockedDates.includes(dateStr)
              const isToday = formatDate(new Date()) === dateStr

              return (
                <div
                  key={dateStr}
                  className={`
                    min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border rounded-lg relative transition-colors
                    ${day.isCurrentMonth ? "bg-white border-rose-200" : "bg-gray-50 border-gray-200"}
                    ${isToday ? "ring-2 ring-rose-400" : ""}
                    ${isBlocked ? "bg-red-50 border-red-300" : ""}
                    ${isBlockingMode ? "hover:bg-red-50" : "hover:bg-rose-50"}
                  `}
                  onClick={() => {
                    if (isBlockingMode && day.isCurrentMonth) {
                      const newBlockedDates = isBlocked
                        ? blockedDates.filter((d) => d !== dateStr)
                        : [...blockedDates, dateStr]
                      setBlockedDates(newBlockedDates)
                      localStorage.setItem("blockedDates", JSON.stringify(newBlockedDates))
                    } else if (!isBlocked) {
                      setSelectedDate(dateStr)
                      setFormData((prev) => ({ ...prev, data_agendamento: dateStr }))
                    }
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`
                        text-xs sm:text-sm font-medium
                        ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                        ${isToday ? "text-rose-600 font-bold" : ""}
                      `}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {dayAgendamentos.slice(0, 2).map((agendamento, index) => (
                      <div
                        key={index}
                        className="text-xs p-1 bg-rose-100 text-rose-800 rounded truncate"
                        title={`${agendamento.cliente_nome} - ${agendamento.hora_agendamento}`}
                      >
                        {agendamento.cliente_nome}
                      </div>
                    ))}
                    {dayAgendamentos.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">+{dayAgendamentos.length - 2} mais</div>
                    )}
                  </div>

                  {isBlocked && (
                    <div className="absolute inset-0 bg-red-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                      <Lock className="h-4 w-4 text-red-600" />
                    </div>
                  )}

                  {isBlockingMode && day.isCurrentMonth && (
                    <div className="absolute top-1 right-1">
                      {isBlocked ? (
                        <Unlock className="h-3 w-3 text-green-600" />
                      ) : (
                        <Lock className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {selectedDate && (
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">
              Agendamentos de {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getAgendamentosForDate(new Date(selectedDate + "T00:00:00")).length === 0 ? (
                <p className="text-rose-600 text-center py-4">Nenhum agendamento para este dia</p>
              ) : (
                getAgendamentosForDate(new Date(selectedDate + "T00:00:00")).map((agendamento) => (
                  <div
                    key={agendamento.id}
                    className="flex flex-col p-4 bg-rose-50 rounded-lg gap-3 border border-rose-100"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <p className="font-medium text-rose-900 text-base">{agendamento.clienteNome}</p>
                          <Badge
                            variant={
                              agendamento.status === "concluido"
                                ? "default"
                                : agendamento.status === "cancelado"
                                  ? "destructive"
                                  : "secondary"
                            }
                            className="w-fit"
                          >
                            {agendamento.status === "concluido"
                              ? "Concluído"
                              : agendamento.status === "cancelado"
                                ? "Cancelado"
                                : "Agendado"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-rose-600">
                          <p>🕐 {agendamento.hora_agendamento}</p>
                          <p>💅 {agendamento.servico}</p>
                          <p>💰 R$ {agendamento.preco.toFixed(2)}</p>
                        </div>
                        {agendamento.observacoes && (
                          <p className="text-sm text-rose-500 italic">📝 {agendamento.observacoes}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-rose-200">
                      {agendamento.status === "agendado" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(agendamento.id, "concluido")}
                            className="border-green-300 text-green-700 hover:bg-green-50 flex-1 sm:flex-none min-w-0"
                          >
                            <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Atendido</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(agendamento.id, "cancelado")}
                            className="border-red-300 text-red-700 hover:bg-red-50 flex-1 sm:flex-none min-w-0"
                          >
                            <XCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                            <span className="truncate">Cancelar</span>
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(agendamento)}
                        className="border-blue-300 text-blue-700 hover:bg-blue-50 flex-1 sm:flex-none min-w-0"
                      >
                        <Edit className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Editar</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(agendamento.id)}
                        className="border-red-300 text-red-700 hover:bg-red-50 flex-1 sm:flex-none min-w-0"
                      >
                        <Trash2 className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Excluir</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function GerenciamentoServicos({ onUpdate }: { onUpdate?: () => void }) {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    duracao: "",
  })

  const loadServicos = () => {
    const servicosData = getServicos()
    setServicos(servicosData)
  }

  useEffect(() => {
    loadServicos()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.preco || !formData.duracao) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const servicoData = {
      nome: formData.nome,
      preco: Number.parseFloat(formData.preco),
      duracao: Number.parseInt(formData.duracao),
    }

    try {
      if (editingServico) {
        const servicoAtualizado = updateServico(editingServico.id, servicoData)
        if (servicoAtualizado) {
          setServicos(servicos.map((s) => (s.id === editingServico.id ? servicoAtualizado : s)))
        }
      } else {
        const novoServico = saveServico(servicoData)
        if (novoServico) {
          setServicos([...servicos, novoServico])
        }
      }

      setFormData({ nome: "", preco: "", duracao: "" })
      setEditingServico(null)
      onUpdate?.()
    } catch (error) {
      console.error("Erro ao salvar serviço:", error)
      alert("Erro ao salvar serviço")
    }
  }

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico)
    setFormData({
      nome: servico.nome,
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString(),
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const sucesso = deleteServico(id)
      if (sucesso) {
        setServicos(servicos.filter((s) => s.id !== id))
        onUpdate?.()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-900 mb-2">Gerenciamento de Serviços</h1>
          <p className="text-rose-600">Gerencie os serviços oferecidos</p>
        </div>
      </div>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">{editingServico ? "Editar Serviço" : "Novo Serviço"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nome">Nome do Serviço</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Manicure Simples"
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  placeholder="25.00"
                />
              </div>
              <div>
                <Label htmlFor="duracao">Duração (minutos)</Label>
                <Input
                  id="duracao"
                  type="number"
                  value={formData.duracao}
                  onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                  placeholder="60"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
                {editingServico ? "Atualizar" : "Adicionar"}
              </Button>
              {editingServico && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingServico(null)
                    setFormData({ nome: "", preco: "", duracao: "" })
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Lista de Serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {servicos.length === 0 ? (
              <p className="text-rose-600 text-center py-4 col-span-full">Nenhum serviço cadastrado</p>
            ) : (
              servicos.map((servico) => (
                <Card key={servico.id} className="border-rose-100">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-rose-900">{servico.nome}</h3>
                      <div className="text-sm text-rose-600 space-y-1">
                        <p>💰 R$ {servico.preco.toFixed(2)}</p>
                        <p>⏱️ {servico.duracao} min</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(servico)}
                          className="border-blue-300 text-blue-700 hover:bg-blue-50 flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(servico.id)}
                          className="border-red-300 text-red-700 hover:bg-red-50 flex-1"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GaleriaPortfolio({ onUpdate }: { onUpdate?: () => void }) {
  const [portfolio, setPortfolio] = useState<FotoPortfolio[]>([])
  const [editingFoto, setEditingFoto] = useState<FotoPortfolio | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    imagem_url: "",
  })

  const loadPortfolio = () => {
    const portfolioData = getPortfolio()
    setPortfolio(portfolioData)
  }

  useEffect(() => {
    loadPortfolio()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.titulo || !formData.imagem_url) {
      alert("Por favor, preencha pelo menos o título e a URL da imagem")
      return
    }

    try {
      if (editingFoto) {
        // Para edição, usaríamos updatePortfolio se existisse
        alert("Funcionalidade de edição será implementada em breve")
      } else {
        const novaFoto = savePortfolio(formData)
        if (novaFoto) {
          setPortfolio([novaFoto, ...portfolio])
        }
      }

      setFormData({ titulo: "", descricao: "", imagem_url: "" })
      setEditingFoto(null)
      onUpdate?.()
    } catch (error) {
      console.error("Erro ao salvar foto:", error)
      alert("Erro ao salvar foto")
    }
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta foto?")) {
      const sucesso = deletePortfolio(id)
      if (sucesso) {
        setPortfolio(portfolio.filter((f) => f.id !== id))
        onUpdate?.()
      }
    }
  }

  const generateImageUrl = (query: string) => {
    return `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(query)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-900 mb-2">Galeria de Portfólio</h1>
          <p className="text-rose-600">Gerencie suas fotos de trabalhos</p>
        </div>
      </div>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Adicionar Nova Foto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ex: Nail Art Floral"
                />
              </div>
              <div>
                <Label htmlFor="imagem_url">URL da Imagem (opcional)</Label>
                <Input
                  id="imagem_url"
                  value={formData.imagem_url}
                  onChange={(e) => setFormData({ ...formData, imagem_url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva o trabalho realizado..."
              />
            </div>
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Galeria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {portfolio.length === 0 ? (
              <p className="text-rose-600 text-center py-4 col-span-full">Nenhuma foto no portfólio</p>
            ) : (
              portfolio.map((foto) => (
                <Card key={foto.id} className="border-rose-100 overflow-hidden">
                  <div className="aspect-square">
                    <img
                      src={foto.imagem_url || generateImageUrl(foto.titulo)}
                      alt={foto.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-rose-900 text-sm mb-1">{foto.titulo}</h3>
                    {foto.descricao && <p className="text-xs text-rose-600 mb-2 line-clamp-2">{foto.descricao}</p>}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(foto.id)}
                      className="border-red-300 text-red-700 hover:bg-red-50 w-full"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
