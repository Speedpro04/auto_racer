import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Video, Subtitles, Send, Loader2, CheckCircle2, AlertCircle,
  Dna, Wand2, Zap, Activity
} from 'lucide-react'
import api from '../../lib/api'
import BrandDNA from '../../components/admin/marketing/BrandDNA'
import FlowStudio from '../../components/admin/marketing/FlowStudio'

// ─── Types ──────────────────────────────────────────────────────
type VehicleItem = {
  id: string
  title?: string
  brand?: string
  year?: number
}

type JobStatus = {
  job_id: string
  status: string
  video_url?: string
  error?: string
}

// ─── Templates ──────────────────────────────────────────────────
const templateOptions = [
  { id: 'spin-premium', name: 'SPIN Premium', hook: 'Dor + implicação + solução + CTA' },
  { id: 'fechamento-direto', name: 'Fechamento Direto', hook: 'Oferta objetiva e urgência ética' },
  { id: 'status-lifestyle', name: 'Status & Lifestyle', hook: 'Desejo, design e presença' },
  { id: 'familia-segura', name: 'Família Segura', hook: 'Conforto, proteção e confiança' },
]

// ─── Tab Config ─────────────────────────────────────────────────
const TABS = [
  { id: 'videos', label: 'Central de Vídeos', icon: Video, color: '#1dd1a1' },
  { id: 'brand-dna', label: 'Brand DNA', icon: Dna, color: '#a855f7' },
  { id: 'flow-studio', label: 'Flow Studio', icon: Wand2, color: '#3b82f6' },
] as const

