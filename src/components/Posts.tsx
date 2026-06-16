'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { POSTS_QUERY_ALL } from '@/sanity/lib/queries'
import { useStudioClient } from '@/sanity/lib/studioAuth'

export type PostListItem = {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  isPrivate?: boolean
}

function formatDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function PrivateTag() {
  return (
    <span className="rounded-[2px] border border-[var(--faint)] px-1 py-px font-serif text-[8px] uppercase tracking-[0.12em] text-[var(--muted)]">
      private
    </span>
  )
}

export default function Posts({ posts }: { posts: PostListItem[] }) {
  // Start from the public, server-rendered list; if a Studio session exists,
  // swap in the full list (including private posts) once it loads.
  const [list, setList] = useState(posts)
  const { client } = useStudioClient()

  useEffect(() => {
    setList(posts)
  }, [posts])

  useEffect(() => {
    if (!client) return
    let active = true
    client
      .fetch(POSTS_QUERY_ALL)
      .then((all: PostListItem[] | null) => {
        if (active && all) setList(all)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [client])

  return (
    <div className="flex flex-col gap-y-1 align-top justify-start">
      <div className="font-serif text-[14px] tracking-[0.08em] font-bold">Posts</div>
      {list.length === 0 ? (
        <div className="font-serif text-[10px] italic tracking-[0.08em] text-[var(--muted)]">
          No posts yet…
        </div>
      ) : (
        list.map((post) => (
          <Link
            key={post._id}
            href={`/${post.slug}`}
            className="group flex items-baseline gap-2 py-0.5"
          >
            <span className="font-serif text-[12px] tracking-[0.08em] text-foreground transition-opacity group-hover:opacity-70">
              {post.title}
            </span>
            {post.isPrivate ? <PrivateTag /> : null}
            <span className="flex-1 border-b border-dotted border-[var(--faint)]" aria-hidden />
            <span className="font-serif text-[11px] tracking-[0.08em] text-[var(--muted)]">
              {formatDate(post.publishedAt)}
            </span>
          </Link>
        ))
      )}
    </div>
  )
}
