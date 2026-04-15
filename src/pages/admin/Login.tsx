import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, LogIn } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4 font-sans">
      <div className="bg-[#141414] rounded-[15px] p-8 w-full max-w-md border border-[#262626] shadow-2xl">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-[15px] bg-[#0A0A0A] flex items-center justify-center shadow-inner border border-[#262626]">
              <Car className="w-8 h-8 text-[#1dd1a1]" />
            </div>
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">
            Solara Auto
          </h1>
          <p className="text-[#A3A3A3] text-sm font-medium">Painel Administrativo da Loja</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-[#ff6b6b] border border-[#ff6b6b]/20 bg-[#ff6b6b]/10 px-4 py-3 rounded-[8px] text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-[8px] border border-[#262626] focus:border-[#1dd1a1] focus:ring-[#1dd1a1] outline-none transition"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A3A3A3] mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-[8px] border border-[#262626] focus:border-[#1dd1a1] focus:ring-[#1dd1a1] outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1dd1a1] text-[#0A0A0A] px-6 py-3.5 rounded-[8px] hover:bg-white transition font-semibold disabled:opacity-50 mt-2 shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'Autenticando...' : 'Acessar Painel'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-[#737373]">
          <a href="/" className="text-[#A3A3A3] hover:text-[#1dd1a1] transition duration-200">
            &larr; Voltar para a vitrine
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
