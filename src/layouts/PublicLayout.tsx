import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-[#1dd1a1] selection:text-black">
      <Header />
      <main className="min-h-screen max-w-[1140px] mx-auto border-x border-white/5 bg-[#0B0E14] shadow-[0_0_60px_-15px_rgba(29,209,161,0.2)] relative z-10 box-border">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
