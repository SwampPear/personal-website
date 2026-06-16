import Home from '@/components/Home'
import { isSanityConfigured } from '@/sanity/env'
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'

// Refetch from Sanity at most once a minute.
export const revalidate = 60

export default async function Page() {
  const posts = isSanityConfigured ? await client.fetch(POSTS_QUERY) : []
  return <Home posts={posts} />
}
