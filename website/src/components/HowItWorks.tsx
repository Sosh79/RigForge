import React from 'react'
import { motion } from 'motion/react'
import { Download, CheckSquare, Play, Sparkles, ArrowRight } from 'lucide-react'

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Download & Launch',
      description: 'Grab the single executable or launch script. No complicated installation needed—RigForge is lightweight, portable, and ready out of the box.',
      icon: Download,
      accent: 'from-blue-600 to-cyan-500',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      num: '02',
      title: 'Pick Apps or Choose a Preset',
      description: 'Select your preferred software via category checklists or pick a curated 1-click preset like Gamer Rig, Developer Stack, or Daily Essentials.',
      icon: CheckSquare,
      accent: 'from-cyan-500 to-indigo-500',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    {
      num: '03',
      title: 'Click Install & Relax',
      description: 'Sit back while RigForge talks to Microsoft Winget, downloading official packages and silently installing every program unattended in the background.',
      icon: Play,
      accent: 'from-indigo-500 to-purple-500',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    }
  ]

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Effortless 3-Step Workflow</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How RigForge Works
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            A frictionless deployment experience crafted to eliminate the pain of Windows setup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-card p-8 rounded-3xl border relative group hover:border-blue-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                      {step.num}
                    </span>
                    <div className={`p-3 rounded-2xl ${step.badgeColor} border`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-blue-400 group-hover:text-cyan-300 transition-colors">
                  <span>Step {step.num} Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
