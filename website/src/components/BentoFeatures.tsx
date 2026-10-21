import React from 'react'
import { motion } from 'motion/react'
import { Sparkles, Zap, ShieldCheck, RefreshCw, Eye, CheckCircle2 } from 'lucide-react'

export const BentoFeatures: React.FC = () => {
  return (
    <section id="features" className="py-24 relative bg-slate-950/60 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Engineered for Power Users & Gamers</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built Different. Built Faster.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Forget slow browser downloads and shady repackaged installers. RigForge brings high-performance 
            package automation directly to your Windows desktop.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Unattended Silent Installation (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 glass-card p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all" />
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold">
                Unattended Silent Automation
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2">
                Zero Next Buttons. Zero Adware Popups.
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Every package is dispatched with silent unattended automation flags 
                <code className="text-xs font-mono bg-slate-900 px-2 py-0.5 rounded text-blue-300 border border-white/5 mx-1">
                  --silent --accept-package-agreements
                </code>. 
                RigForge bypasses setup wizards, telemetry checkboxes, and adware prompts completely in the background.
              </p>
            </div>

            {/* Code / Command visual banner */}
            <div className="mt-8 p-4 rounded-2xl bg-slate-950/80 border border-white/10 font-mono text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400">Dispatcher Status:</span>
                <span className="text-emerald-300 font-semibold">100% Unattended Silent Mode Active</span>
              </div>
              <span className="text-slate-500 hidden sm:inline">Thread: Async / Non-blocking</span>
            </div>
          </motion.div>

          {/* Card 2: Smart Registry Detection (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-semibold">
                Smart Registry Scanner
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-2">
                Knows What’s Already Installed
              </h3>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Multi-layer inspection engine cross-references Windows Registry uninstall keys and 
                <code className="text-xs font-mono bg-slate-900 px-1.5 py-0.5 rounded text-emerald-300 mx-1">winget list</code> 
                to mark existing apps with their exact version numbers.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Installed
              </span>
              <span className="text-xs text-slate-400 font-mono">Chrome v131.0.6778</span>
            </div>
          </motion.div>

          {/* Card 3: Bulk System Upgrade (Span 1) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                <RefreshCw className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
                Single-Click Sweeper
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-2">
                Bulk Upgrade All System Software
              </h3>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Check and upgrade every outdated tool on your PC to its latest verified release in one go. No need to update 30 apps manually.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 font-mono">
              <span className="text-amber-400">$</span> winget upgrade --all
            </div>
          </motion.div>

          {/* Card 4: Official CDNs Only (Span 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 glass-card p-8 rounded-3xl border relative overflow-hidden flex flex-col justify-between group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-600/20 transition-all" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                Security & Integrity First
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white mt-2">
                100% Official Vendor Binaries & Checksums
              </h3>
              <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                RigForge never re-hosts or repackages installation files. Every package is streamed directly from official 
                CDNs (Google, Microsoft, Valve, Mozilla, GitHub) and validated with cryptographic SHA-256 hashes.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { title: 'Google CDN', status: 'Direct HTTPS' },
                { title: 'Microsoft Store', status: 'Verified API' },
                { title: 'GitHub Releases', status: 'Cryptographic SHA' },
                { title: 'Mozilla Org', status: 'Official Build' },
              ].map((item) => (
                <div key={item.title} className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
                  <div className="text-xs font-semibold text-white">{item.title}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">{item.status}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
