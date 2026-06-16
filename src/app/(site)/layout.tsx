import Nav from '@/components/Nav'

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative z-10 flex h-screen flex-col p-4">
      <Nav />
      {children}
    </main>
  )
}
