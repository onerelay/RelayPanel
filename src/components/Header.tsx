// src/components/Header.tsx
import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Home, CircleUserRound, LogOut, Loader2 } from 'lucide-react'
import { BRAND_PREFIX, BRAND_SUFFIX, LOGO_PATH } from '../config'
import Portal from './Portal'

export default function Header() {
  const navigate = useNavigate()
  const [user, setUser] = useState<{ name: string; image?: string } | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLogoutLoading, setIsLogoutLoading] = useState(false)

  const handleLogin = () => {
    setIsLoginLoading(true)
    setShowLoginModal(true)
    
    setTimeout(() => {
      setUser({
        name: 'John Doe',
        image: '',
      })
      setIsLoginLoading(false)
      setShowLoginModal(false)
    }, 2000)
  }

  const handleLogout = () => {
    setIsLogoutLoading(true)
    
    setTimeout(() => {
      setUser(null)
      setIsLogoutLoading(false)
      navigate({ to: '/' }) // Redirect ke home setelah logout
    }, 1500)
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home, exact: true },
  ]

  const baseButtonClass = "px-3 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-1.5"
  const navButtonClass = `${baseButtonClass} bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/50`
  const activeNavClass = `${baseButtonClass} bg-cyan-700 text-white shadow-lg shadow-cyan-700/50`

  return (
    <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Bagian kiri: logo dan navigasi */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src={LOGO_PATH} alt="Logo" className="w-8 h-8" />
              <span className="font-bold text-white text-2xl">
                <span className="text-gray-300">{BRAND_PREFIX}</span>{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {BRAND_SUFFIX}
                </span>
              </span>
            </Link>
            
            <nav className="flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={item.exact ? { exact: true } : undefined}
                  activeProps={{ className: activeNavClass }}
                  inactiveProps={{ className: navButtonClass }}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
              {user && (
                <Link
                  to="/profile"
                  activeOptions={{ exact: false }}
                  activeProps={{ className: activeNavClass }}
                  inactiveProps={{ className: navButtonClass }}
                >
                  <CircleUserRound className="w-4 h-4" />
                  <span>My profile</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Bagian kanan: user menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                      <CircleUserRound className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                  <span className="text-gray-300 text-sm hidden sm:inline">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={isLogoutLoading}
                  className={`${baseButtonClass} ${
                    isLogoutLoading 
                      ? 'bg-cyan-400 cursor-not-allowed' 
                      : 'bg-cyan-500 hover:bg-cyan-600'
                  } text-white shadow-lg shadow-cyan-500/50`}
                >
                  {isLogoutLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isLogoutLoading ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoginLoading}
                className={`${baseButtonClass} ${
                  isLoginLoading 
                    ? 'bg-[#5865F2]/70 cursor-not-allowed' 
                    : 'bg-[#5865F2] hover:bg-[#4752C4]'
                } text-white shadow-lg shadow-[#5865F2]/50 flex items-center justify-center`}
              >
                {isLoginLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : null}
                <span className="hidden sm:inline">
                  {isLoginLoading ? 'Connecting...' : 'Login with Discord'}
                </span>
                <span className="sm:hidden">
                  {isLoginLoading ? '...' : 'Login'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal dengan Portal */}
      {showLoginModal && (
        <Portal>
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-lg max-w-md w-full p-8 shadow-xl text-center">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                Logging in with Discord
              </h3>
              <p className="text-gray-400">
                Please wait while we authenticate your account...
              </p>
            </div>
          </div>
        </Portal>
      )}
    </header>
  )
}