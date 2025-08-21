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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Users,
  Camera,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  Check,
  X,
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

  const updateStats = async () => {
    try {
      const [clientes, agendamentosHojeData, receitaTotal, portfolio] = await Promise.all([
        getClientes(),
        getAgendamentosHoje(),
        getReceitaTotal(),
        getPortfolio(),
      ])

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

  const updateAgendamentoStatus = async (id: string, status: "concluido" | "cancelado") => {
    try {
      await updateAgendamento(id, { status })
      setAgendamentosHoje((prevAgendamentos) =>
        prevAgendamentos.map((agendamento) => (agendamento.id === id ? { ...agendamento, status } : agendamento)),
      )
      updateStats()
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error)
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

          <Card className="border-rose-200">
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" />
                Agendamentos de Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {agendamentosHoje.length === 0 ? (
                  <p className="text-rose-600 text-center py-4">Nenhum agendamento para hoje</p>
                ) : (
                  agendamentosHoje.map((agendamento) => (
                    <div
                      key={agendamento.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-rose-50 rounded-lg gap-3"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-rose-900 text-sm sm:text-base">{agendamento.clienteNome}</p>
                        <p className="text-rose-600 text-xs sm:text-sm">
                          {agendamento.servico} - {agendamento.hora_agendamento}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAgendamentoStatus(agendamento.id, "concluido")}
                          className="border-green-300 text-green-700 hover:bg-green-50 flex-1 sm:flex-none"
                          disabled={agendamento.status !== "agendado"}
                        >
                          <Check className="h-3 w-3 sm:mr-1" />
                          <span className="hidden sm:inline">Atendido</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateAgendamentoStatus(agendamento.id, "cancelado")}
                          className="border-red-300 text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                          disabled={agendamento.status !== "agendado"}
                        >
                          <X className="h-3 w-3 sm:mr-1" />
                          <span className="hidden sm:inline">Cancelar</span>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  })

  const loadClientes = async () => {
    const clientesData = await getClientes()
    setClientes(clientesData)
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome || !formData.telefone) {
      alert("Por favor, preencha todos os campos")
      return
    }

    try {
      if (editingCliente) {
        const clienteAtualizado = await updateCliente(editingCliente.id, formData)
        if (clienteAtualizado) {
          setClientes(clientes.map((c) => (c.id === editingCliente.id ? clienteAtualizado : c)))
        }
      } else {
        const novoCliente = await saveCliente(formData)
        if (novoCliente) {
          setClientes([...clientes, novoCliente])
        }
      }

      setFormData({ nome: "", telefone: "" })
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
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      const sucesso = await deleteCliente(id)
      if (sucesso) {
        setClientes(clientes.filter((c) => c.id !== id))
        onUpdate?.()
      }
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
                    setFormData({ nome: "", telefone: "" })
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
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {clientes.length === 0 ? (
              <p className="text-rose-600 text-center py-4">Nenhum cliente cadastrado</p>
            ) : (
              clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-rose-50 rounded-lg gap-3"
                >
                  <div className="flex-1">
                    <p className="font-medium text-rose-900">{cliente.nome}</p>
                    <p className="text-rose-600 text-sm">{cliente.telefone}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
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
  const [formData, setFormData] = useState({
    cliente_id: selectedClienteId || "",
    data_agendamento: "",
    hora_agendamento: "",
    servico_id: "",
    observacoes: "",
  })

  const loadData = async () => {
    try {
      const [agendamentosData, clientesData, servicosData] = await Promise.all([
        getAgendamentos(),
        getClientes(),
        getServicos(),
      ])
      setAgendamentos(agendamentosData)
      setClientes(clientesData)
      setServicos(servicosData)
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

  const handleStatusChange = async (agendamentoId: string, novoStatus: "concluido" | "cancelado") => {
    try {
      const agendamentoAtualizado = await updateAgendamento(agendamentoId, { status: novoStatus })
      if (agendamentoAtualizado) {
        setAgendamentos(agendamentos.map((a) => (a.id === agendamentoId ? agendamentoAtualizado : a)))
        onUpdate?.()
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.cliente_id || !formData.data_agendamento || !formData.hora_agendamento || !formData.servico_id) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    try {
      if (editingAgendamento) {
        const agendamentoAtualizado = await updateAgendamento(editingAgendamento.id, formData)
        if (agendamentoAtualizado) {
          setAgendamentos(agendamentos.map((a) => (a.id === editingAgendamento.id ? agendamentoAtualizado : a)))
        }
      } else {
        const novoAgendamento = await saveAgendamento(formData)
        if (novoAgendamento) {
          setAgendamentos([...agendamentos, novoAgendamento])
        }
      }

      setFormData({
        cliente_id: "",
        data_agendamento: "",
        hora_agendamento: "",
        servico_id: "",
        observacoes: "",
      })
      setEditingAgendamento(null)
      onDialogClose()
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
      servico_id: agendamento.servico_id || "",
      observacoes: agendamento.observacoes || "",
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      const sucesso = await deleteAgendamento(id)
      if (sucesso) {
        setAgendamentos(agendamentos.filter((a) => a.id !== id))
        onUpdate?.()
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-900 mb-2">Sistema de Agendamentos</h1>
          <p className="text-rose-600">Gerencie todos os agendamentos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={onDialogClose}>
          <DialogTrigger asChild>
            <Button className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
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
                <Label htmlFor="servico">Serviço</Label>
                <Select
                  value={formData.servico_id}
                  onValueChange={(value) => setFormData({ ...formData, servico_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((servico) => (
                      <SelectItem key={servico.id} value={servico.id}>
                        {servico.nome} - R$ {servico.preco.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais (opcional)"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 flex-1">
                  {editingAgendamento ? "Atualizar" : "Agendar"}
                </Button>
                <Button type="button" variant="outline" onClick={onDialogClose} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900">Lista de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {agendamentos.length === 0 ? (
              <p className="text-rose-600 text-center py-4">Nenhum agendamento cadastrado</p>
            ) : (
              agendamentos.map((agendamento) => (
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
                        <p>📅 {new Date(agendamento.data_agendamento).toLocaleDateString("pt-BR")}</p>
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

  const loadServicos = async () => {
    const servicosData = await getServicos()
    setServicos(servicosData)
  }

  useEffect(() => {
    loadServicos()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
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
        const servicoAtualizado = await updateServico(editingServico.id, servicoData)
        if (servicoAtualizado) {
          setServicos(servicos.map((s) => (s.id === editingServico.id ? servicoAtualizado : s)))
        }
      } else {
        const novoServico = await saveServico(servicoData)
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

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      const sucesso = await deleteServico(id)
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

  const loadPortfolio = async () => {
    const portfolioData = await getPortfolio()
    setPortfolio(portfolioData)
  }

  useEffect(() => {
    loadPortfolio()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
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
        const novaFoto = await savePortfolio(formData)
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

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta foto?")) {
      const sucesso = await deletePortfolio(id)
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
