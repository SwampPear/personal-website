import Nav from '@/components/Nav'

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="relative z-10 flex min-h-screen flex-col p-4 lg:h-screen">
      <Nav />
      {children}
    </main>
  )
}
