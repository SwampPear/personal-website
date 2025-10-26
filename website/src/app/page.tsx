import AboutSection from '@/components/AboutSection'
import Background from '@/components/Background'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import Robot from '@/components/Robot'
import XPSection from '@/components/XPSection'

const Page = () => {
  return (
    <>
      <Nav />
      <Background color="vec3(0.341, 0.149, 0.043)" />
      <Robot />
      <AboutSection />
      <XPSection />
      <Footer />
    </>
  )
}

export default Page