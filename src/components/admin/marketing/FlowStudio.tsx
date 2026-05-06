import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Pencil, Eraser, RotateCcw, Wand2, Loader2,
  Sparkles, Download, Layers, MousePointer2
} from 'lucide-react'

type DrawPoint = { x: number; y: number }
type DrawStroke = { points: DrawPoint[]; color: string; width: number }

const BRUSH_COLORS = [
  { hex: '#FF3B30', label: 'Vermelho' },
  { hex: '#FF9500', label: 'Laranja' },
  { hex: '#34C759', label: 'Verde' },
  { hex: '#007AFF', label: 'Azul' },
  { hex: '#AF52DE', label: 'Roxo' },
  { hex: '#FFFFFF', label: 'Branco' },
]

const PRESET_BACKGROUNDS = [
  { id: 'showroom', label: 'Showroom Premium', prompt: 'Showroom de vidro com iluminação quente e piso espelhado' },
  { id: 'urban', label: 'Urbano Noturno', prompt: 'Rua urbana à noite com luzes neon e reflexo no asfalto molhado' },
  { id: 'nature', label: 'Natureza & Estrada', prompt: 'Estrada panorâmica entre montanhas com céu dourado ao pôr do sol' },
  { id: 'studio', label: 'Estúdio Profissional', prompt: 'Fundo estúdio fotográfico escuro com iluminação rim light lateral' },
  { id: 'garage', label: 'Garagem Luxo', prompt: 'Garagem moderna minimalista com concreto aparente e LED strips' },
]

