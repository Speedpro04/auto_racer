import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Palette, Type, MessageSquare, Sparkles, Loader2, CheckCircle2, Copy, RotateCcw, Zap, Eye } from 'lucide-react'

type BrandProfile = {
  colors: { hex: string; name: string; usage: string }[]
  typography: { primary: string; secondary: string; style: string }
  tone: { label: string; description: string; emoji: string }
  tagline: string
  personality: string[]
}

const MOCK_PROFILES: Record<string, BrandProfile> = {
  default: {
    colors: [
      { hex: '#1dd1a1', name: 'Verde Impulso', usage: 'Destaque & CTAs' },
      { hex: '#0C0C0E', name: 'Obsidian', usage: 'Fundo Principal' },
      { hex: '#2d3436', name: 'Carbono', usage: 'Cards & Surfaces' },
      { hex: '#FFFFFF', name: 'Puro', usage: 'Texto & Contraste' },
      { hex: '#E84118', name: 'Ignição', usage: 'Urgência & Alertas' },
    ],
    typography: { primary: 'Bebas Neue', secondary: 'DM Sans', style: 'Bold, Industrial, Impactante' },
    tone: { label: 'Agressivo Premium', description: 'Comunicação direta, com urgência ética e autoridade no mercado automotivo. Tom que gera ação imediata.', emoji: '🔥' },
    tagline: 'Máquinas que fazem história. Negócios que fecham sozinhos.',
    personality: ['Ousado', 'Confiante', 'Tecnológico', 'Veloz', 'Premium'],
  },
}

function generateBrandFromUrl(url: string): BrandProfile {
  // Simulate AI analysis based on URL keywords
  const lower = url.toLowerCase()
  if (lower.includes('luxo') || lower.includes('premium') || lower.includes('import')) {
    return {
      colors: [
        { hex: '#C9A84C', name: 'Ouro Champagne', usage: 'Destaque Principal' },
        { hex: '#1A1A2E', name: 'Azul Noturno', usage: 'Fundo Nobre' },
        { hex: '#16213E', name: 'Profundidade', usage: 'Cards & Layers' },
        { hex: '#E8E8E8', name: 'Prata Acetinado', usage: 'Texto Elegante' },
        { hex: '#8B0000', name: 'Borgonha', usage: 'Acentos & Exclusividade' },
      ],
      typography: { primary: 'Playfair Display', secondary: 'Lato', style: 'Elegante, Serif, Sofisticado' },
      tone: { label: 'Luxo Exclusivo', description: 'Comunicação refinada que transmite exclusividade e curadoria. Cada veículo é uma experiência, não uma compra.', emoji: '👑' },
      tagline: 'Excelência sobre rodas. Para quem não aceita menos.',
      personality: ['Sofisticado', 'Exclusivo', 'Curado', 'Elegante', 'Discreto'],
    }
  }
  if (lower.includes('familia') || lower.includes('popular') || lower.includes('seminov')) {
    return {
      colors: [
        { hex: '#3498db', name: 'Azul Confiança', usage: 'Destaque Principal' },
        { hex: '#2C3E50', name: 'Firmeza', usage: 'Fundo Seguro' },
        { hex: '#34495E', name: 'Estável', usage: 'Cards & Base' },
        { hex: '#ECF0F1', name: 'Clareza', usage: 'Texto & Leitura' },
        { hex: '#27AE60', name: 'Aprovado', usage: 'Segurança & Garantia' },
      ],
      typography: { primary: 'Nunito', secondary: 'Open Sans', style: 'Amigável, Arredondado, Acessível' },
      tone: { label: 'Familiar Confiável', description: 'Tom acolhedor e transparente. Foca em segurança, economia e a confiança de uma boa escolha para toda a família.', emoji: '🏠' },
      tagline: 'Seu próximo carro com a segurança que sua família merece.',
      personality: ['Confiável', 'Acolhedor', 'Transparente', 'Acessível', 'Honesto'],
    }
  }
  return MOCK_PROFILES.default
}

