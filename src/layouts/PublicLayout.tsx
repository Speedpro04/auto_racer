import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
