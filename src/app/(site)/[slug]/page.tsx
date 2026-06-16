import PostReader from '@/components/PostReader'
import PrivatePost from '@/components/PrivatePost'
import { isSanityConfigured } from '@/sanity/env'
import { client } from '@/sanity/lib/client'
import { buildSections } from '@/sanity/lib/posts'
import { POST_QUERY } from '@/sanity/lib/queries'

export const revalidate = 60

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Only public posts are fetched server-side. A miss may mean the post is
  // private, so hand off to the client gate, which reveals it for the logged-in
  // owner and 404s for everyone else.
  const post = isSanityConfigured
    ? await client.fetch(POST_QUERY, { slug })
    : null
  if (!post) return <PrivatePost slug={slug} />

  return (
    <PostReader
      title={post.title ?? ''}
      publishedAt={post.publishedAt ?? undefined}
      sections={buildSections(post.sections)}
    />
  )
}
