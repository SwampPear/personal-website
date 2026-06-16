'use client'
import Posts, { type PostListItem } from './Posts'
import PhotoGrid from './PhotoGrid'
import Experience from './Experience'

function About() {
  return (
    <div className="font-serif text-[13px] tracking-[0.08em]">
      Howdy. By day I'm working as a software developer, and by night I'm also working as a software 
      developer. I have an immense passion for technology and breaking things down to the nitty
      gritty to understand how they work. Outside (and inside) of my engineering pursuits I am an avid enjoyer of
      music, firmware, tacos, compilers, graphics, AI, reading, semiconductor manufacturing, 
      armchair paleontology, armchair ontology, cars, and travel.
    </div>
  )
}

function MadeWithLove({ className = '' }: { className?: string }) {
  return (
    <p className={`font-serif text-[11px] tracking-[0.08em] text-[var(--muted)] ${className}`}>
      This site made with ❤️.
    </p>
  )
}

export default function Home({ posts }: { posts: PostListItem[] }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-8 lg:flex-row lg:justify-between">
      <div className="scroll-fade max-w-2xl py-10 lg:flex-1 lg:overflow-y-auto">
        <About />
        <PhotoGrid />
        <Experience />
        {/* On mobile this moves under Posts (see below). */}
        <MadeWithLove className="mt-24 hidden lg:block" />
      </div>
      <div className="w-full lg:mt-10 lg:w-auto lg:shrink-0">
        <Posts posts={posts} />
        <MadeWithLove className="mt-10 lg:hidden" />
      </div>
    </div>
  )
}