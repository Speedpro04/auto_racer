import { useState, useMemo, useEffect } from 'react'
import { Calculator, Send, Car, Wallet, ArrowRight, X } from 'lucide-react'

interface FinancingCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FinancingCalculator({ isOpen, onClose }: FinancingCalculatorProps) {
  const [vehicleValue, setVehicleValue] = useState<number>(350000)
  const [downPayment, setDownPayment] = useState<number>(150000)
  const [installments, setInstallments] = useState<number>(48)
  
  // States for Lead Form
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // FinMath: Basic PMT calculation for fixed rate loans
  // Rate: ~1.49% a.m. (simulated premium rate)
  const monthlyRate = 0.0149 
  
  const handleVehicleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setVehicleValue(val)
    if (downPayment > val) setDownPayment(val)
  }

  const { installmentValue, totalFinanced } = useMemo(() => {
    const principal = vehicleValue - downPayment
    if (principal <= 0) return { installmentValue: 0, totalFinanced: 0 }
    
    // PMT = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const factor = Math.pow(1 + monthlyRate, installments)
    const pmt = (principal * monthlyRate * factor) / (factor - 1)
    
    return { 
      installmentValue: pmt, 
      totalFinanced: principal 
    }
  }, [vehicleValue, downPayment, installments, monthlyRate])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const submitLead = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Pré-negociação gerada com sucesso!\nVeículo: ${formatCurrency(vehicleValue)}\nEntrada: ${formatCurrency(downPayment)}\nParcelas: ${installments}x de ${formatCurrency(installmentValue)}`)
    // Here we'd map to a webhook or API endpoint
  }

  // Fechar no Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] p-4 overflow-y-auto flex justify-center items-start">
      {/* Dark Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <section className="relative w-full max-w-[950px] mt-12 mb-12 px-6 pt-[55px] pb-10 rounded-[35px] border border-white/10 bg-[#050505] shadow-[0_0_100px_rgba(29,209,161,0.1)]">
        {/* Botão Fechar dentro do Card */}
        <button 
          onClick={onClose}
          className="absolute top-[39px] right-[39px] p-2 bg-white/5 hover:bg-red-500/20 text-[#555] hover:text-red-500 rounded-full transition-all z-[100] shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#1dd1a1]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="text-center mb-8 relative z-10">
         <h2 className="text-3xl md:text-5xl font-black font-impact tracking-tighter uppercase mb-2 italic">
            Simulador de <span className="text-[#1dd1a1]">Condições</span>
         </h2>
         <p className="font-['Architects_Daughter'] text-xl text-[#8395a7]">Personalize seu investimento sem enrolação</p>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#0B0E14] border border-[#1dd1a1]/20 rounded-[40px] p-6 shadow-[0_30px_80px_-20px_rgba(29,209,161,0.15)]">
         
         {/* Calculator Side */}
         <div className="space-y-10">
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#1dd1a1]">
                <Calculator size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white">Configurar Cenário</h3>
                <span className="text-[#1dd1a1] space-x-1 text-xs font-bold tracking-widest uppercase">Taxa Premium Garantida</span>
              </div>
            </div>

            {/* Slider 1: Valor do Veículo */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <label className="text-xs font-black uppercase tracking-widest text-[#8395a7]">Valor do Veículo R$</label>
                 <span className="text-2xl font-black text-white">{formatCurrency(vehicleValue)}</span>
              </div>
              <input 
                type="range" 
                min="100000" max="5000000" step="50000"
                value={vehicleValue} onChange={handleVehicleValueChange}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#1dd1a1]"
              />
              <div className="flex justify-between text-[10px] text-[#555] font-black tracking-widest">
                <span>R$ 100k</span><span>R$ 5 Milhões+</span>
              </div>
            </div>

            {/* Slider 2: Entrada */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                 <label className="text-xs font-black uppercase tracking-widest text-[#8395a7]">Sua Entrada (Ou Usado)</label>
                 <span className="text-2xl font-black text-[#1dd1a1]">{formatCurrency(downPayment)}</span>
              </div>
              <input 
                type="range" 
                min="0" max={vehicleValue} step="10000"
                value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#00f3ff]"
              />
              <div className="flex justify-between text-[10px] text-[#555] font-black tracking-widest">
                <span>R$ 0</span><span>{formatCurrency(vehicleValue)}</span>
              </div>
            </div>

            {/* Buttons: Parcelas */}
            <div className="space-y-4">
               <label className="text-xs font-black uppercase tracking-widest text-[#8395a7]">Número de Parcelas</label>
               <div className="flex flex-wrap gap-3">
                  {[12, 24, 36, 48, 60].map(m => (
                    <button 
                      key={m}
                      onClick={() => setInstallments(m)}
                      className={`flex-1 py-3 border rounded-xl font-black text-sm transition-all
                        ${installments === m 
                          ? 'bg-[#1dd1a1] border-[#1dd1a1] text-black shadow-[0_0_20px_rgba(29,209,161,0.3)]' 
                          : 'bg-transparent border-white/10 text-white hover:border-[#1dd1a1]/50'}`}
                    >
                      {m}x
                    </button>
                  ))}
               </div>
            </div>

            {/* Result Box */}
            <div className="mt-8 p-6 bg-black/40 rounded-3xl border border-white/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#1dd1a1]/10 blur-[50px] translate-x-1/2 -translate-y-1/2" />
               <div className="flex flex-col gap-1 relative z-10">
                  <span className="text-xs font-black uppercase tracking-widest text-[#555]">Investimento Mensal (Estimado)</span>
                  <div className="flex items-baseline gap-2">
                     <span className="text-xl text-[#00f3ff] font-black">R$</span>
                     <span className="text-5xl font-impact tracking-tighter text-white italic">{installmentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#8395a7] mt-2 block tracking-widest">
                     Valor financiado: {formatCurrency(totalFinanced)}
                  </span>
               </div>
            </div>
         </div>

         {/* Form Side */}
         <div className="relative">
            <div className="absolute inset-y-0 -left-6 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
            
            <form onSubmit={submitLead} className="flex flex-col h-full justify-between space-y-8 lg:pl-6">
               <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                     Pré-Negociação <Wallet className="text-[#1dd1a1]" />
                  </h3>
                  <p className="text-sm font-medium text-[#8395a7]">
                     Tranque essas condições. Um especialista entrará em contato via WhatsApp em minutos para validar seu crédito.
                  </p>
               </div>

               <div className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#555] px-2">Nome Completo</label>
                     <input 
                        type="text" required
                        value={name} onChange={e => setName(e.target.value)}
                        placeholder="Ex: João da Silva..."
                        className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-[#333] focus:border-[#1dd1a1]/50 outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#555] px-2">WhatsApp / Telefone</label>
                     <input 
                        type="tel" required
                        value={phone} onChange={e => setPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-[#333] focus:border-[#00f3ff]/50 outline-none transition-all"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-[#555] px-2">E-mail Profissional</label>
                     <input 
                        type="email" required
                        value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="contato@empresa.com"
                        className="w-full bg-[#050505] border border-white/5 rounded-2xl py-4 px-6 text-sm text-white placeholder:text-[#333] focus:border-[#1dd1a1]/50 outline-none transition-all"
                     />
                  </div>
               </div>

               {/* Action Button */}
               <button type="submit" className="w-full flex items-center justify-between p-2 pl-8 bg-[#1dd1a1] text-black rounded-[20px] group overflow-hidden relative shadow-[0_0_20px_rgba(29,209,161,0.2)] hover:shadow-[0_0_40px_rgba(0,243,255,0.3)] transition-all duration-300">
                  <div className="absolute inset-0 bg-[#00f3ff] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
                  <span className="font-black uppercase tracking-[0.2em] text-[11px] relative z-10 group-hover:text-[#555] transition-colors">
                     Solicitar Análise Expressa
                  </span>
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center relative z-10">
                     <Send className="w-4 h-4 text-white group-hover:scale-110 group-hover:text-[#00f3ff] transition-all duration-300 -rotate-12 group-hover:rotate-0" />
                  </div>
               </button>
               <p className="text-[9px] text-[#555] uppercase text-center font-bold tracking-widest mt-4">
                  Análise sigilosa e segura. Zero compromisso de compra.
               </p>
            </form>
         </div>
      </div>
      </section>
    </div>
  )
}
