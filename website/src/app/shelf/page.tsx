import Background from '@/components/Background'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import ShelfSection from '@/components/ShelfSection'

const Page = () => {
  return (
    <>
      <Nav />
      <Background color="vec3(0.043, 0.149, 0.341)" />
      <ShelfSection />
      <Footer />
    </>
  )
}

export default Page
