'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Users, KanbanSquare, Calendar, Settings, LogOut, Menu, X, UsersRound, ShieldCheck, Shield, BarChart3 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState<'superadmin' | 'recruiter' | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
        // Fetch user role
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single()
        if (data) setUserRole(data.role as 'superadmin' | 'recruiter')
      }
    }
    fetchUserInfo()
  }, [])

  const navigation = [
    { name: 'Candidati', href: '/admin', icon: Users, roles: ['superadmin', 'recruiter'] },
    { name: 'Pipeline', href: '/admin/pipeline', icon: KanbanSquare, roles: ['superadmin', 'recruiter'] },
    { name: 'Calendario', href: '/admin/calendar', icon: Calendar, roles: ['superadmin', 'recruiter'] },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3, roles: ['superadmin'] },
    { name: 'Impostazioni', href: '/admin/settings', icon: Settings, roles: ['superadmin'] },
    { name: 'Team', href: '/admin/team', icon: UsersRound, roles: ['superadmin'] },
  ]

  const visibleNavigation = navigation.filter(item =>
    !userRole || item.roles.includes(userRole)
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const NavLinks = () => (
    <>
      {visibleNavigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${isActive
              ? 'bg-primary-light text-primary-hover'
              : 'text-text-muted hover:bg-gray-50 hover:text-text-main'
              }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        )
      })}
    </>
  )

  return (
    <div className="min-h-screen bg-bg-alt flex flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-20">
        <span className="font-black text-xl text-primary-hover tracking-tight">Forever Slim</span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-text-muted hover:bg-gray-50 rounded-lg"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Menu) */}
      <div className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex md:flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex p-6 border-b border-gray-100">
          <span className="font-black text-2xl text-primary-hover tracking-tight">Forever Slim</span>
        </div>

        <div className="flex-1 p-4 space-y-2 mt-16 md:mt-0 overflow-y-auto">
          <NavLinks />
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-100 space-y-3">
          {userEmail && (
            <div className="flex items-center gap-3 px-4 py-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${userRole === 'superadmin'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-blue-100 text-blue-600'
                }`}>
                {userRole === 'superadmin'
                  ? <ShieldCheck className="w-4 h-4" />
                  : <Shield className="w-4 h-4" />
                }
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-text-main truncate">{userEmail}</div>
                <div className={`text-xs font-medium ${userRole === 'superadmin' ? 'text-amber-600' : 'text-blue-600'
                  }`}>
                  {userRole === 'superadmin' ? 'Super Admin' : 'Recruiter'}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-error hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Esci
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto overflow-x-hidden">
        {children}
      </main>

    </div>
  )
}