export default function FlowStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [_strokes, setStrokes] = useState<DrawStroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<DrawPoint[]>([])
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[0].hex)
  const [brushSize, setBrushSize] = useState(8)
  const [tool, setTool] = useState<'brush' | 'eraser' | 'select'>('brush')
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState('')
  const [_hasImage, setHasImage] = useState(false)
  const [_imageLoaded, setImageLoaded] = useState(false)

  // Draw a placeholder car silhouette on the canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.scale(2, 2)

    // Dark background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

    // Grid pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.offsetWidth; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.offsetHeight)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.offsetHeight; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.offsetWidth, y)
      ctx.stroke()
    }

    // Car silhouette
    const cx = canvas.offsetWidth / 2
    const cy = canvas.offsetHeight / 2 + 20
    ctx.save()
    ctx.translate(cx, cy)

    // Body
    ctx.fillStyle = '#2d3436'
    ctx.strokeStyle = '#576574'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(-120, 20)
    ctx.lineTo(-130, 20)
    ctx.quadraticCurveTo(-140, 20, -140, 10)
    ctx.lineTo(-135, -5)
    ctx.lineTo(-90, -15)
    ctx.lineTo(-50, -45)
    ctx.lineTo(30, -50)
    ctx.lineTo(80, -40)
    ctx.lineTo(120, -15)
    ctx.lineTo(140, -5)
    ctx.lineTo(140, 10)
    ctx.quadraticCurveTo(140, 20, 130, 20)
    ctx.lineTo(120, 20)
    ctx.lineTo(-120, 20)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Windows
    ctx.fillStyle = '#0a3d62'
    ctx.beginPath()
    ctx.moveTo(-45, -42)
    ctx.lineTo(-5, -45)
    ctx.lineTo(-5, -15)
    ctx.lineTo(-85, -15)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(0, -45)
    ctx.lineTo(70, -37)
    ctx.lineTo(110, -15)
    ctx.lineTo(0, -15)
    ctx.closePath()
    ctx.fill()

    // Wheels
    ctx.fillStyle = '#111'
    ctx.strokeStyle = '#444'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(-85, 25, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(90, 25, 22, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    // Hubcaps
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.arc(-85, 25, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(90, 25, 12, 0, Math.PI * 2)
    ctx.fill()

    // Headlights
    ctx.fillStyle = '#f9ca24'
    ctx.shadowColor = '#f9ca24'
    ctx.shadowBlur = 15
    ctx.beginPath()
    ctx.ellipse(138, -2, 6, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Taillights
    ctx.fillStyle = '#e74c3c'
    ctx.shadowColor = '#e74c3c'
    ctx.shadowBlur = 12
    ctx.beginPath()
    ctx.ellipse(-138, -2, 5, 8, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    ctx.restore()

    // Instructions text
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.font = '13px system-ui'
    ctx.textAlign = 'center'
    ctx.fillText('Desenhe sobre a área que deseja alterar', cx, canvas.offsetHeight - 25)

    setHasImage(true)
    setImageLoaded(true)
  }, [])

  useEffect(() => {
    initCanvas()
  }, [initCanvas])

  // Redraw all strokes on the canvas
  const _redrawStrokes = useCallback((strokeList: DrawStroke[]) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    for (const stroke of strokeList) {
      if (stroke.points.length < 2) continue
      ctx.save()
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.globalAlpha = 0.7
      ctx.shadowColor = stroke.color
      ctx.shadowBlur = 8
      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }
      ctx.stroke()
      ctx.restore()
    }
  }, [])

  const getCanvasPoint = (e: React.MouseEvent): DrawPoint => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left),
      y: (e.clientY - rect.top),
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === 'select') return
    setIsDrawing(true)
    const pt = getCanvasPoint(e)
    setCurrentStroke([pt])
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || tool === 'select') return
    const pt = getCanvasPoint(e)
    setCurrentStroke((prev) => {
      const newPts = [...prev, pt]
      // Draw live
      const canvas = canvasRef.current
      if (canvas && newPts.length >= 2) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.save()
          ctx.strokeStyle = tool === 'eraser' ? '#1a1a2e' : brushColor
          ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.globalAlpha = tool === 'eraser' ? 1 : 0.7
          if (tool !== 'eraser') {
            ctx.shadowColor = brushColor
            ctx.shadowBlur = 8
          }
          ctx.beginPath()
          ctx.moveTo(newPts[newPts.length - 2].x, newPts[newPts.length - 2].y)
          ctx.lineTo(pt.x, pt.y)
          ctx.stroke()
          ctx.restore()
        }
      }
      return newPts
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentStroke.length > 1) {
      setStrokes((prev) => [
        ...prev,
        { points: currentStroke, color: tool === 'eraser' ? '#1a1a2e' : brushColor, width: tool === 'eraser' ? brushSize * 3 : brushSize },
      ])
    }
    setCurrentStroke([])
  }

  const clearCanvas = () => {
    setStrokes([])
    setCurrentStroke([])
    setGenerated(false)
    initCanvas()
  }

  const handleGenerate = async () => {
    if (!prompt.trim() && !selectedPreset) return
    setGenerating(true)

    // Simulate AI generation
    await new Promise((r) => setTimeout(r, 3000))

    setGenerating(false)
    setGenerated(true)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Canvas Area */}
        <div className="xl:col-span-3 space-y-3">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#2d3436] px-4 py-2.5"
          >
            <div className="flex items-center gap-1.5">
              {/* Tool buttons */}
              <button
                onClick={() => setTool('select')}
                className={`p-2.5 rounded-xl transition-all ${tool === 'select' ? 'bg-white/15 text-white' : 'text-[#576574] hover:text-white hover:bg-white/5'}`}
                title="Selecionar"
              >
                <MousePointer2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool('brush')}
                className={`p-2.5 rounded-xl transition-all ${tool === 'brush' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-[#576574] hover:text-white hover:bg-white/5'}`}
                title="Pincel"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2.5 rounded-xl transition-all ${tool === 'eraser' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-[#576574] hover:text-white hover:bg-white/5'}`}
                title="Borracha"
              >
                <Eraser className="w-4 h-4" />
              </button>

              <div className="w-px h-6 bg-white/10 mx-2" />

              {/* Color Palette */}
              {tool === 'brush' && BRUSH_COLORS.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setBrushColor(c.hex)}
                  className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${brushColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.label}
                />
              ))}

              {tool === 'brush' && (
                <>
                  <div className="w-px h-6 bg-white/10 mx-2" />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#576574] font-bold uppercase">Size</span>
                    <input
                      type="range"
                      min={2}
                      max={20}
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20 accent-purple-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearCanvas}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#576574] hover:text-white hover:bg-white/5 transition-all uppercase tracking-wider"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Limpar
              </button>
            </div>
          </motion.div>

          {/* Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            ref={containerRef}
            className="relative rounded-3xl border border-white/10 bg-[#1a1a2e] overflow-hidden shadow-2xl"
            style={{ aspectRatio: '16/9' }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ cursor: tool === 'brush' ? 'crosshair' : tool === 'eraser' ? 'cell' : 'default' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />

            {/* Generating overlay */}
            <AnimatePresence>
              {generating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 rounded-full border-2 border-purple-500/30 border-t-purple-500 mb-4"
                  />
                  <p className="text-white font-bold text-[15px]">Processando edição com IA...</p>
                  <p className="text-[#576574] text-[12px] mt-1">Aplicando alterações via Flow Studio</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Generated success overlay */}
            <AnimatePresence>
              {generated && !generating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-[#1dd1a1]/20 border border-[#1dd1a1]/30 rounded-full px-4 py-2"
                >
                  <Sparkles className="w-4 h-4 text-[#1dd1a1]" />
                  <span className="text-[12px] font-bold text-[#1dd1a1]">Edição aplicada com sucesso!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Panel */}
        <div className="xl:col-span-1 space-y-4">
          {/* Prompt Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-white/10 bg-[#2d3436] p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="w-4 h-4 text-purple-400" />
              <h3 className="text-[15px] font-bold text-white">Instrução de Edição</h3>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva o que deseja alterar na área marcada... Ex: 'Trocar o fundo por um showroom de vidro com iluminação quente'"
              className="w-full h-28 rounded-2xl border border-white/10 bg-black/30 p-3 text-[14px] text-white placeholder:text-[#444] resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
            />

            <button
              onClick={handleGenerate}
              disabled={generating || (!prompt.trim() && !selectedPreset)}
              className="w-full mt-3 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-[12px] uppercase tracking-wider py-3.5 hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_10px_30px_rgba(139,92,246,0.25)]"
            >
              {generating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              {generating ? 'Gerando...' : 'Aplicar Edição IA'}
            </button>
          </motion.div>

          {/* Preset Backgrounds */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-[#2d3436] p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-blue-400" />
              <h3 className="text-[15px] font-bold text-white">Cenários Rápidos</h3>
            </div>
            <div className="space-y-2">
              {PRESET_BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    setSelectedPreset(bg.id)
                    setPrompt(bg.prompt)
                  }}
                  className={`w-full text-left rounded-xl border p-3 transition-all text-[13px] ${
                    selectedPreset === bg.id
                      ? 'border-purple-500/50 bg-purple-500/10 text-white'
                      : 'border-white/5 bg-black/20 text-[#8395a7] hover:border-white/15 hover:text-white'
                  }`}
                >
                  <span className="font-bold">{bg.label}</span>
                  <p className="text-[11px] opacity-70 mt-0.5 leading-snug">{bg.prompt.slice(0, 50)}...</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Download */}
          {generated && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#1dd1a1] text-black font-black text-[12px] uppercase tracking-wider py-3.5 hover:bg-white transition-all shadow-[0_10px_30px_rgba(29,209,161,0.25)]"
            >
              <Download className="w-4 h-4" /> Baixar Imagem Editada
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
