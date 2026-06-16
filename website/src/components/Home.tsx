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

export default function Home({ posts }: { posts: PostListItem[] }) {
  return (
    <div className="flex min-h-0 flex-1 justify-between gap-8">
      <div
        className="max-w-2xl flex-1 overflow-y-auto py-10"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0, black 2.5rem, black calc(100% - 2.5rem), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0, black 2.5rem, black calc(100% - 2.5rem), transparent 100%)',
        }}
      >
        <About />
        <PhotoGrid />
        <Experience />
        <p className="mt-24 font-serif text-[11px] tracking-[0.08em] text-[var(--muted)]">
          This site made with ❤️.
        </p>
      </div>
      <div className="mt-10 w-md shrink-0">
        <Posts posts={posts} />
      </div>
    </div>
  )
}