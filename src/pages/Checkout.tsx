import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle2, ShieldCheck, Zap, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

function Checkout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Simulando dados que viriam do registro ou estado global
  const planData = {
    name: 'Plano Parceiro',
    price: '69,90',
    description: 'Vitrine Premium Compartilhada',
    features: [
      'Cadastro Ilimitado de Veículos',
      'Acesso ao Módulo Racer Redes (Vídeos IA)',
      'Integração com Second Brain (IA)',
      'Suporte Prioritário'
    ]
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')
    
    // Recuperar dados temporários do registro (podem estar no localStorage)
    const regDataRaw = localStorage.getItem('pending_reg_data')
    if (!regDataRaw) {
      setError('Dados de cadastro não encontrados. Por favor, preencha o formulário novamente.')
      setLoading(false)
      setTimeout(() => navigate('/parceiro'), 3000)
      return
    }

    const regData = JSON.parse(regDataRaw)

    try {
      const response = await api.post('/api/v1/payments/create-checkout', {
        email: regData.email,
        password: regData.password,
        store_name: regData.storeName,
        phone: regData.phone,
        owner_name: regData.name
      })

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url
      } else {
        throw new Error('Não foi possível gerar o link de pagamento.')
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Erro ao processar checkout. Verifique se o backend está online.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1dd1a1]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1dd1a1]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[#444] hover:text-[#1dd1a1] transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Plan Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-black font-impact italic uppercase tracking-tighter mb-2">
                Checkout <span className="text-[#1dd1a1]">Seguro</span>
              </h1>
              <p className="text-[#8395a7] font-medium">Finalize sua assinatura para liberar o acesso total ao sistema.</p>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-20 h-20 text-[#1dd1a1]" />
              </div>
              
              <h2 className="text-xl font-bold mb-1">{planData.name}</h2>
              <p className="text-xs font-black uppercase tracking-widest text-[#576574] mb-6">{planData.description}</p>
              
              <div className="flex items-end gap-2 mb-8">
                <span className="text-4xl font-black font-impact text-[#1dd1a1]">R$ {planData.price}</span>
                <span className="text-[#576574] text-xs font-bold uppercase tracking-widest pb-1">/mês</span>
              </div>

              <ul className="space-y-4">
                {planData.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8395a7]">
                    <CheckCircle2 className="w-4 h-4 text-[#1dd1a1]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
              <ShieldCheck className="w-8 h-8 text-[#1dd1a1]" />
              <div className="text-[10px] text-[#576574] font-bold uppercase tracking-widest leading-relaxed">
                Pagamento processado via <span className="text-white">Stripe</span>. 
                Ambiente 100% criptografado e seguro.
              </div>
            </div>
          </motion.div>

          {/* Payment Action */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-gradient-to-br from-[#1dd1a1]/10 to-transparent border border-[#1dd1a1]/20 rounded-[40px] p-10 text-center">
              <div className="w-20 h-20 bg-[#1dd1a1] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(29,209,161,0.3)]">
                <CreditCard className="w-10 h-10 text-black" />
              </div>
              
              <h3 className="text-2xl font-black font-impact italic uppercase mb-4">Quase lá!</h3>
              <p className="text-sm text-[#8395a7] mb-10 leading-relaxed">
                Ao clicar no botão abaixo, você será redirecionado para a página oficial do Stripe para concluir o pagamento de forma segura.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#1dd1a1] text-black px-6 py-6 rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(29,209,161,0.3)] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Ir para Pagamento</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <p className="mt-6 text-[9px] text-[#444] font-black uppercase tracking-[0.3em]">
                Sem fidelidade. Cancele quando quiser.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
