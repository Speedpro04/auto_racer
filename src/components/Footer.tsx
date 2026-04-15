import { Car } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1E1E1E] py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-[#D4AF3720] border border-[#D4AF3740] flex items-center justify-center">
              <Car className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <span className="text-base font-semibold text-white tracking-tight">
              Solara Auto
            </span>
          </div>
          <p className="text-[#737373] text-sm text-center">
            © 2025 Solara Auto — Plataforma AxosHub. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-[#737373]">
            <a href="#" className="hover:text-[#D4AF37] transition duration-200">Termos</a>
            <a href="#" className="hover:text-[#D4AF37] transition duration-200">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
