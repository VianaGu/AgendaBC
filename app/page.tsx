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
import {
  Users,
  Camera,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Phone,
  CheckCircle,
  XCircle,
  DollarSign,
} from "lucide-react"
import {
  getClientes,
  saveClientes,
  getAgendamentos,
  saveAgendamentos,
  getPortfolio,
  savePortfolio,
  getAgendamentosHoje,
  getReceitaTotal,
  type Cliente,
  type Agendamento,
  getServicos,
  saveServicos,
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

  const updateStats = () => {
    const clientes = getClientes()
    const agendamentosHoje = getAgendamentosHoje()
    const receitaTotal = getReceitaTotal()
    const portfolio = getPortfolio()
    const agendamentos = getAgendamentos()

    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

    const receitaMes = agendamentos
      .filter((a) => a.status === "concluido" && new Date(a.data) >= inicioMes)
      .reduce((total, a) => total + a.preco, 0)

    const clientesNovos = clientes.filter((c) => new Date(c.dataCadastro) >= inicioMes).length

    setStats({
      totalClientes: clientes.length,
      agendamentosHoje: agendamentosHoje.length,
      receitaTotal,
      totalFotos: portfolio.length,
      receitaMes,
      clientesNovos,
    })
  }

  useEffect(() => {
    updateStats()
  }, [])

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-rose-900 mb-2">Dashboard</h1>
          <p className="text-rose-600">Visão geral do seu negócio</p>
        </div>
        <div className="text-right">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-900">{stats.totalClientes}</div>
            <p className="text-xs text-rose-600">+{stats.clientesNovos} novos este mês</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Agendamentos Hoje</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{stats.agendamentosHoje}</div>
            <p className="text-xs text-amber-600">Atendimentos do dia</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Receita do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">R$ {stats.receitaMes.toFixed(2)}</div>
            <p className="text-xs text-emerald-600">Total: R$ {stats.receitaTotal.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Meta Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-rose-700">Receita</span>
                <span className="text-rose-900">R$ {stats.receitaMes.toFixed(2)} / R$ 2.000,00</span>
              </div>
              <Progress value={(stats.receitaMes / 2000) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-rose-700">Novos Clientes</span>
                <span className="text-rose-900">{stats.clientesNovos} / 10</span>
              </div>
              <Progress value={(stats.clientesNovos / 10) * 100} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-rose-700">Fotos no Portfólio</span>
                <span className="text-rose-900">{stats.totalFotos} / 20</span>
              </div>
              <Progress value={(stats.totalFotos / 20) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Resumo Rápido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Portfólio</span>
              <Badge variant="secondary" className="bg-purple-200 text-purple-800">
                {stats.totalFotos} fotos
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Receita Total</span>
              <Badge variant="secondary" className="bg-emerald-200 text-emerald-800">
                R$ {stats.receitaTotal.toFixed(2)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-700">Base de Clientes</span>
              <Badge variant="secondary" className="bg-rose-200 text-rose-800">
                {stats.totalClientes} clientes
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Agendamentos de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <AgendamentosHoje onUpdate={updateStats} />
          </CardContent>
        </Card>

        <Card className="border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-900">Portfólio Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioRecente />
          </CardContent>
        </Card>
      </div>
    </div>
  )

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

function AgendamentosHoje({ onUpdate }: { onUpdate?: () => void }) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])

  const loadAgendamentos = () => {
    setAgendamentos(getAgendamentosHoje())
  }

  useEffect(() => {
    loadAgendamentos()
  }, [])

  const handleStatusChange = (agendamentoId: string, novoStatus: "concluido" | "cancelado") => {
    const todosAgendamentos = getAgendamentos()
    const agendamentosAtualizados = todosAgendamentos.map((a) =>
      a.id === agendamentoId ? { ...a, status: novoStatus } : a,
    )
    saveAgendamentos(agendamentosAtualizados)
    loadAgendamentos()
    onUpdate?.()
  }

  if (agendamentos.length === 0) {
    return <div className="text-center py-4 text-rose-600">Nenhum agendamento para hoje</div>
  }

  return (
    <div className="space-y-3">
      {agendamentos.map((agendamento) => (
        <div key={agendamento.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
          <div>
            <p className="font-medium text-rose-900">{agendamento.clienteNome}</p>
            <p className="text-sm text-rose-600">{agendamento.servico}</p>
            <p className="text-xs text-rose-500">R$ {agendamento.preco.toFixed(2)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="font-medium text-rose-900">{agendamento.hora}</p>
              <Badge
                variant="secondary"
                className={
                  agendamento.status === "agendado"
                    ? "bg-amber-200 text-amber-800"
                    : agendamento.status === "concluido"
                      ? "bg-emerald-200 text-emerald-800"
                      : "bg-red-200 text-red-800"
                }
              >
                {agendamento.status}
              </Badge>
            </div>
            {agendamento.status === "agendado" && (
              <div className="flex flex-col gap-1">
                <Button
                  size="sm"
                  onClick={() => handleStatusChange(agendamento.id, "concluido")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white h-6 px-2"
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange(agendamento.id, "cancelado")}
                  className="border-red-200 text-red-600 hover:bg-red-50 h-6 px-2"
                >
                  <XCircle className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function PortfolioRecente() {
  const [fotos, setFotos] = useState<any[]>([])

  useEffect(() => {
    const portfolio = getPortfolio()
    setFotos(portfolio.slice(0, 3))
  }, [])

  return (
    <div className="grid grid-cols-3 gap-2">
      {fotos.map((foto) => (
        <div key={foto.id} className="aspect-square">
          <img
            src={foto.url || "/placeholder.svg"}
            alt={foto.descricao}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  )
}

function CadastroClientes({
  onUpdate,
  onSchedule,
}: { onUpdate?: () => void; onSchedule?: (clienteId: string) => void }) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
  })

  const loadClientes = () => {
    setClientes(getClientes())
  }

  useEffect(() => {
    loadClientes()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome.trim() || !formData.telefone.trim()) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const novosClientes = [...clientes]

    if (editingCliente) {
      const index = novosClientes.findIndex((c) => c.id === editingCliente.id)
      if (index !== -1) {
        novosClientes[index] = {
          ...editingCliente,
          nome: formData.nome,
          telefone: formData.telefone,
        }
      }
    } else {
      const novoCliente: Cliente = {
        id: Date.now().toString(),
        nome: formData.nome,
        telefone: formData.telefone,
        dataCadastro: new Date(),
      }
      novosClientes.push(novoCliente)
    }

    setClientes(novosClientes)
    saveClientes(novosClientes)

    setFormData({ nome: "", telefone: "" })
    setEditingCliente(null)
    setIsDialogOpen(false)
    onUpdate?.()
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (clienteId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      const novosClientes = clientes.filter((c) => c.id !== clienteId)
      setClientes(novosClientes)
      saveClientes(novosClientes)
      onUpdate?.()
    }
  }

  const resetForm = () => {
    setFormData({ nome: "", telefone: "" })
    setEditingCliente(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-rose-900 mb-2">Clientes</h1>
          <p className="text-rose-600">Gerencie sua base de clientes</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-rose-900">{editingCliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-rose-700">
                  Nome
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Digite o nome do cliente"
                  className="border-rose-200 focus:border-rose-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-rose-700">
                  Telefone
                </Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  className="border-rose-200 focus:border-rose-400"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">
                  {editingCliente ? "Salvar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de Clientes ({clientes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <div className="text-center py-8 text-rose-600">
              <Users className="h-12 w-12 mx-auto mb-4 text-rose-300" />
              <p>Nenhum cliente cadastrado ainda</p>
              <p className="text-sm">Clique em "Novo Cliente" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clientes.map((cliente) => (
                <div
                  key={cliente.id}
                  className="flex items-center justify-between p-4 bg-rose-50 rounded-lg border border-rose-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-200 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium text-rose-900">{cliente.nome}</p>
                      <p className="text-sm text-rose-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {cliente.telefone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-rose-200 text-rose-800">
                      {new Date(cliente.dataCadastro).toLocaleDateString("pt-BR")}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSchedule?.(cliente.id)}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                      title="Agendar serviço"
                    >
                      <Calendar className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(cliente)}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(cliente.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
  const [editingAgendamento, setEditingAgendamento] = useState<Agendamento | null>(null)
  const [formData, setFormData] = useState({
    clienteId: selectedClienteId || "",
    data: "",
    hora: "",
    servico: "",
    preco: "",
  })

  const servicos = [
    { nome: "Manicure Simples", preco: 25 },
    { nome: "Esmaltação Gel", preco: 45 },
    { nome: "Alongamento", preco: 60 },
    { nome: "Alongamento + Decoração", preco: 80 },
    { nome: "Nail Art", preco: 70 },
    { nome: "Francesinha", preco: 35 },
  ]

  const loadData = () => {
    setAgendamentos(getAgendamentos())
    setClientes(getClientes())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleStatusChange = (agendamentoId: string, novoStatus: "concluido" | "cancelado") => {
    const agendamentosAtualizados = agendamentos.map((a) => (a.id === agendamentoId ? { ...a, status: novoStatus } : a))
    setAgendamentos(agendamentosAtualizados)
    saveAgendamentos(agendamentosAtualizados)
    onUpdate?.()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.clienteId || !formData.data || !formData.hora || !formData.servico || !formData.preco) {
      alert("Por favor, preencha todos os campos")
      return
    }

    const cliente = clientes.find((c) => c.id === formData.clienteId)
    if (!cliente) {
      alert("Cliente não encontrado")
      return
    }

    const novosAgendamentos = [...agendamentos]

    if (editingAgendamento) {
      const index = novosAgendamentos.findIndex((a) => a.id === editingAgendamento.id)
      if (index !== -1) {
        novosAgendamentos[index] = {
          ...editingAgendamento,
          clienteId: formData.clienteId,
          clienteNome: cliente.nome,
          data: new Date(formData.data),
          hora: formData.hora,
          servico: formData.servico,
          preco: Number.parseFloat(formData.preco),
        }
      }
    } else {
      const novoAgendamento: Agendamento = {
        id: Date.now().toString(),
        clienteId: formData.clienteId,
        clienteNome: cliente.nome,
        data: new Date(formData.data),
        hora: formData.hora,
        servico: formData.servico,
        preco: Number.parseFloat(formData.preco),
        status: "agendado",
      }
      novosAgendamentos.push(novoAgendamento)
    }

    setAgendamentos(novosAgendamentos)
    saveAgendamentos(novosAgendamentos)

    resetForm()
    onDialogClose()
    onUpdate?.()
  }

  const handleEdit = (agendamento: Agendamento) => {
    setEditingAgendamento(agendamento)
    setFormData({
      clienteId: agendamento.clienteId,
      data: new Date(agendamento.data).toISOString().split("T")[0],
      hora: agendamento.hora,
      servico: agendamento.servico,
      preco: agendamento.preco.toString(),
    })
    onDialogClose()
  }

  const handleDelete = (agendamentoId: string) => {
    if (confirm("Tem certeza que deseja excluir este agendamento?")) {
      const novosAgendamentos = agendamentos.filter((a) => a.id !== agendamentoId)
      setAgendamentos(novosAgendamentos)
      saveAgendamentos(novosAgendamentos)
      onUpdate?.()
    }
  }

  const handleServicoChange = (servico: string) => {
    const servicoEncontrado = servicos.find((s) => s.nome === servico)
    setFormData({
      ...formData,
      servico,
      preco: servicoEncontrado ? servicoEncontrado.preco.toString() : "",
    })
  }

  const resetForm = () => {
    setFormData({
      clienteId: "",
      data: "",
      hora: "",
      servico: "",
      preco: "",
    })
    setEditingAgendamento(null)
  }

  const agendamentosOrdenados = agendamentos.sort((a, b) => {
    const dataA = new Date(a.data).getTime()
    const dataB = new Date(b.data).getTime()
    if (dataA !== dataB) return dataB - dataA
    return a.hora.localeCompare(b.hora)
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-rose-900 mb-2">Agendamentos</h1>
          <p className="text-rose-600">Gerencie seus agendamentos</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-rose-900">
                {editingAgendamento ? "Editar Agendamento" : "Novo Agendamento"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cliente" className="text-rose-700">
                  Cliente
                </Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(value) => setFormData({ ...formData, clienteId: value })}
                >
                  <SelectTrigger className="border-rose-200 focus:border-rose-400">
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
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="data" className="text-rose-700">
                    Data
                  </Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                    className="border-rose-200 focus:border-rose-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora" className="text-rose-700">
                    Hora
                  </Label>
                  <Input
                    id="hora"
                    type="time"
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    className="border-rose-200 focus:border-rose-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="servico" className="text-rose-700">
                  Serviço
                </Label>
                <Select value={formData.servico} onValueChange={handleServicoChange}>
                  <SelectTrigger className="border-rose-200 focus:border-rose-400">
                    <SelectValue placeholder="Selecione um serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map((servico) => (
                      <SelectItem key={servico.nome} value={servico.nome}>
                        {servico.nome} - R$ {servico.preco.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preco" className="text-rose-700">
                  Preço (R$)
                </Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  placeholder="0.00"
                  className="border-rose-200 focus:border-rose-400"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onDialogClose} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">
                  {editingAgendamento ? "Salvar" : "Agendar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Lista de Agendamentos ({agendamentos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {agendamentos.length === 0 ? (
            <div className="text-center py-8 text-rose-600">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-rose-300" />
              <p>Nenhum agendamento cadastrado ainda</p>
              <p className="text-sm">Clique em "Novo Agendamento" para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {agendamentosOrdenados.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="flex items-center justify-between p-4 bg-rose-50 rounded-lg border border-rose-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-200 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="font-medium text-rose-900">{agendamento.clienteNome}</p>
                      <p className="text-sm text-rose-600">{agendamento.servico}</p>
                      <p className="text-xs text-rose-500">
                        {new Date(agendamento.data).toLocaleDateString("pt-BR")} às {agendamento.hora}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-medium text-rose-900">R$ {agendamento.preco.toFixed(2)}</p>
                      <Badge
                        variant="secondary"
                        className={
                          agendamento.status === "agendado"
                            ? "bg-amber-200 text-amber-800"
                            : agendamento.status === "concluido"
                              ? "bg-emerald-200 text-emerald-800"
                              : "bg-red-200 text-red-800"
                        }
                      >
                        {agendamento.status}
                      </Badge>
                    </div>
                    {agendamento.status === "agendado" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStatusChange(agendamento.id, "concluido")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          title="Marcar como atendido"
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(agendamento.id, "cancelado")}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          title="Marcar como cancelado"
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(agendamento)}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(agendamento.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function GaleriaPortfolio({ onUpdate }: { onUpdate?: () => void }) {
  const [fotos, setFotos] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFoto, setEditingFoto] = useState<any>(null)
  const [selectedFoto, setSelectedFoto] = useState<any>(null)
  const [formData, setFormData] = useState({
    descricao: "",
    url: "",
  })

  const fotosExemplo = [
    "/floral-nail-art.png",
    "/classic-french-manicure.png",
    "/placeholder-6unsb.png",
    "/glitter-nail-art-sparkly.png",
    "/minimalist-nude-nails.png",
    "/ombre-nail-gradient.png",
  ]

  const loadFotos = () => {
    const portfolio = getPortfolio()
    setFotos(portfolio)
  }

  useEffect(() => {
    loadFotos()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.descricao.trim()) {
      alert("Por favor, adicione uma descrição")
      return
    }

    const novasFotos = [...fotos]

    if (editingFoto) {
      const index = novasFotos.findIndex((f) => f.id === editingFoto.id)
      if (index !== -1) {
        novasFotos[index] = {
          ...editingFoto,
          descricao: formData.descricao,
          url: formData.url || editingFoto.url,
        }
      }
    } else {
      const urlFoto = formData.url || fotosExemplo[Math.floor(Math.random() * fotosExemplo.length)]
      const novaFoto = {
        id: Date.now().toString(),
        url: urlFoto,
        descricao: formData.descricao,
        dataUpload: new Date(),
      }
      novasFotos.push(novaFoto)
    }

    setFotos(novasFotos)
    savePortfolio(novasFotos)

    resetForm()
    setIsDialogOpen(false)
    onUpdate?.()
  }

  const handleEdit = (foto: any) => {
    setEditingFoto(foto)
    setFormData({
      descricao: foto.descricao,
      url: foto.url,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (fotoId: string) => {
    if (confirm("Tem certeza que deseja excluir esta foto?")) {
      const novasFotos = fotos.filter((f) => f.id !== fotoId)
      setFotos(novasFotos)
      savePortfolio(novasFotos)
      onUpdate?.()
    }
  }

  const resetForm = () => {
    setFormData({
      descricao: "",
      url: "",
    })
    setEditingFoto(null)
  }

  const fotosOrdenadas = fotos.sort((a, b) => new Date(b.dataUpload).getTime() - new Date(a.dataUpload).getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-rose-900 mb-2">Portfólio</h1>
          <p className="text-rose-600">Gerencie suas fotos de trabalhos</p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-rose-900">{editingFoto ? "Editar Foto" : "Nova Foto"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-rose-700">
                  Descrição
                </Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o trabalho realizado"
                  className="border-rose-200 focus:border-rose-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url" className="text-rose-700">
                  URL da Imagem (opcional)
                </Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="Cole a URL da imagem ou deixe em branco"
                  className="border-rose-200 focus:border-rose-400"
                />
                <p className="text-xs text-rose-500">
                  Se deixar em branco, uma imagem de exemplo será gerada automaticamente
                </p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">
                  {editingFoto ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-900 flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Galeria ({fotos.length} fotos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fotos.length === 0 ? (
            <div className="text-center py-8 text-rose-600">
              <Camera className="h-12 w-12 mx-auto mb-4 text-rose-300" />
              <p>Nenhuma foto no portfólio ainda</p>
              <p className="text-sm">Clique em "Adicionar Foto" para começar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fotosOrdenadas.map((foto) => (
                <div key={foto.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-rose-100">
                    <img
                      src={foto.url || "/placeholder.svg"}
                      alt={foto.descricao}
                      className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
                      onClick={() => setSelectedFoto(foto)}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(foto)}
                        className="bg-white text-rose-600 hover:bg-rose-50"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDelete(foto.id)}
                        className="bg-white text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-rose-900 truncate">{foto.descricao}</p>
                    <p className="text-xs text-rose-600">{new Date(foto.dataUpload).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualização da foto */}
      {selectedFoto && (
        <Dialog open={!!selectedFoto} onOpenChange={() => setSelectedFoto(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-rose-900">{selectedFoto.descricao}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-rose-100">
                <img
                  src={selectedFoto.url || "/placeholder.svg"}
                  alt={selectedFoto.descricao}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-between items-center text-sm text-rose-600">
                <span>Adicionado em: {new Date(selectedFoto.dataUpload).toLocaleDateString("pt-BR")}</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedFoto(null)
                      handleEdit(selectedFoto)
                    }}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedFoto(null)
                      handleDelete(selectedFoto.id)
                    }}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Excluir
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function GerenciamentoServicos({ onUpdate }: { onUpdate: () => void }) {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    duracao: "",
  })

  useEffect(() => {
    setServicos(getServicos())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingServico) {
      const updatedServicos = servicos.map((servico) =>
        servico.id === editingServico.id
          ? {
              ...servico,
              nome: formData.nome,
              preco: Number.parseFloat(formData.preco),
              duracao: Number.parseInt(formData.duracao),
            }
          : servico,
      )
      setServicos(updatedServicos)
      saveServicos(updatedServicos)
    } else {
      const novoServico: Servico = {
        id: Date.now().toString(),
        nome: formData.nome,
        preco: Number.parseFloat(formData.preco),
        duracao: Number.parseInt(formData.duracao),
      }
      const updatedServicos = [...servicos, novoServico]
      setServicos(updatedServicos)
      saveServicos(updatedServicos)
    }

    setFormData({ nome: "", preco: "", duracao: "" })
    setEditingServico(null)
    setShowModal(false)
    onUpdate()
  }

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico)
    setFormData({
      nome: servico.nome,
      preco: servico.preco.toString(),
      duracao: servico.duracao.toString(),
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    const updatedServicos = servicos.filter((servico) => servico.id !== id)
    setServicos(updatedServicos)
    saveServicos(updatedServicos)
    onUpdate()
  }

  const resetForm = () => {
    setFormData({ nome: "", preco: "", duracao: "" })
    setEditingServico(null)
    setShowModal(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-rose-800">Gerenciar Serviços</h2>
        <Button onClick={() => setShowModal(true)} className="bg-rose-600 hover:bg-rose-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {servicos.map((servico) => (
          <Card key={servico.id} className="border-rose-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-rose-800">{servico.nome}</h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(servico)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(servico.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>R$ {servico.preco.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{servico.duracao} min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-rose-800">
              {editingServico ? "Editar Serviço" : "Novo Serviço"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                <input
                  type="number"
                  value={formData.duracao}
                  onChange={(e) => setFormData({ ...formData, duracao: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white">
                  {editingServico ? "Atualizar" : "Salvar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
