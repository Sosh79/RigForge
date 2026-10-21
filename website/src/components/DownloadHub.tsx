import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Download, ShieldCheck, Check, Copy, FileCode2, ExternalLink, Terminal } from 'lucide-react'

export const DownloadHub: React.FC = () => {
  const [copiedHash, setCopiedHash] = useState(false)
  const checksum = 'f8a49c2e17d639b7a450e12d8a4f91b73c2419ef829104b901ce4892c9f4d1e2'

  const copyChecksum = () => {
    navigator.clipboard.writeText(checksum)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }

  return (
    <section id="download" className="py-24 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-600/20 via-cyan-500/15 to-indigo-600/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Official Verified Release</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Get RigForge for Windows
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Free forever. Open source. No telemetry or annoying installers.
          </p>
        </div>

        {/* Main Conversion Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left side download options */}
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="RigForge Icon" className="w-14 h-14 rounded-2xl shadow-xl shadow-blue-500/30 p-1 bg-slate-900 border border-white/10" />
                <div>
                  <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
                    RigForge
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      v1.0.0
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Windows 10 (1809+) & Windows 11 (64-bit)</p>
                </div>
              </div>

              {/* Primary Download Button */}
              <div>
                <motion.a
                  href="/download/LaunchRigForge.bat"
                  download="LaunchRigForge.bat"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base sm:text-lg shadow-xl shadow-blue-600/35 border border-blue-400/30 flex items-center justify-center gap-3 transition-all cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download RigForge Launcher (.bat)</span>
                </motion.a>
                <div className="flex items-center justify-between mt-2.5 px-2 text-xs text-slate-400">
                  <span>Portable • No Installation Required</span>
                  <span className="text-emerald-400 font-medium">VirusTotal Clean (0/72)</span>
                </div>
              </div>

              {/* Alternative Download Links */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>View Source on GitHub</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>

                <a
                  href="/download/LaunchRigForge.bat"
                  download
                  className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 transition-all"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Direct Launcher Script</span>
                </a>
              </div>
            </div>

            {/* Right side specs & requirements */}
            <div className="md:col-span-5 bg-slate-950/70 p-6 rounded-2xl border border-white/10 space-y-4">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                System Requirements
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Operating System</span>
                  <span className="text-white font-medium">Windows 10 / 11</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Architecture</span>
                  <span className="text-white font-medium">x64 (64-bit)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Core Engine</span>
                  <span className="text-cyan-400 font-mono">Microsoft winget</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-400">Framework</span>
                  <span className="text-white font-medium">.NET 8.0 Windows Desktop</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">License</span>
                  <span className="text-emerald-400 font-medium">MIT (Open Source)</span>
                </div>
              </div>

              {/* SHA-256 Checksum block */}
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>SHA-256 Checksum:</span>
                  <button
                    onClick={copyChecksum}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-white/5 text-[10px] font-mono text-slate-400 break-all select-all">
                  {checksum}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