type TabId = typeof TABS[number]['id']

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
function RacerRedes() {
  const [activeTab, setActiveTab] = useState<TabId>('videos')

  // ── Video tab state (preserved) ──
  const [vehicles, setVehicles] = useState<VehicleItem[]>([])
  const [vehicleId, setVehicleId] = useState('')
  const [siteNome, setSiteNome] = useState('Auto Racer')
  const [siteUrl, setSiteUrl] = useState('mvp.auto.axoshub.com')
  const [whatsapp, setWhatsapp] = useState('(11) 99999-9999')
  const [templateId, setTemplateId] = useState(templateOptions[0].id)
  const [targetAudience, setTargetAudience] = useState('cliente que quer fechar com segurança')
  const [highlight, setHighlight] = useState('excelente custo-benefício')
  const [smartDescription, setSmartDescription] = useState('')
  const [job, setJob] = useState<JobStatus | null>(null)
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState('')

  const selectedTemplate = useMemo(
    () => templateOptions.find((t) => t.id === templateId) ?? templateOptions[0],
    [templateId]
  )

  // ── Video tab functions ──
  const loadVehicles = async () => {
    try {
      setLoadingVehicles(true)
      setError('')
      const response = await api.get('/api/v1/auto-video/vehicles')
      const items = response.data?.vehicles ?? []
      setVehicles(items)
      if (items.length && !vehicleId) setVehicleId(items[0].id)
    } catch (err) {
      console.error(err)
      setError('Não foi possível carregar os veículos do módulo de vídeo.')
    } finally {
      setLoadingVehicles(false)
    }
  }

  const generateSmartDescription = () => {
    const selectedVehicle = vehicles.find((v) => v.id === vehicleId)
    const vehicleText = selectedVehicle
      ? `${selectedVehicle.brand ?? ''} ${selectedVehicle.title ?? ''} ${selectedVehicle.year ?? ''}`.trim()
      : 'este veículo'

    setSmartDescription(
      `Situação: você busca um carro para ${targetAudience}. ` +
        `Problema: adiar a decisão mantém custo e incerteza. ` +
        `Implicação: boas oportunidades passam e você segue sem o carro certo. ` +
        `Solução: ${vehicleText}, com ${highlight}. ` +
        `Me chama no WhatsApp agora e te mostro as melhores condições para fechar hoje.`
    )
  }

  const pollStatus = async (jobId: string) => {
    setPolling(true)
    for (let i = 0; i < 45; i += 1) {
      await new Promise((r) => setTimeout(r, 2000))
      const response = await api.get(`/api/v1/auto-video/status/${jobId}`)
      const payload = response.data as JobStatus
      setJob(payload)
      if (payload.status === 'done' || payload.status === 'error') {
        setPolling(false)
        return
      }
    }
    setPolling(false)
  }

  const generateVideo = async () => {
    if (!vehicleId) {
      setError('Selecione um veículo para gerar o vídeo.')
      return
    }
    try {
      setGenerating(true)
      setError('')
      const response = await api.post('/api/v1/auto-video/generate', {
        vehicle_id: vehicleId,
        site_url: siteUrl,
        site_nome: siteNome,
        whatsapp,
      })
      const payload = response.data as JobStatus
      setJob(payload)
      await pollStatus(payload.job_id)
    } catch (err) {
      console.error(err)
      setError('Falha ao iniciar geração automática de vídeo.')
    } finally {
      setGenerating(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-12"
    >
      {/* ── Hero Header ── */}
      <div className="rounded-[35px] border border-white/5 bg-[#2d3436] p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-500/10 blur-[80px] rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#1dd1a1]/10 blur-[80px] rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-[#1dd1a1]/20 rounded-xl border border-white/10">
                <Zap className="w-5 h-5 text-[#1dd1a1]" />
              </div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#1dd1a1] font-black">Marketing Intelligence Hub</p>
            </div>
            <h1 className="text-[28px] font-black text-white leading-tight tracking-tight">
              Marketing <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">IA</span>
            </h1>
            <p className="text-[#8395a7] text-[14px] mt-1 max-w-md">
              Crie vídeos, extraia o DNA da sua marca e edite imagens com inteligência artificial — tudo em um só lugar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-[#1dd1a1] animate-pulse" />
            <span className="text-[9px] font-black text-[#576574] uppercase tracking-[0.3em]">
              Pomelli · Flow · SPIN Engine
            </span>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#2d3436] border border-white/5 shadow-xl">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-[14px] transition-all duration-300 text-[12px] font-black uppercase tracking-widest relative overflow-hidden ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-[#576574] hover:text-white hover:bg-white/5'
              }`}
              style={isActive ? { background: `linear-gradient(135deg, ${tab.color}20, ${tab.color}10)`, border: `1px solid ${tab.color}30` } : {}}
            >
              <Icon className="w-4 h-4" style={isActive ? { color: tab.color } : {}} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: tab.color }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Error Banner ── */}
      {error && activeTab === 'videos' && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-[15px] text-red-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {/* ──────── TAB 1: Central de Vídeos ──────── */}
        {activeTab === 'videos' && (
          <motion.div
            key="videos"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            <div className="xl:col-span-1 rounded-2xl border border-white/10 bg-[#2d3436] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[19px] font-bold text-white">Template Comercial</h2>
                <Sparkles className="w-4 h-4 text-[#1dd1a1]" />
              </div>
              <div className="space-y-3">
                {templateOptions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTemplateId(item.id)}
                    className={`w-full text-left rounded-xl border p-3 transition-all ${
                      templateId === item.id
                        ? 'border-[#1dd1a1] bg-[#1dd1a1]/10'
                        : 'border-white/10 bg-black/20 hover:border-[#1dd1a1]/50'
                    }`}
                  >
                    <p className="text-[15px] font-bold text-white">{item.name}</p>
                    <p className="text-[13px] text-[#b2bec3] mt-1">{item.hook}</p>
                  </button>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/25 p-3 text-[13px] text-[#b2bec3]">
                <p className="text-white font-bold mb-1">Legendas</p>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#1dd1a1]/20 px-3 py-1 text-[#1dd1a1] font-semibold">
                  <Subtitles className="w-3.5 h-3.5" /> Sempre Ativas
                </div>
              </div>
            </div>

            <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-[#2d3436] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[19px] font-bold text-white">Descrição Inteligente + Geração</h2>
                <button
                  onClick={loadVehicles}
                  className="text-[13px] px-3 py-2 rounded-lg bg-[#1dd1a1] text-black font-bold hover:brightness-110 transition"
                >
                  {loadingVehicles ? 'Carregando...' : 'Atualizar Veículos'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[15px] text-white"
                >
                  <option value="">Selecione um veículo</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {(v.title || v.brand || 'Veículo').trim()} ({v.id.slice(0, 8)})
                    </option>
                  ))}
                </select>
                <input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[15px] text-white"
                  placeholder="Público alvo"
                />
                <input
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[15px] text-white"
                  placeholder="Destaque principal"
                />
                <input
                  value={siteNome}
                  onChange={(e) => setSiteNome(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[15px] text-white"
                  placeholder="Nome da loja"
                />
                <input
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[15px] text-white"
                  placeholder="URL do site"
                />
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[15px] text-white"
                  placeholder="WhatsApp"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={generateSmartDescription}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2 text-[15px] font-bold text-white transition"
                >
                  <Sparkles className="w-4 h-4 text-[#1dd1a1]" /> Gerar descrição SPIN
                </button>
                <button
                  onClick={generateVideo}
                  disabled={generating || polling}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1dd1a1] hover:brightness-110 px-4 py-2 text-[15px] font-black text-black transition disabled:opacity-60"
                >
                  {(generating || polling) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  Gerar vídeo automático
                </button>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-[13px] uppercase tracking-widest text-[#b2bec3] mb-2">Prévia de Narração</p>
                <p className="text-[15px] text-white leading-relaxed">
                  {smartDescription || `Template: ${selectedTemplate.name}. Clique em "Gerar descrição SPIN" para criar a copy.`}
                </p>
              </div>

              {job && (
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="text-[13px] uppercase tracking-widest text-[#b2bec3] mb-2">Status da Geração</p>
                  <div className="flex items-center gap-2 text-[15px] text-white">
                    {job.status === 'done' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#1dd1a1]" />
                    ) : job.status === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <Loader2 className="w-4 h-4 animate-spin text-[#1dd1a1]" />
                    )}
                    <span>Job {job.job_id.slice(0, 8)} - {job.status}</span>
                  </div>
                  {job.video_url && (
                    <a
                      href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${job.video_url}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-[#1dd1a1] hover:underline text-[15px] font-semibold"
                    >
                      <Send className="w-4 h-4" /> Abrir vídeo gerado
                    </a>
                  )}
                  {job.error && <p className="mt-3 text-[15px] text-red-300">{job.error}</p>}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ──────── TAB 2: Brand DNA ──────── */}
        {activeTab === 'brand-dna' && (
          <motion.div
            key="brand-dna"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <BrandDNA />
          </motion.div>
        )}

        {/* ──────── TAB 3: Flow Studio ──────── */}
        {activeTab === 'flow-studio' && (
          <motion.div
            key="flow-studio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <FlowStudio />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default RacerRedes
