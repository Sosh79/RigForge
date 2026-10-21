import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What is RigForge and how is it different from older tools like Ninite?',
      a: 'RigForge is a modern Windows 10/11 application engineered for bulk software deployment. Unlike older closed tools, RigForge is powered directly by Microsoft’s official Windows Package Manager (winget) engine. It provides a sleek Fluent Design interface, official high-res application logos, smart registry-level detection of already installed software with exact version numbers, and an interactive real-time console drawer.'
    },
    {
      q: 'Where do the software downloads come from?',
      a: 'Every single software package is downloaded directly from its official creator (e.g. dl.google.com for Chrome, cdn.cloudflare.steamstatic.com for Steam, update.code.visualstudio.com for VS Code). RigForge never hosts or alters installation files; everything is handled securely by Microsoft’s winget manifest system.'
    },
    {
      q: 'Does RigForge install any toolbars, bloatware, or promotional adware?',
      a: 'Absolutely zero. RigForge uses silent unattended installation parameters (--silent --accept-package-agreements) which automatically skip the optional sponsored offers, search bar changes, or promotional toolbars that some traditional setup wizards display.'
    },
    {
      q: 'Do I need Administrator permissions to run RigForge?',
      a: 'Yes, because Windows requires standard administrator rights (UAC) to install applications system-wide into Program Files and register file extensions properly.'
    },
    {
      q: 'How does the Bulk System Upgrade feature work?',
      a: 'When you click "Update All Installed", RigForge instructs the winget engine to query all installed programs on your computer, compare their installed versions with the latest official releases, and upgrade all outdated applications sequentially.'
    },
    {
      q: 'Can I add new applications to the catalog?',
      a: 'Yes! RigForge is completely extensible. All applications are defined in a clean apps.json catalog. You can easily add any application supported by Microsoft Winget by simply providing its package ID.'
    }
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-24 relative bg-slate-950/40 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-medium mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Everything you need to know about RigForge, security, and silent package automation.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={faq.q}
                className="glass-card rounded-2xl border transition-all overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-base sm:text-lg font-bold text-white">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-800 text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-400 bg-blue-500/10' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
