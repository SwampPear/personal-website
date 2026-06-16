'use client'

import { notFound } from 'next/navigation'
import { useEffect, useState } from 'react'

import { buildSections, type RawSection } from '@/sanity/lib/posts'
import { POST_QUERY_ANY } from '@/sanity/lib/queries'
import { useStudioClient } from '@/sanity/lib/studioAuth'

import PostReader from './PostReader'

type LoadedPost = {
  title?: string
  publishedAt?: string
  sections?: RawSection[]
} | null

// Rendered by the post page when a slug has no *public* match. If a Studio
// session exists and the slug resolves to a private post, render it; otherwise
// it's either nonexistent or hidden, so 404 — which is also what every
// unauthenticated viewer sees.
export default function PrivatePost({ slug }: { slug: string }) {
  const { client, checked } = useStudioClient()
  const [post, setPost] = useState<LoadedPost>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!checked) return
    if (!client) {
      setDone(true)
      return
    }
    let active = true
    client
      .fetch(POST_QUERY_ANY, { slug })
      .then((p: LoadedPost) => {
        if (!active) return
        setPost(p ?? null)
        setDone(true)
      })
      .catch(() => {
        if (active) setDone(true)
      })
    return () => {
      active = false
    }
  }, [client, checked, slug])

  if (!done) return null
  if (!post) notFound()

  return (
    <PostReader
      title={post.title ?? ''}
      publishedAt={post.publishedAt ?? undefined}
      sections={buildSections(post.sections)}
      isPrivate
    />
  )
}