export default function BrandDNA() {
  const [url, setSiteUrl] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [profile, setProfile] = useState<BrandProfile | null>(null)
  const [copied, setCopied] = useState('')

  const analyze = async () => {
    if (!url.trim()) return
    setAnalyzing(true)
    setProgress(0)
    setProfile(null)

    // Simulate progressive analysis
    const steps = [
      { pct: 15, delay: 400 },
      { pct: 35, delay: 600 },
      { pct: 55, delay: 500 },
      { pct: 75, delay: 700 },
      { pct: 90, delay: 400 },
      { pct: 100, delay: 300 },
    ]

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, step.delay))
      setProgress(step.pct)
    }

    await new Promise((r) => setTimeout(r, 500))
    setProfile(generateBrandFromUrl(url))
    setAnalyzing(false)
  }

  const reset = () => {
    setProfile(null)
    setProgress(0)
    setSiteUrl('')
  }

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopied(hex)
    setTimeout(() => setCopied(''), 1500)
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/10 bg-[#2d3436] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30">
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-white">Análise de Brand DNA</h3>
            <p className="text-[12px] text-[#8395a7]">Insira a URL da sua loja e a IA extrai a identidade visual completa</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#576574]" />
            <input
              type="text"
              value={url}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://minhaloja.com.br"
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/10 bg-black/30 text-white text-[15px] placeholder:text-[#444] focus:outline-none focus:border-purple-500/50 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && analyze()}
            />
          </div>
          {profile ? (
            <button
              onClick={reset}
              className="flex items-center gap-2 px-5 rounded-2xl bg-white/10 text-white font-bold text-[13px] hover:bg-white/15 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Nova Análise
            </button>
          ) : (
            <button
              onClick={analyze}
              disabled={analyzing || !url.trim()}
              className="flex items-center gap-2 px-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-black text-[13px] uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_8px_25px_rgba(139,92,246,0.3)]"
            >
              {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {analyzing ? 'Analisando...' : 'Extrair DNA'}
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-2"
            >
              <div className="flex justify-between text-[11px] text-[#576574] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-purple-400 animate-pulse" />
                  {progress < 30 ? 'Lendo DOM & Stylesheets...' :
                   progress < 60 ? 'Extraindo paleta de cores...' :
                   progress < 85 ? 'Classificando tom de voz...' : 'Compilando Brand DNA...'}
                </span>
                <span className="text-purple-400">{progress}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Color Palette */}
            <div className="rounded-3xl border border-white/10 bg-[#2d3436] p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-60 h-60 bg-purple-500/5 blur-[80px] rounded-full" />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <Palette className="w-5 h-5 text-purple-400" />
                <h3 className="text-[17px] font-bold text-white">Paleta Cromática</h3>
              </div>
              <div className="grid grid-cols-5 gap-3 relative z-10">
                {profile.colors.map((color, i) => (
                  <motion.button
                    key={color.hex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => copyColor(color.hex)}
                    className="group rounded-2xl border border-white/10 bg-black/20 p-4 text-left hover:border-purple-500/40 transition-all relative overflow-hidden"
                  >
                    <div
                      className="w-full aspect-square rounded-xl mb-3 shadow-lg group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: color.hex }}
                    />
                    <p className="text-[13px] font-bold text-white truncate">{color.name}</p>
                    <p className="text-[11px] text-[#576574] mt-0.5 font-semibold">{color.usage}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[10px] text-[#444] font-mono font-bold uppercase">{color.hex}</span>
                      {copied === color.hex && (
                        <CheckCircle2 className="w-3 h-3 text-[#1dd1a1]" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Typography + Tone Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Typography */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-3xl border border-white/10 bg-[#2d3436] p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Type className="w-5 h-5 text-blue-400" />
                  <h3 className="text-[17px] font-bold text-white">Tipografia</h3>
                </div>
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black text-[#576574] uppercase tracking-[0.3em] mb-2">Heading Font</p>
                    <p className="text-[28px] font-black text-white leading-none">{profile.typography.primary}</p>
                    <p className="text-[11px] text-purple-400 font-bold mt-1">{profile.typography.style}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-[10px] font-black text-[#576574] uppercase tracking-[0.3em] mb-2">Body Font</p>
                    <p className="text-[22px] font-bold text-white leading-none">{profile.typography.secondary}</p>
                    <p className="text-[13px] text-[#8395a7] mt-2 leading-relaxed">
                      Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Tone of Voice */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl border border-white/10 bg-[#2d3436] p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <MessageSquare className="w-5 h-5 text-amber-400" />
                  <h3 className="text-[17px] font-bold text-white">Tom de Voz</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{profile.tone.emoji}</span>
                    <span className="text-[19px] font-black text-white">{profile.tone.label}</span>
                  </div>
                  <p className="text-[14px] text-[#8395a7] leading-relaxed">{profile.tone.description}</p>
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <p className="text-[10px] font-black text-[#576574] uppercase tracking-[0.3em] mb-3">Tagline Sugerida</p>
                  <p className="text-[16px] font-bold text-white italic leading-snug">"{profile.tagline}"</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(profile.tagline)
                      setCopied('tagline')
                      setTimeout(() => setCopied(''), 1500)
                    }}
                    className="mt-3 flex items-center gap-1.5 text-[11px] text-purple-400 hover:text-purple-300 font-bold transition-colors"
                  >
                    {copied === 'tagline' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === 'tagline' ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Personality Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-3xl border border-white/10 bg-[#2d3436] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-5 h-5 text-[#1dd1a1]" />
                <h3 className="text-[17px] font-bold text-white">Personalidade da Marca</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.personality.map((trait, i) => (
                  <motion.span
                    key={trait}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-500/20 text-[13px] font-bold text-purple-300"
                  >
                    {trait}
                  </motion.span>
                ))}
              </div>
              <div className="mt-5 p-4 rounded-2xl bg-[#1dd1a1]/10 border border-[#1dd1a1]/20">
                <p className="text-[12px] text-[#1dd1a1] font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Brand DNA salvo — será usado automaticamente nos vídeos e copies gerados pelo Racer Redes.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
