import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Users, TrendingUp, DollarSign, Plus, ArrowUpRight, Clock } from 'lucide-react'
import api from '../../lib/api'

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [recentVehicles, setRecentVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, vehiclesRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/vehicles?limit=5'),
        ])
        setStats(statsRes.data)
        setRecentVehicles(vehiclesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statCards = [
    { label: 'Veículos Ativos', value: stats?.totalVehicles || 0, icon: Car, color: '#1dd1a1' },
    { label: 'Leads (Mês)', value: stats?.totalLeads || 0, icon: Users, color: '#1dd1a1' },
    { label: 'Valor em Estoque', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.totalValue || 0), icon: DollarSign, color: '#FFFFFF' },
    { label: 'Conversão', value: '12%', icon: TrendingUp, color: '#1dd1a1' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black font-impact text-white tracking-tight uppercase">Dashboard</h1>
          <p className="text-[#576574] text-[10px] mt-2 font-black uppercase tracking-[0.4em]">Gestão de Ecossistema Elite</p>
        </div>
        <Link
          to="/admin/veiculos/novo"
          className="flex items-center gap-2 bg-[#1dd1a1] text-black px-6 py-3 rounded-2xl hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 font-black uppercase tracking-widest text-xs"
        >
          <Plus className="w-5 h-5" />
          Anunciar Obra de Arte
        </Link>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[#14181C] p-8 rounded-[32px] border border-white/5 shadow-2xl relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rounded-full blur-2xl group-hover:bg-[#1dd1a1]/10 transition-colors" />
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-black rounded-xl border border-white/10 group-hover:border-[#1dd1a1]/50 transition-colors">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#333] group-hover:text-[#1dd1a1] transition-colors" />
            </div>
            <span className="block text-[10px] text-[#576574] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</span>
            <span className="block text-2xl font-black text-white tracking-tighter">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Mini-List */}
        <div className="lg:col-span-2 bg-[#14181C] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 font-impact">
               <Clock className="w-5 h-5 text-[#1dd1a1]" /> Últimas Inserções
            </h2>
            <Link to="/admin/veiculos" className="text-[9px] font-black underline uppercase tracking-widest text-[#576574] hover:text-[#1dd1a1]">Ver todos</Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentVehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-black rounded-xl border border-white/10 overflow-hidden flex items-center justify-center">
                    {vehicle.media?.[0]?.url ? <img src={vehicle.media[0].url} className="w-full h-full object-cover" /> : <Car className="w-6 h-6 text-[#222]" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-[#1dd1a1] transition-colors">{vehicle.title}</h3>
                    <p className="text-[10px] font-black uppercase text-[#576574] tracking-widest">{vehicle.brand} • {vehicle.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-black text-[#1dd1a1] tracking-tight">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.price)}</span>
                  <span className="text-[10px] font-black uppercase text-[#333]">{vehicle.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Config Card */}
        <div className="bg-[#1dd1a1] rounded-[32px] p-8 flex flex-col justify-between text-black shadow-[0_20px_50px_rgba(29,209,161,0.2)]">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-6 font-impact">SISTEMA <br />EM PERFORMANCE</h2>
            <p className="font-bold text-sm leading-relaxed opacity-70">Sua plataforma está otimizada para capturar os melhores leads da região. Mantenha seu estoque atualizado para máximo impacto.</p>
          </div>
          <Link to="/admin/configuracoes" className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center hover:bg-white hover:text-black transition-all">
             Ajustar Configurações
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
