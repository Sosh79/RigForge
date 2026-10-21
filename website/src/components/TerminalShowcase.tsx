import React, { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Terminal, Copy, Check } from 'lucide-react'

export const TerminalShowcase: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const logs = [
    { type: 'info', text: 'RigForge v1.0.0 initializing winget execution subsystem...' },
    { type: 'success', text: '✔ Microsoft.Winget.Client verified [v1.9.25180]' },
    { type: 'cmd', text: '> winget install --id Valve.Steam --silent --accept-package-agreements' },
    { type: 'stream', text: 'Downloading https://cdn.cloudflare.steamstatic.com/client/installer/SteamSetup.exe' },
    { type: 'success', text: '✔ Valve.Steam installed successfully.' },
    { type: 'cmd', text: '> winget install --id Microsoft.VisualStudioCode --silent' },
    { type: 'stream', text: 'Downloading https://update.code.visualstudio.com/1.95.3/win32-x64-user/stable' },
    { type: 'success', text: '✔ Microsoft.VisualStudioCode installed successfully.' },
    { type: 'cmd', text: '> winget install --id Discord.Discord --silent' },
    { type: 'stream', text: 'Extracting package & registering protocol handler...' },
    { type: 'success', text: '✔ Discord.Discord installed successfully.' },
    { type: 'final', text: 'All 3 packages installed in 42.8 seconds. 0 errors, 0 prompts.' }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < logs.length ? prev + 1 : 1))
    }, 1200)
    return () => clearInterval(timer)
  }, [logs.length])

  const copySample = () => {
    navigator.clipboard.writeText('winget install --id Google.Chrome --silent --accept-package-agreements')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-20 relative bg-slate-950/70 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium mb-4">
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>Real-Time Streaming Output</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Transparent Execution. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                You Are Always in Control.
              </span>
            </h2>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Inside RigForge, a collapsible live terminal drawer streams the raw output directly from the 
              operating system. You can inspect download URLs, hash validations, and error codes in real time.
            </p>

            <div className="mt-6 space-y-3">
              {[
                'Full transparency: See exactly what commands are executed',
                'Zero hidden telemetry or proprietary obfuscation',
                'Direct links to official Microsoft Winget manifest IDs',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                onClick={copySample}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
                <span>Copy sample winget command</span>
              </button>
            </div>
          </div>

          {/* Right Terminal Window */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-[#070B14] shadow-2xl overflow-hidden font-mono text-left">
              {/* Header */}
              <div className="bg-slate-900/90 px-4 py-3 border-b border-white/10 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs text-slate-400">RigForge Console Drawer — PowerShell 7</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">UTF-8 / x64</span>
              </div>

              {/* Terminal Logs Content */}
              <div className="p-5 space-y-2 text-xs min-h-[340px] max-h-[380px] overflow-y-auto">
                {logs.slice(0, activeStep).map((log, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {log.type === 'info' && (
                      <p className="text-slate-400">{log.text}</p>
                    )}
                    {log.type === 'cmd' && (
                      <p className="text-amber-300 font-semibold">{log.text}</p>
                    )}
                    {log.type === 'stream' && (
                      <p className="text-slate-500 pl-4 border-l border-slate-800">{log.text}</p>
                    )}
                    {log.type === 'success' && (
                      <p className="text-emerald-400 font-medium pl-4 border-l border-emerald-500/40">{log.text}</p>
                    )}
                    {log.type === 'final' && (
                      <p className="text-cyan-300 font-bold mt-3 p-2 rounded bg-cyan-950/40 border border-cyan-500/30">
                        {log.text}
                      </p>
                    )}
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="text-blue-400 font-bold">$</span>
                  <span className="w-2 h-4 bg-blue-400 animate-pulse inline-block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
