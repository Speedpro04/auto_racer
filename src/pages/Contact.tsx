import { useEffect } from 'react'
import { MapPin, Phone, Mail, ArrowRight, ShieldCheck, Video, Sparkles, Palette, Wand2, Zap, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'

function Contact() {
  useEffect(() => {
    document.title = "Consultoria Elite | Auto Racer"
  }, [])

  return (
    <div className="bg-[#0B0E14] min-h-screen text-white pt-40 pb-20 relative overflow-hidden">
      
      {/* Elementos de fundo e Turbina */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#1dd1a1]/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#1dd1a1]/5 blur-[250px] rounded-full pointer-events-none z-0" />
      
      {/* Turbina Gigante na Base */}
      <div className="absolute bottom-[320px] left-0 w-full flex justify-center pointer-events-none select-none z-0 opacity-40">
         <img src="/turbina.png" className="w-[1480px] max-w-none object-contain -rotate-[35deg]" alt="Turbina Auto Racer" />
      </div>

      <div className="max-w-[1140px] mx-auto px-6 relative z-10">
        
        {/* Cabeçalho */}
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1dd1a1]/10 text-[#1dd1a1] text-[10px] font-black uppercase tracking-widest border border-[#1dd1a1]/20 mb-6 relative">
            <Zap className="w-3" />
            Plataforma de Inteligência Automotiva
          </span>
          <h1 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase mb-6 italic">
            Sua Loja Vendendo <br />
            <span className="text-[#1dd1a1]">no Piloto Automático.</span>
          </h1>
          <p className="font-['Architects_Daughter'] text-2xl text-[#1dd1a1] opacity-80 mb-6">
            "Geração de vídeos, marketing inteligente e identidade visual — tudo feito por IA, em segundos."
          </p>
          <p className="text-[#8395a7] text-lg font-medium leading-relaxed">
            O Auto Racer não é mais um sistema de anúncio. É um ecossistema completo que gera vídeos profissionais dos seus veículos, extrai a identidade da sua marca e cria conteúdo de marketing que converte — enquanto você foca no que importa: fechar negócios.
          </p>
        </header>

        {/* Seção de Funcionalidades para Lojistas */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            
            {/* Card 1: Geração de Vídeos */}
            <div className="bg-[#14181C] p-8 rounded-[35px] border border-white/5 hover:border-[#1dd1a1]/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#1dd1a1]/5 blur-[60px] rounded-full transition-colors group-hover:bg-[#1dd1a1]/15" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#1dd1a1]/10 border border-[#1dd1a1]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Video className="w-7 h-7 text-[#1dd1a1]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3 italic">Vídeos Automáticos</h3>
                <p className="text-[#8395a7] text-sm font-medium leading-relaxed mb-4">
                  Selecione o veículo, escolha o template de venda e a IA gera um vídeo profissional com narração, legendas e copy persuasiva — pronto para postar no Instagram, TikTok e WhatsApp.
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-[#1dd1a1] uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> 4 Templates de Conversão
                </span>
              </div>
            </div>

            {/* Card 2: Identidade Visual IA */}
            <div className="bg-[#14181C] p-8 rounded-[35px] border border-white/5 hover:border-purple-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 blur-[60px] rounded-full transition-colors group-hover:bg-purple-500/15" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Palette className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3 italic">Brand DNA Inteligente</h3>
                <p className="text-[#8395a7] text-sm font-medium leading-relaxed mb-4">
                  Cole a URL da sua loja e a IA extrai sua paleta de cores, tipografia e tom de voz automaticamente. Todos os vídeos e conteúdos gerados seguem a identidade da sua marca — sem precisar de designer.
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Análise Automática de Marca
                </span>
              </div>
            </div>

            {/* Card 3: Edição Visual IA */}
            <div className="bg-[#14181C] p-8 rounded-[35px] border border-white/5 hover:border-blue-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-[60px] rounded-full transition-colors group-hover:bg-blue-500/15" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3 italic">Edição Visual com IA</h3>
                <p className="text-[#8395a7] text-sm font-medium leading-relaxed mb-4">
                  Marque qualquer área da foto do veículo e descreva o que deseja alterar. A IA troca fundos, destaca atributos e transforma fotos amadoras em imagens de catálogo profissional.
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> 5 Cenários Cinematográficos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Frase de impacto */}
        <section className="mb-20 max-w-4xl mx-auto text-center">
          <div className="relative rounded-[45px] bg-gradient-to-br from-[#0d1117] to-[#14181C] border border-[#1dd1a1]/20 p-12 md:p-16 shadow-[0_30px_60px_-15px_rgba(29,209,161,0.1)] overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#1dd1a1]/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <TrendingUp className="w-10 h-10 text-[#1dd1a1] mx-auto mb-6" />
              <h2 className="text-xl md:text-[32px] font-black font-impact tracking-tighter uppercase italic leading-[1.1] mb-4">
                Uma agência de marketing <span className="text-[#1dd1a1]">inteira</span><br />dentro do painel da sua loja.
              </h2>
              <p className="text-[#8395a7] text-lg font-medium leading-relaxed max-w-2xl mx-auto">
                O que antes custava R$ 3.000/mês com agência + designer + editor de vídeo, agora está incluso na sua assinatura do Auto Racer. Gere conteúdo profissional em segundos, não em dias.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          
          {/* Coluna da Esquerda: Canais de Contato Direto */}
          <div className="space-y-8">
            <div className="bg-[#14181C] p-10 rounded-[40px] border border-white/5 hover:border-[#1dd1a1]/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl transition-colors group-hover:bg-[#1dd1a1]/20" />
              <Phone className="w-8 h-8 text-[#1dd1a1] mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Fale com um Especialista</h3>
              <p className="text-[#8395a7] text-sm font-medium mb-6">Quer ver o sistema funcionando ao vivo? Nosso time faz uma demonstração completa para sua loja — sem compromisso.</p>
              <div className="flex flex-col gap-2">
                <a href="tel:+5512997588791" className="text-xl font-black text-white hover:text-[#1dd1a1] transition-colors">
                  (12) 99758-8791
                </a>
                <a href="tel:+5512978138934" className="text-xl font-black text-white hover:text-[#1dd1a1] transition-colors">
                  (12) 97813-8934
                </a>
              </div>
            </div>

            <div className="bg-[#14181C] p-10 rounded-[40px] border border-white/5 hover:border-[#1dd1a1]/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl transition-colors group-hover:bg-[#1dd1a1]/20" />
              <Mail className="w-8 h-8 text-[#1dd1a1] mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">E-mail Oficial</h3>
              <p className="text-[#8395a7] text-sm font-medium mb-6">Propostas comerciais, parcerias B2B e suporte dedicado.</p>
              <a href="mailto:axushu50@gmail.com" className="text-xl font-bold text-white hover:text-[#1dd1a1] transition-colors break-all">
                axushu50@gmail.com
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 text-center flex flex-col justify-center items-center">
                <ShieldCheck className="w-6 h-6 text-[#1dd1a1] mx-auto mb-4" />
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[#576574] mb-2">Cobertura</h4>
                <p className="text-white font-bold">100% Digital<br/>Todo o Brasil</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 text-center flex flex-col justify-center items-center">
                <MapPin className="w-6 h-6 text-[#1dd1a1] mx-auto mb-4" />
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[#576574] mb-2">Sede Corporativa</h4>
                <p className="text-white font-bold text-sm">Pindamonhangaba<br/>São Paulo, BR</p>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Card de Conversão para Lojistas */}
          <div className="bg-gradient-to-br from-[#0d1117] to-[#14181C] border border-[#1dd1a1]/30 rounded-[50px] p-12 relative shadow-[0_30px_60px_-15px_rgba(29,209,161,0.15)] h-full flex flex-col justify-center">
            
            <h2 className="text-xl lg:text-xl font-black font-impact tracking-tighter uppercase italic mb-6">
              Pare de Perder Vendas <br />por Falta de Conteúdo.
            </h2>
            <p className="font-['Architects_Daughter'] text-xl text-[#1dd1a1] opacity-90 mb-8 rotate-[-2deg]">
              "Seus concorrentes já estão usando IA. E você?"
            </p>
            
            <p className="text-[#8395a7] text-lg font-medium leading-relaxed mb-10">
              A cada dia sem conteúdo profissional, sua loja perde alcance, leads e vendas. Com o Auto Racer, você gera vídeos, artes e copies de alta conversão direto do painel — sem depender de agência, designer ou editor.
            </p>

            <Link 
              to="/parceiro"
              className="w-full flex items-center justify-center gap-4 py-8 bg-[#1dd1a1] text-black font-black uppercase tracking-widest text-sm rounded-[30px] hover:bg-white hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(29,209,161,0.3)] transition-all duration-300"
            >
              QUERO TESTAR 10 DIAS GRÁTIS <ArrowRight size={20} />
            </Link>
            
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#1dd1a1]/10 flex items-center justify-center flex-shrink-0">
                  <Video className="w-4 h-4 text-[#1dd1a1]" />
                </div>
                <span className="text-xs font-bold text-[#8395a7] uppercase tracking-wider">Geração de Vídeos com Narração e Legendas</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <Palette className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-xs font-bold text-[#8395a7] uppercase tracking-wider">Marketing IA com Identidade da Sua Marca</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <Wand2 className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-[#8395a7] uppercase tracking-wider">Edição Visual Inteligente de Fotos</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#1dd1a1]" />
                </div>
                <span className="text-xs font-bold text-[#8395a7] uppercase tracking-wider">Sigilo Total de Dados Fiscais</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contact
