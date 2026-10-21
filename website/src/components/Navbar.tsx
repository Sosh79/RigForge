import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Download, Menu, X, Sparkles, Layers, Terminal as TerminalIcon, HelpCircle } from 'lucide-react'

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 transition-all duration-300">
      <div 
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          scrolled 
            ? 'glass-panel shadow-2xl shadow-blue-950/30 py-3 px-5 sm:px-6 border border-white/10' 
            : 'bg-slate-900/40 backdrop-blur-md py-4 px-5 sm:px-6 border border-white/5'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="RigForge Logo" 
                className="w-9 h-9 rounded-xl object-contain shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200" 
              />
              <div className="absolute -inset-0.5 bg-blue-500/30 rounded-xl blur-sm -z-10 group-hover:bg-blue-500/50 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-white flex items-center gap-2">
                RigForge
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                  v1.0.0
                </span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <a 
              href="#features" 
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-medium flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              Features
            </a>
            <a 
              href="#catalog" 
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-medium flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              App Catalog
            </a>
            <a 
              href="#how-it-works" 
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-medium flex items-center gap-1.5"
            >
              <TerminalIcon className="w-4 h-4 text-amber-400" />
              How It Works
            </a>
            <a 
              href="#faq" 
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors font-medium flex items-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              FAQ
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub Repository"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

            <motion.a
              href="#download"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 border border-blue-400/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </motion.a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden pt-4 pb-2 border-t border-white/10 mt-3 flex flex-col gap-2"
            >
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                Features
              </a>
              <a 
                href="#catalog" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-cyan-400" />
                App Catalog (50+ Apps)
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                <TerminalIcon className="w-4 h-4 text-amber-400" />
                How It Works
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                FAQ
              </a>
              <div className="pt-2 border-t border-white/5">
                <a
                  href="#download"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download RigForge v1.0
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
