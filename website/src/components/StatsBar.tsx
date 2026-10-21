import React from 'react'
import { motion } from 'motion/react'
import { Layers, ShieldCheck, Zap, Code2 } from 'lucide-react'

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: Layers,
      value: '50+',
      label: 'Curated Software Packages',
      description: 'Browsers, Dev Tools, Gaming, Media & System Utilities',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: ShieldCheck,
      value: '0',
      label: 'Popups, Adware, or Bundles',
      description: 'Silent unattended flags bypass installers and bloatware',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
    {
      icon: Zap,
      value: '< 5 min',
      label: 'Complete PC Setup Time',
      description: 'One-click bulk installation replaces hours of manual work',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20'
    },
    {
      icon: Code2,
      value: '100%',
      label: 'Free & Transparent Engine',
      description: 'Built on Microsoft Windows Package Manager (winget)',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    }
  ]

  return (
    <section className="py-12 border-y border-white/5 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl border flex flex-col justify-between group hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bgColor} border ${stat.borderColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <span className={`text-3xl font-heading font-extrabold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {stat.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
