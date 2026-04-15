import { useAuth } from '../../hooks/useAuth'

function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-[#141414] border-b border-[#262626] px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          Portal do Parceiro — <span className="text-[#A3A3A3] font-normal text-base">Visão Geral</span>
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-[#A3A3A3] font-medium bg-[#0A0A0A] px-3 py-1.5 rounded-[8px] border border-[#262626]">
            {user?.email}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
