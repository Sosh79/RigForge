import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { StatsBar } from './components/StatsBar'
import { BentoFeatures } from './components/BentoFeatures'
import { AppCatalog } from './components/AppCatalog'
import { HowItWorks } from './components/HowItWorks'
import { TerminalShowcase } from './components/TerminalShowcase'
import { DownloadHub } from './components/DownloadHub'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'

export function App() {
  return (
    <div className="relative min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* 1. Hero with interactive app window mockup & download CTA */}
        <Hero />

        {/* 2. Key Stats and Trust Metrics */}
        <StatsBar />

        {/* 3. Interactive 50+ Apps Catalog & 1-Click Preset Builder */}
        <AppCatalog />

        {/* 4. Bento Grid: Core Technical Architecture & Features */}
        <BentoFeatures />

        {/* 5. 3-Step Workflow: How RigForge Works */}
        <HowItWorks />

        {/* 6. Real-Time Terminal & Execution Transparency */}
        <TerminalShowcase />

        {/* 7. Direct Download Hub & System Requirements */}
        <DownloadHub />

        {/* 8. Frequently Asked Questions */}
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
