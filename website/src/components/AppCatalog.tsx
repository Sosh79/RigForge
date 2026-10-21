import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Search, Check, Sparkles, Gamepad2, Code, Laptop, Palette, CheckCircle2, X, Download } from 'lucide-react'
import appsData from '../data/apps.json'

export const AppCatalog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([])

  const categories = useMemo(() => {
    const cats = ['All', ...Array.from(new Set(appsData.map(a => a.Category)))]
    return cats
  }, [])

  const filteredApps = useMemo(() => {
    return appsData.filter(app => {
      const matchesSearch = 
        app.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.Id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'All' || app.Category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const toggleApp = (id: string) => {
    setSelectedAppIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const selectAllFiltered = () => {
    const ids = filteredApps.map(a => a.Id)
    setSelectedAppIds(prev => Array.from(new Set([...prev, ...ids])))
  }

  const clearSelection = () => {
    setSelectedAppIds([])
  }

  const applyPreset = (presetName: string) => {
    let targetIds: string[] = []
    if (presetName === 'gaming') {
      targetIds = [
        'Valve.Steam', 
        'Discord.Discord', 
        'EpicGames.EpicGamesLauncher', 
        'OBSProject.OBSStudio', 
        'Microsoft.DirectX', 
        'Opera.OperaGX', 
        '7zip.7zip'
      ]
    } else if (presetName === 'dev') {
      targetIds = [
        'Microsoft.VisualStudioCode', 
        'Git.Git', 
        'GitHub.GitHubDesktop', 
        'Docker.DockerDesktop', 
        'OpenJS.NodeJS.LTS', 
        'Python.Python.3.12', 
        'Microsoft.WindowsTerminal', 
        'Postman.Postman', 
        'dbeaver.dbeaver'
      ]
    } else if (presetName === 'essentials') {
      targetIds = [
        'Google.Chrome', 
        'Mozilla.Firefox', 
        'VideoLAN.VLC', 
        '7zip.7zip', 
        'Spotify.Spotify', 
        'WhatsApp.WhatsApp', 
        'Telegram.TelegramDesktop',
        'Notepad++.Notepad++'
      ]
    } else if (presetName === 'creator') {
      targetIds = [
        'BlenderFoundation.Blender', 
        'GIMP.GIMP', 
        'Audacity.Audacity', 
        'OBSProject.OBSStudio', 
        'HandBrake.HandBrake', 
        'ShareX.ShareX'
      ]
    }
    setSelectedAppIds(targetIds)
  }

  return (
    <section id="catalog" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Software Catalog</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            50+ Curated Official Packages
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Every application is fetched directly from its original vendor repository through Microsoft Winget. 
            Test selections below and see how fast RigForge builds your PC.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="mb-8 p-4 rounded-2xl glass-panel flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>1-Click Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => applyPreset('essentials')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-white/5 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Laptop className="w-3.5 h-3.5 text-blue-400" />
              Daily Essentials
            </button>
            <button
              onClick={() => applyPreset('gaming')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-white/5 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-rose-400" />
              Gamer Rig
            </button>
            <button
              onClick={() => applyPreset('dev')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-white/5 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              Developer Stack
            </button>
            <button
              onClick={() => applyPreset('creator')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium text-slate-200 border border-white/5 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              Creator & Media
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={selectAllFiltered}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium px-2 py-1 rounded hover:bg-blue-500/10 transition-colors"
            >
              Select All Shown
            </button>
            {selectedAppIds.length > 0 && (
              <button
                onClick={clearSelection}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded hover:bg-rose-500/10 transition-colors"
              >
                Clear ({selectedAppIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50+ apps (Chrome, Discord, Steam, Git...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Apps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredApps.map((app) => {
              const isSelected = selectedAppIds.includes(app.Id)
              const iconPath = `/icons/${app.Id}.png`

              return (
                <motion.div
                  key={app.Id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => toggleApp(app.Id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group relative overflow-hidden ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/60 shadow-lg shadow-blue-500/10'
                      : 'glass-card hover:border-slate-600 hover:bg-slate-900/70'
                  }`}
                >
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative shrink-0">
                      <img
                        src={iconPath}
                        alt={`${app.Name} logo`}
                        className="w-12 h-12 rounded-xl object-contain p-1 bg-slate-900/90 border border-white/10 group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          // Fallback to placeholder if icon missing
                          (e.target as HTMLImageElement).src = '/logo.png'
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-heading text-sm font-bold text-white truncate">
                          {app.Name}
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'bg-blue-600 border-blue-400 text-white shadow-sm shadow-blue-500/40'
                              : 'border-slate-700 bg-slate-800/80 group-hover:border-slate-500'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-white/5">
                        {app.Category}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {app.Description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="truncate max-w-[170px]">{app.Id}</span>
                    <span className="text-blue-400/80 group-hover:text-blue-300">winget</span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Zero results placeholder */}
        {filteredApps.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-white/5">
            <p className="text-slate-400 text-sm">No applications match your search query "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-3 text-xs text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Floating Bulk Action Drawer if any app is selected */}
        <AnimatePresence>
          {selectedAppIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl px-5 py-4 rounded-2xl glass-panel border border-blue-500/40 shadow-2xl shadow-blue-950/70 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {selectedAppIds.length} {selectedAppIds.length === 1 ? 'App' : 'Apps'} Selected for Bulk Setup
                  </h4>
                  <p className="text-xs text-slate-300">
                    Ready to forge into your PC with unattended silent install.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>
                <a
                  href="#download"
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download RigForge to Install</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
