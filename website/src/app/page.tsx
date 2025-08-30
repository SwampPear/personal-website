import AboutSection from '@/components/AboutSection'
import Background from '@/components/Background'
import Nav from '@/components/Nav'
import Robot from '@/components/Robot'
import XPSection from '@/components/XPSection'

export default function Home() {
  return (
    <>
      <Nav />
      <Background />
      <Robot />
      <AboutSection />
      <XPSection />
    </>
  )
}
