import { Download, Heart, Shield, Terminal } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#060911] text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="RigForge Logo" className="w-8 h-8 rounded-xl object-contain shadow-md shadow-blue-500/20" />
              <span className="font-heading text-xl font-bold tracking-tight text-white">
                RigForge
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold border border-blue-500/30">
                v1.0.0 Stable
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              The modern Windows unattended bulk installer & system updater. Built with Microsoft Winget, 
              designed to save hours when setting up new PCs, rigs, or clean Windows installations.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> 100% Free & Open Source
              </span>
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> Microsoft Winget Client
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Features & Architecture</a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors">App Catalog (50+ Apps)</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#download" className="hover:text-white transition-colors">Direct Download Hub</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div>
            <h4 className="font-heading text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  Release Binaries (.bat / .exe)
                </a>
              </li>
              <li>
                <a href="https://learn.microsoft.com/en-us/windows/package-manager/winget/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Microsoft Winget Docs
                </a>
              </li>
              <li>
                <span className="text-slate-500">MIT Open Source License</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RigForge. Open source community software.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for PC builders & power users.
          </p>
        </div>
      </div>
    </footer>
  )
}
