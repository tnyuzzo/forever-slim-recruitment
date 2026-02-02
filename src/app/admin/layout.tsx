'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Users,
  LayoutDashboard,
  Kanban,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/admin/calendar', label: 'Calendario', icon: Calendar },
  { href: '/admin/settings', label: 'Impostazioni', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-semibold text-gray-900">Admin</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <h1 className="font-bold text-xl text-gray-900">Recruitment</h1>
            </div>
            <nav className="p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                    pathname === item.href
                      ? 'bg-[#FDF2F8] text-[#D946A8]'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-gray-600 hover:bg-gray-100 mt-4"
              >
                <LogOut className="w-5 h-5" />
                Esci
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen fixed">
          <div className="p-6 border-b border-gray-200">
            <h1 className="font-bold text-xl text-gray-900">Recruitment</h1>
            <p className="text-sm text-gray-500">Dashboard Admin</p>
          </div>
          <nav className="flex-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  pathname === item.href
                    ? 'bg-[#FDF2F8] text-[#D946A8]'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="w-5 h-5" />
              Esci
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-64">
          {children}
        </main>
      </div>
    </div>
  )
}
