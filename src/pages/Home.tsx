import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Search, ArrowRight, ShieldCheck, Zap, Star, Bike, Play, Gauge, Shield, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../lib/api'
import { VehicleWithMedia, Store } from '../types'
import FinancingCalculator from '../components/FinancingCalculator'

function Home() {
  const [recentVehicles, setRecentVehicles] = useState<VehicleWithMedia[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, storesRes] = await Promise.all([
          api.get('/vehicles?limit=12'),
          api.get('/stores'),
        ])
        setRecentVehicles(vehiclesRes.data)
        setStores(storesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const spotlightVehicles = recentVehicles.slice(0, 6)

  return (
    <div className="text-white font-sans w-full overflow-hidden">
      
      {/* Modern Slim Search Section Just Below Menu */}
      <section className="relative pt-[190px] px-6 z-30 mb-8 max-w-[1080px] mx-auto">
        <div className="w-full flex flex-col md:flex-row items-center gap-2 p-1.5 rounded-full bg-[#0A0D10]/80 border border-white/10 backdrop-blur-md shadow-lg">
           <div className="flex-1 w-full relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555] group-focus-within:text-[#1dd1a1] transition-colors" />
             <input 
               type="text" 
               placeholder="Busque por marca, modelo ou potência..." 
               className="w-full bg-transparent py-2.5 pl-12 pr-4 text-white text-sm placeholder:text-[#555] outline-none focus:border-transparent transition-all"
               style={{ boxShadow: 'none' }}
             />
           </div>
           <button className="w-full md:w-auto px-6 py-2.5 bg-[#1dd1a1] text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-[#00f3ff] hover:text-[#555] transition-all">
             Buscar
           </button>
        </div>
      </section>

      {/* Dynamic Hero Section with Luxury Flare */}
      <section className="relative pt-12 pb-40 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1140px] h-[800px] bg-[#1dd1a1]/5 blur-[120px] rounded-full" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#1dd1a1]/10 blur-[100px] rounded-full" />
        <img 
          src="/logo-auto-destaque.png" 
          alt="" 
          className="absolute bottom-0 right-0 w-[800px] opacity-[0.04] pointer-events-none select-none object-contain" 
        />
        
        <div className="max-w-[1140px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-[#1dd1a1] mb-12 animate-pulse shadow-[0_0_20px_rgba(29,209,161,0.1)]">
              <Sparkles className="w-3" />
              Experiência Automotiva de Elite 2026
            </div>
            
            <h1 className="text-4xl md:text-[55px] font-black font-['Architects_Daughter'] tracking-tighter mb-10 leading-[1] text-white uppercase mt-4">
              MAIS QUE POTÊNCIA,<br />
              <span className="text-[#1dd1a1] drop-shadow-[0_0_20px_rgba(29,209,161,0.5)]">ESTADO DE ARTE</span>
            </h1>

            <p className="text-[#8395a7] text-lg md:text-2xl max-w-3xl mx-auto mb-20 font-medium tracking-tight leading-relaxed">
              Descubra uma curadoria absoluta das máquinas mais extraordinárias. Design vanguardista e performance que desafia os limites do possível.
            </p>
          </div>

          {/* Hero Featured Card (Big Highlight) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative max-w-[950px] mx-auto h-[400px] md:h-[500px] rounded-[50px] overflow-hidden border border-[#1dd1a1] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
          >
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
             <img 
               src={spotlightVehicles[0]?.media?.[0]?.url || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=2070"} 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" 
             />
          </motion.div>

          {/* Hero Details Extracted Below Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-[950px] mx-auto mt-10 flex flex-col md:flex-row md:items-start justify-between gap-8 text-left"
          >
             <div>
                <span className="inline-block px-4 py-2 bg-[#1dd1a1] text-black text-[10px] font-black uppercase tracking-widest rounded-xl mb-4">Destaque do Mês</span>
                <h2 className="text-4xl md:text-[50px] font-black font-impact tracking-tighter uppercase mb-4 italic">{spotlightVehicles[0]?.title || "Porsche 911 GT3 RS"}</h2>
                <p className="font-['Architects_Daughter'] text-2xl text-[#1dd1a1] mb-2">"Venha conferir esse maravilhoso carro!"</p>
             </div>
             <div className="flex flex-col gap-4 min-w-[200px] items-start md:items-end">
                <span className="text-3xl font-black text-white tracking-widest">{spotlightVehicles[0] ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spotlightVehicles[0].price) : "R$ 1.850.000"}</span>
                <Link to={spotlightVehicles[0] ? `/veiculo/${spotlightVehicles[0].id}` : "#"} className="flex items-center justify-center gap-2 px-8 py-5 bg-[#1dd1a1] text-black font-black uppercase text-xs tracking-widest rounded-[20px] hover:bg-[#00f3ff] hover:text-[#555] transition-all group/btn">
                   Falar com Especialista <Play className="w-4 h-4 text-black group-hover/btn:text-[#555] transition-colors" />
                </Link>
             </div>
          </motion.div>
        </div>
      </section>



      {/* Featured Showcase Section (Alternating) */}
      <section className="max-w-[1140px] mx-auto px-6 mb-[60px] space-y-40">
        <div className="text-center mb-20">
           <h2 className="text-4xl md:text-6xl font-black font-impact tracking-tighter uppercase mb-6 italic">Curadoria de <span className="text-[#1dd1a1]">Puro-Sangue</span></h2>
           <div className="w-24 h-1.5 bg-[#1dd1a1] mx-auto rounded-full" />
        </div>
        {(spotlightVehicles.length > 1 ? spotlightVehicles.slice(1, 5) : [
          { id: 'mock1', title: 'Audi RS6 Avant', description: 'Performance e estética com um V8 biturbo brutal.', price: 1200000, km: 0, media: [{url: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=2074'}] },
          { id: 'mock2', title: 'Mercedes AMG GT', description: 'O puro estado da arte das pistas para as ruas.', price: 1550000, km: 500, media: [{url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=2070'}] },
          { id: 'mock3', title: 'Lamborghini Huracán', description: 'V10 aspirado numa obra-prima do design.', price: 3200000, km: 1200, media: [{url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=2071'}] },
          { id: 'mock4', title: 'Land Rover Defender', description: 'Luxo e capacidade inigualável em qualquer terreno.', price: 850000, km: 200, media: [{url: 'https://images.unsplash.com/photo-1563720223185-11003d5169a6?auto=format&fit=crop&q=80&w=2070'}] }
        ]).map((vehicle: any, idx) => (
          <div key={vehicle.id} className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-start gap-20 group`}>
             <div className="relative shrink-0 w-full md:w-[500px] mt-[70px]">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#1dd1a1]/20 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-[320px] w-full rounded-[45px] overflow-hidden border border-[#1dd1a1] shadow-2xl">
                   <img src={vehicle.media?.[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]" />
                </div>
             </div>
             <div className="flex-1 space-y-6 mt-0 md:mt-[50px]">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#1dd1a1] bg-[#1dd1a1]/5 px-5 py-2 rounded-full border border-[#1dd1a1]/10">Exclusividade Solara</span>
                <h3 className="text-4xl md:text-[50px] font-black font-impact tracking-tighter uppercase leading-[0.9] italic">{vehicle.title}</h3>
                <p className="font-['Architects_Daughter'] text-3xl text-white opacity-90 leading-relaxed italic">"Venha conferir esse maravilhoso carro!"</p>
                <p className="text-[#576574] text-lg leading-relaxed font-medium">
                   {vehicle.description || "Uma síntese perfeita entre luxo e engenharia avançada. Cada detalhe foi projetado para proporcionar uma experiência de condução inigualável e inesquecível."}
                </p>
                <div className="flex items-center gap-8 py-4">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#333] uppercase tracking-widest mb-1">Km Atual</span>
                      <span className="text-xl font-black text-white">{vehicle.km.toLocaleString('pt-BR')} km</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-[#333] uppercase tracking-widest mb-1">Potência</span>
                      <span className="text-xl font-black text-white">Consulte</span>
                   </div>
                </div>
                <div className="pt-4">
                   <Link to={`/veiculo/${vehicle.id}`} className="inline-flex items-center justify-center gap-4 px-8 py-4 bg-[#1dd1a1] text-black rounded-[20px] hover:bg-[#00f3ff] hover:text-[#555] hover:-translate-y-1 transition-all duration-300 shadow-[0_15px_30px_-5px_rgba(29,209,161,0.3)] group/btn font-black uppercase tracking-widest text-xs w-full md:w-auto">
                      TENHO INTERESSE <ArrowRight className="w-5 h-5 text-black group-hover/btn:text-[#555] group-hover/btn:translate-x-2 transition-all" />
                   </Link>
                </div>
             </div>
          </div>
        ))}
      </section>

      {/* Persuasive Call to Action / Guarantees */}
      <section className="max-w-[1140px] mx-auto px-6 mb-40">
         <div className="relative w-full rounded-[45px] overflow-hidden bg-gradient-to-br from-[#0B0E14] to-[#0A0D10] border border-[#1dd1a1]/30 p-10 md:p-16 shadow-[0_30px_60px_-15px_rgba(29,209,161,0.1)] group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1dd1a1]/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-[#1dd1a1]/10 transition-colors duration-1000 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
               <div className="flex-1 space-y-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1dd1a1]/10 text-[#1dd1a1] text-[10px] font-black uppercase tracking-widest border border-[#1dd1a1]/20">
                     <ShieldCheck className="w-4 h-4" /> Vantagens Exclusivas Solara
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black font-impact tracking-tighter uppercase italic leading-[1] text-white">
                     O seu sonho automotivo <br/>
                     <span className="text-[#1dd1a1]">Sem Burocracia</span>
                  </h3>
                  <p className="text-[#8395a7] font-medium leading-relaxed max-w-xl text-lg">
                     Super valorizamos o seu usado na troca. Todas as nossas máquinas são <span className="text-white font-bold">100% periciadas</span>, rigorosamente <span className="text-white font-bold">revisadas</span> e contam com uma garantia estendida premium para a sua tranquilidade absoluta.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 pt-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#1dd1a1]">
                           <Car className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Super Avaliação</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#1dd1a1]">
                           <Shield className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Garantia Total</span>
                     </div>
                  </div>
               </div>
               
               <div className="w-full md:w-auto">
                  <button onClick={() => setIsSimulatorOpen(true)} className="inline-flex items-center justify-center gap-4 px-10 py-6 bg-[#1dd1a1] text-black rounded-[25px] hover:bg-[#00f3ff] hover:text-[#555] hover:-translate-y-2 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(29,209,161,0.4)] group/btn w-full md:w-auto">
                     <div className="flex flex-col items-center text-center">
                        <span className="font-black uppercase tracking-widest text-sm mb-1 text-black group-hover/btn:text-[#555] transition-colors">Simular Financiamento</span>
                        <span className="font-['Architects_Daughter'] text-sm opacity-80 text-black group-hover/btn:text-[#555] transition-colors">Condições imperdíveis hoje</span>
                     </div>
                     <ArrowRight className="w-6 h-6 text-black group-hover/btn:text-[#555] group-hover/btn:translate-x-2 transition-all" />
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/[0.02] border-y border-white/5 py-40 px-6">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
           {[
             { label: "Veículos Entregues", value: "850+", icon: Car },
             { label: "Anos de Mercado", value: "12", icon: Zap },
             { label: "Consultores VIP", value: "45", icon: Star },
             { label: "Certificação Elite", value: "100%", icon: ShieldCheck }
           ].map((stat, i) => (
             <div key={i} className="space-y-4">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1dd1a1]">
                   <stat.icon size={28} />
                </div>
                <h3 className="text-4xl font-black text-white font-impact">{stat.value}</h3>
                <p className="text-[9px] font-black text-[#576574] uppercase tracking-[0.3em]">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Simulator Modal */}
      <FinancingCalculator isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />

      {/* Premium Stores Showcase */}
      <section className="max-w-[1140px] mx-auto px-6 py-32 border-t border-white/5 mt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 font-impact italic">CONCESSIONÁRIAS ELITE</h2>
          <p className="text-[#576574] font-medium font-['Architects_Daughter'] text-xl">As melhores parcerias para garantir sua segurança</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stores.map((store) => (
            <Link 
              key={store.id} 
              to={`/${store.slug}`} 
              className="group p-8 rounded-[32px] bg-[#0A0D10] border border-white/5 hover:border-[#1dd1a1] hover:bg-[#111] transition-all duration-500 text-center shadow-lg hover:-translate-y-2"
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center mb-6 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                {store.logo_url ? <img src={store.logo_url} className="w-full h-full object-contain p-2" /> : <Car className="w-10 h-10 text-[#222]" />}
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-[#1dd1a1] transition-colors uppercase font-impact tracking-widest">{store.name}</h3>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#555]">{store.city || 'Brazil'}</span>
            </Link>
          ))}
        </div>
      </section>


    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: VehicleWithMedia }) {
  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div
      className="group bg-[#0A0A0A] rounded-[50px] border border-[#1dd1a1] hover:border-[#1dd1a1]/80 overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(29,209,161,0.2)]"
    >
      <div className="relative h-[320px] overflow-hidden">
        {vehicle.media && vehicle.media.length > 0 ? (
          <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {vehicle.media.slice(0, 12).map((media, idx) => (
              <img 
                key={idx}
                src={media.url} 
                alt={`${vehicle.title} - Foto ${idx + 1}`} 
                className="w-full h-full object-cover shrink-0 snap-center transition-transform duration-[1.5s]" 
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-[#111] flex items-center justify-center"><Car className="w-20 h-20 text-[#050505]" /></div>
        )}
        
        {/* Overlay Navigation Hint */}
        {vehicle.media && vehicle.media.length > 1 && (
           <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-[#1dd1a1] uppercase border border-white/5 pointer-events-none">
             Deslize ←
           </div>
        )}

        <div className="absolute top-8 left-8 pointer-events-none">
          <span className="px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-[#1dd1a1] rounded-full animate-pulse" />
             {vehicle.brand}
          </span>
        </div>

        <Link to={`/veiculo/${vehicle.id}`} className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
           <div className="bg-[#1dd1a1] p-4 rounded-2xl text-center shadow-lg">
              <span className="text-black font-black text-sm uppercase tracking-widest hover:text-white transition-colors">Ver Oferta Exclusiva</span>
           </div>
        </Link>
      </div>
      
      <div className="p-10 space-y-6">
        <div>
          <h3 className="text-2xl font-black mb-2 truncate group-hover:text-[#1dd1a1] transition-colors uppercase tracking-tight font-impact italic"><Link to={`/veiculo/${vehicle.id}`}>{vehicle.title}</Link></h3>
          <div className="flex items-center gap-4">
             <span className="text-lg font-black text-white tracking-tighter">{formatPrice(vehicle.price)}</span>
             <div className="w-1 h-1 rounded-full bg-[#333]" />
             <span className="text-[10px] font-black text-[#576574] uppercase tracking-widest">{vehicle.year}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-2 border-b border-white/5">
           <div className="flex items-center gap-3">
              <Gauge className="w-4 h-4 text-[#1dd1a1]" />
              <span className="text-xs font-bold">{vehicle.km.toLocaleString('pt-BR')} km</span>
           </div>
           <div className="flex items-center gap-3 justify-end">
              <Shield className="w-4 h-4 text-[#1dd1a1]" />
              <span className="text-xs font-bold uppercase tracking-tighter">Certificado</span>
           </div>
        </div>

        <p className="font-['Architects_Daughter'] text-lg text-[#1dd1a1] italic opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           "Venha conferir esse maravilhoso carro!"
        </p>
      </div>
    </div>
  )
}

export default Home
