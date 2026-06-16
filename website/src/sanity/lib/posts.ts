import type { PostSection } from '@/components/PostReader'

import { urlFor } from './image'

export type RawSection = {
  _key: string
  content?: PostSection['content']
  image?: Parameters<typeof urlFor>[0]
}

// Resolve raw Sanity sections into the shape PostReader renders, turning image
// refs into URLs. Shared by the server post page and the client private-post
// gate so both build sections identically.
export function buildSections(
  raw: RawSection[] | null | undefined,
): PostSection[] {
  return (raw ?? []).map((s) => ({
    _key: s._key,
    content: s.content,
    imageUrl: s.image ? urlFor(s.image).width(1600).fit('max').url() : null,
  }))
}
