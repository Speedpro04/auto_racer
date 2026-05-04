import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function AboutUs() {
  useEffect(() => {
    document.title = "Nossa História | Auto Racer - Concessionária de Carros de Luxo";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Conheça a Auto Racer: especializada em carros seminovos, importados e de luxo. 120 pontos de inspeção, garantia estendida e financiamento facilitado.');
    }
  }, [])

  return (
    <div className="bg-[#0B0E14] min-h-screen text-white pb-20 overflow-hidden">
      
      {/* FULLSCREEN HERO SECTION WITH IMAGE 02 */}
      <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image - assuming public/logo/imagem 02.png or just an unsplash placeholder if not found, but setting up the structure */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/logo/imagem 02.png" 
            onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=80" }} // Fallback
            alt="Auto Racer Asset" 
            className="w-full h-full object-cover grayscale-[0.3]"
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E14]/90 via-[#0B0E14]/70 to-[#0B0E14]" />
        </div>

        <div className="relative z-10 max-w-[1140px] px-6 text-center mt-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1dd1a1]/10 text-[#1dd1a1] text-[10px] font-black uppercase tracking-widest border border-[#1dd1a1]/20 mb-8 animate-pulse">
            CONECTANDO VOCÊ AOS MELHORES
          </span>
          <h1 className="text-xl md:text-xl lg:text-[58px] font-black font-impact tracking-tighter uppercase mb-6 italic leading-[0.9] drop-shadow-2xl text-white">
            O Seu Novo <br />
            <span className="text-[#1dd1a1]">Portal Automotivo.</span>
          </h1>
          <p className="font-['Architects_Daughter'] text-xl md:text-xl text-[#1dd1a1] opacity-90 mb-10 rotate-[-2deg]">
            "Conectamos você a uma vitrine com dezenas de veículos na sua região."
          </p>
          <p className="text-[#8395a7] text-xl md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
            A Auto Racer é um marketplace tecnológico focado em veículos premium. Nossa missão é trazer acessibilidade e comodidade, reunindo o estoque de diversos lojistas em um único lugar. Escolha o seu veículo e negocie direto com o vendedor.
          </p>
        </div>
      </section>

      {/* SPIN Content - O Problema e a Solução */}
      <div className="max-w-[1140px] mx-auto px-6 relative z-10 mt-[-50px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32 bg-[#14181C]/90 backdrop-blur-md p-10 md:p-16 rounded-[50px] border border-white/5 shadow-2xl">
          <div className="space-y-8">
            <h3 className="text-xl font-black font-impact tracking-tighter uppercase italic leading-[1.1]">
              Encontrar o carro ideal <br /><span className="text-[#1dd1a1]">era cansativo.</span>
            </h3>
            <p className="text-[#8395a7] text-lg font-medium leading-relaxed">
              Procurar o veículo dos sonhos exigia visitar dezenas de lojas presencialmente, lidar com diferentes perfis de atendimento, gastar tempo no trânsito e tentar comparar opções de forma espalhada.
            </p>
            <p className="text-white text-xl font-bold leading-relaxed border-l-4 border-[#1dd1a1] pl-6 italic">
              O mercado precisava de centralização e facilidade de acesso.
            </p>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-black font-impact tracking-tighter uppercase italic leading-[1.1]">
              A Nossa <span className="text-[#1dd1a1]">Vitrine</span> Definitiva.
            </h3>
            <p className="text-[#8395a7] text-lg font-medium leading-relaxed">
              A Auto Racer centraliza os estoques de diversas lojas da região em uma única plataforma digital. <span className="text-[#1dd1a1] font-bold">Nós somos a ponte que leva você até a sua nova aquisição.</span>
            </p>
            <p className="text-white text-xl font-bold leading-relaxed border-l-4 border-[#1dd1a1] pl-6 italic">
              Para manter a máxima transparência, reforçamos que a responsabilidade legal e comercial sobre os veículos é exclusiva das lojas parceiras.
            </p>
            <p className="text-[#8395a7] text-lg font-medium leading-relaxed">
              Dessa forma, toda negociação de valores, garantias, procedência e laudos é tratada de forma direta entre você e o lojista especialista que anunciou o veículo.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-32">
          <div className="bg-gradient-to-b from-[#14181C] to-[#0B0E14] p-10 rounded-[30px] border border-[#1dd1a1]/20 hover:border-[#1dd1a1] transition-all group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl rounded-full group-hover:bg-[#1dd1a1]/20 transition-colors" />
            <h4 className="font-['Architects_Daughter'] text-xl md:text-xl text-[#1dd1a1] mb-6 rotate-[-5deg]">"Tudo em um lugar"</h4>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Vitrine Digital</h4>
            <p className="text-[#576574] text-sm font-bold uppercase tracking-widest leading-relaxed">Filtre, compare e encontre seu próximo veículo sem sair de casa, navegando pelo estoque de múltiplas lojas.</p>
          </div>
          <div className="bg-gradient-to-b from-[#14181C] to-[#0B0E14] p-10 rounded-[30px] border border-[#1dd1a1]/20 hover:border-[#1dd1a1] transition-all group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl rounded-full group-hover:bg-[#1dd1a1]/20 transition-colors" />
            <h4 className="font-['Architects_Daughter'] text-xl md:text-xl text-[#1dd1a1] mb-6 rotate-[-5deg]">"Zero barreira"</h4>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Contato Direto</h4>
            <p className="text-[#576574] text-sm font-bold uppercase tracking-widest leading-relaxed">A Auto Racer não interfere na venda. Ao escolher um modelo, você clica e fala direto com a loja dona do veículo.</p>
          </div>
          <div className="bg-gradient-to-b from-[#14181C] to-[#0B0E14] p-10 rounded-[30px] border border-[#1dd1a1]/20 hover:border-[#1dd1a1] transition-all group overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl rounded-full group-hover:bg-[#1dd1a1]/20 transition-colors" />
            <h4 className="font-['Architects_Daughter'] text-xl md:text-xl text-[#1dd1a1] mb-6 rotate-[-5deg]">"Foco no usuário"</h4>
            <h4 className="text-2xl font-black uppercase tracking-tighter mb-4 text-white">Tecnologia</h4>
            <p className="text-[#576574] text-sm font-bold uppercase tracking-widest leading-relaxed">Nossa plataforma foi desenvolvida para ser acessível e intuitiva, facilitando a sua busca diária.</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative rounded-[50px] overflow-hidden bg-gradient-to-br from-[#0d1117] to-[#14181C] border border-[#1dd1a1]/30 p-16 md:p-24 text-center shadow-[0_0_100px_rgba(29,209,161,0.05)]">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1dd1a1]/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase italic mb-6 text-white">
              Pronto para explorar a <span className="text-[#1dd1a1]">Plataforma?</span>
            </h2>
            <p className="text-[#8395a7] text-xl font-medium mb-12">
              Explore nossa vitrine e encontre as melhores oportunidades disponíveis nas concessionárias da região.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                to="/catalogo"
                className="px-10 py-6 bg-[#1dd1a1] text-black font-black uppercase tracking-widest rounded-[25px] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(29,209,161,0.4)] flex items-center justify-center gap-3"
              >
                Acessar Catálogo Agora <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AboutUs
