import AboutSection from '@/components/AboutSection'
import AsciiBackground from '@/components/AsciiBackground'
import Footer from '@/components/Footer'
import XPSection from '@/components/XPSection'

export default function Page() {
  return (
    <>
      {/* ASCII canvas — fixed full-screen, handles nav + hero text */}
      <AsciiBackground />

      {/* First viewport: hero lives on the canvas above; this spacer holds the scroll room */}
      <div className="h-screen" />

      {/* Content sections — solid background so ASCII stays legible beneath the hero */}
      <AboutSection />
      <XPSection />
      <Footer />
    </>
  )
}
