import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Loader2, Trophy, ArrowRight, Star, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../lib/api'

function RegisterSuccess() {
  const [searchParams] = useSearchParams()
  const refId = searchParams.get('ref')
  const navigate = useNavigate()

  const [status, setStatus] = useState<'checking' | 'confirmed' | 'pending' | 'error'>('checking')
  const [storeData, setStoreData] = useState({ email: '', store_name: '' })

  // Simula o carregamento e mostra sucesso imediatamente
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('confirmed')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 font-sans relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-[#1dd1a1]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-[#1dd1a1]/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {status === 'checking' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] text-center"
          >
            <Loader2 className="w-14 h-14 text-[#1dd1a1] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-black font-impact italic text-white uppercase tracking-tighter mb-3">Preparando seu painel...</h2>
            <p className="text-[#737373] text-sm font-medium">Estamos configurando seu acesso e ambiente premium.</p>
          </motion.div>
        )}

        {status === 'confirmed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="bg-[#0a0a0a] border border-[#1dd1a1]/30 rounded-[40px] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(29,209,161,0.15)] text-center overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1dd1a1]/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1dd1a1]/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Trophy icon */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center"
              >
                <div className="w-24 h-24 bg-[#1dd1a1]/20 rounded-full flex items-center justify-center border-2 border-[#1dd1a1]/30">
                  <Trophy className="w-12 h-12 text-[#1dd1a1]" />
                </div>
              </motion.div>

              {/* Main Message */}
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-black font-impact italic text-white uppercase tracking-tighter mb-3"
                >
                  Você faz parte do<br />
                  <span className="text-[#1dd1a1] drop-shadow-[0_0_30px_rgba(29,209,161,0.4)]">Time Auto Racer!</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[#8395a7] text-sm font-medium leading-relaxed"
                >
                  Parabéns, <span className="text-white font-bold">{storeData.store_name || 'Parceiro'}</span>! Sua conta foi criada com sucesso. 
                  Enviamos um email de confirmação para <span className="text-[#1dd1a1] font-bold">{storeData.email}</span>.
                </motion.p>
              </div>

              {/* Checklist */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1dd1a1] mb-2">Próximos Passos</p>
                {[
                  "Faça login com seu email e senha",
                  "Configure o perfil da sua loja",
                  "Cadastre seus primeiros veículos",
                  "Comece a vender!"
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[#1dd1a1]/20 rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-[#1dd1a1]" />
                    </div>
                    <span className="text-sm text-white font-medium">{step}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <button
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-4 bg-[#1dd1a1] text-black px-6 py-6 rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(29,209,161,0.3)]"
                >
                  <Zap className="w-5 h-5" />
                  <span>Acessar Meu Painel</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>

              <div className="flex items-center justify-center gap-3 opacity-40">
                <Star className="w-3 h-3 text-[#1dd1a1] fill-[#1dd1a1]" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Powered by Auto Racer Technology</span>
                <Star className="w-3 h-3 text-[#1dd1a1] fill-[#1dd1a1]" />
              </div>
            </div>
          </motion.div>
        )}

        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] text-center space-y-6"
          >
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-black font-impact italic text-white uppercase tracking-tighter">Pagamento em Processamento</h2>
            <p className="text-[#737373] text-sm font-medium">Seu pagamento ainda está sendo processado de forma segura pelo Stripe. Assim que for confirmado, sua conta será ativada automaticamente e você receberá um email.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-3 bg-white/10 text-white px-6 py-4 rounded-2xl hover:bg-white/20 transition-all font-black uppercase text-xs tracking-[0.2em]"
            >
              Verificar Novamente
            </button>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] border border-[#ff6b6b]/20 rounded-[40px] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] text-center space-y-6"
          >
            <h2 className="text-2xl font-black font-impact italic text-white uppercase tracking-tighter">Erro na Verificação</h2>
            <p className="text-[#737373] text-sm font-medium">Não conseguimos verificar seu pagamento. Entre em contato com nosso suporte.</p>
            <button
              onClick={() => navigate('/parceiro')}
              className="w-full flex items-center justify-center gap-3 bg-[#1dd1a1] text-black px-6 py-4 rounded-2xl hover:bg-white transition-all font-black uppercase text-xs tracking-[0.2em]"
            >
              Voltar aos Planos
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default RegisterSuccess
