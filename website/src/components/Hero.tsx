import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Download, Sparkles, Terminal, Check, Copy, CheckCircle2, Shield, ArrowRight, Play, RefreshCw } from 'lucide-react'

export const Hero: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'terminal'>('preview')
  const [selectedMockApps, setSelectedMockApps] = useState<string[]>(['chrome', 'vscode', 'discord', 'steam', 'git'])
  const [isInstalling, setIsInstalling] = useState(false)
  const [progress, setProgress] = useState(65)

  const copyCommand = () => {
    navigator.clipboard.writeText('LaunchRigForge.bat')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toggleMockApp = (id: string) => {
    setSelectedMockApps(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const simulateInstall = () => {
    setIsInstalling(true)
    setProgress(10)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setIsInstalling(false)
          return 100
        }
        return p + 15
      })
    }, 400)
  }

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background radial gradient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-medium mb-6 shadow-inner shadow-blue-500/10"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Windows 10 & 11 • Powered by Official Microsoft Winget</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] sm:leading-[1.1]"
          >
            Forge Your Dream PC in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
              Minutes, Not Hours.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto"
          >
            The modern unattended bulk installer & system updater for Windows. Choose from 
            <strong className="text-white font-semibold"> 50+ curated official apps</strong>, 
            install them silently with zero popups, and upgrade all outdated system software with a single click.
          </motion.p>

          {/* Call to Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#download"
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(37,99,235,0.45)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base sm:text-lg shadow-xl shadow-blue-600/25 border border-blue-400/30 flex items-center justify-center gap-3 transition-all cursor-pointer group"
            >
              <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              <span>Download RigForge v1.0</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/20 text-blue-100 font-mono">
                Win 64-bit
              </span>
            </motion.a>

            <motion.a
              href="#catalog"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-card hover:bg-slate-800/60 text-slate-200 hover:text-white font-medium text-base border border-white/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Explore 50+ Apps</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </motion.a>
          </motion.div>

          {/* Quick Launcher Command Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 flex items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm font-mono text-slate-400">
              <span className="text-blue-400 font-bold">$</span>
              <span>Launch: LaunchRigForge.bat</span>
              <button
                onClick={copyCommand}
                className="ml-2 p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Copy command"
                aria-label="Copy launcher command"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </motion.div>

          {/* Trust Guarantees */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Unattended / No Popups</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>Official Vendor CDNs Only</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Zero Bundles & No Adware</span>
            </div>
          </motion.div>
        </div>

        {/* Interactive App Window Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="mt-14 relative max-w-5xl mx-auto"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-indigo-600/30 rounded-3xl blur-2xl -z-10 opacity-70" />

          {/* Window Frame */}
          <div className="rounded-2xl border border-white/15 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden text-left">
            {/* Windows 11 Fluent Titlebar */}
            <div className="bg-slate-900/90 px-4 py-3 border-b border-white/10 flex items-center justify-between select-none">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="RigForge Icon" className="w-5 h-5 rounded" />
                <span className="text-xs font-semibold text-slate-200">
                  RigForge — Bulk Installer & System Updater (Interactive Preview)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/40 inline-block" />
              </div>
            </div>

            {/* Mockup Toolbar */}
            <div className="bg-slate-900/50 p-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'preview' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  App Grid View
                </button>
                <button 
                  onClick={() => setActiveTab('terminal')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === 'terminal' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Live Winget Console
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">
                  <strong className="text-white">{selectedMockApps.length}</strong> apps selected
                </span>
                <button
                  onClick={simulateInstall}
                  disabled={isInstalling}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/30 disabled:opacity-60 cursor-pointer"
                >
                  {isInstalling ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Installing ({progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate 1-Click Install</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mockup Content Area */}
            {activeTab === 'preview' ? (
              <div className="p-5 sm:p-6 bg-slate-950/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {[
                    { id: 'chrome', name: 'Google Chrome', cat: 'Browsers', icon: '/icons/Google.Chrome.png', desc: 'Fast, secure browser' },
                    { id: 'vscode', name: 'VS Code', cat: 'Development', icon: '/icons/Microsoft.VisualStudioCode.png', desc: 'Lightweight code editor' },
                    { id: 'discord', name: 'Discord', cat: 'Communication', icon: '/icons/Discord.Discord.png', desc: 'Voice, video & text chat' },
                    { id: 'steam', name: 'Steam', cat: 'Gaming', icon: '/icons/Valve.Steam.png', desc: 'PC gaming platform' },
                    { id: 'git', name: 'Git for Windows', cat: 'Development', icon: '/icons/Git.Git.png', desc: 'Revision control system' },
                    { id: 'vlc', name: 'VLC Media Player', cat: 'Media', icon: '/icons/VideoLAN.VLC.png', desc: 'Plays all media codecs' },
                    { id: '7zip', name: '7-Zip', cat: 'Utilities', icon: '/icons/7zip.7zip.png', desc: 'High compression archiver' },
                    { id: 'spotify', name: 'Spotify', cat: 'Media', icon: '/icons/Spotify.Spotify.png', desc: 'Music & podcast streaming' },
                  ].map((app) => {
                    const isSelected = selectedMockApps.includes(app.id)
                    return (
                      <div
                        key={app.id}
                        onClick={() => toggleMockApp(app.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                          isSelected 
                            ? 'bg-blue-600/15 border-blue-500/50 shadow-sm shadow-blue-500/10' 
                            : 'bg-slate-900/40 border-white/5 hover:border-white/10 hover:bg-slate-900/70'
                        }`}
                      >
                        <img src={app.icon} alt={app.name} className="w-9 h-9 rounded-lg object-contain p-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold text-white truncate">{app.name}</h4>
                            <div className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] transition-colors ${
                              isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-600 bg-slate-800'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{app.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Simulated Progress bar if installing */}
                {isInstalling && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-5 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                      <span className="text-blue-300 flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Silent Winget installer active...
                      </span>
                      <span className="font-mono text-cyan-300">{progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full" 
                        style={{ width: `${progress}%` }} 
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              /* Live Terminal Drawer */
              <div className="p-4 sm:p-5 bg-[#070B14] font-mono text-xs text-slate-300 space-y-2 max-h-72 overflow-y-auto">
                <p className="text-slate-500">// Microsoft Windows [Version 10.0.26100.2161]</p>
                <p className="text-blue-400">[RigForge Engine] Starting batch installation sequence...</p>
                <p className="text-emerald-400">✔ Verified winget.exe (v1.9.25180)</p>
                <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800 space-y-1">
                  <p className="text-amber-300">&gt; winget install --id Google.Chrome --silent --accept-package-agreements</p>
                  <p className="text-slate-400">Found Google Chrome [Google.Chrome] Version 131.0.6778.86</p>
                  <p className="text-slate-400">Starting package install... Done!</p>
                  <p className="text-emerald-400">Successfully installed Google Chrome</p>
                </div>
                <div className="p-2.5 rounded bg-slate-900/70 border border-slate-800 space-y-1">
                  <p className="text-amber-300">&gt; winget install --id Microsoft.VisualStudioCode --silent</p>
                  <p className="text-slate-400">Found Visual Studio Code [Microsoft.VisualStudioCode] Version 1.95.3</p>
                  <p className="text-emerald-400">Successfully installed Visual Studio Code</p>
                </div>
                <p className="text-cyan-400">Batch status: 2 completed, 0 failed. System ready.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
