import { defineQuery } from 'next-sanity'

// Public list — excludes private posts. This is what anonymous viewers and
// other users get from the server-rendered page.
export const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current) && private != true]|order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt
  }`,
)

// Full list including private posts. Only fetched client-side with the logged-in
// Studio user's token; each item carries `isPrivate` so the UI can tag it.
export const POSTS_QUERY_ALL = defineQuery(
  `*[_type == "post" && defined(slug.current)]|order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "isPrivate": private == true
  }`,
)

// Public single post — private posts resolve to null so their page 404s for
// everyone who is not authenticated.
export const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug && private != true][0]{
    title,
    publishedAt,
    sections[]{
      _key,
      content,
      image
    }
  }`,
)

// Single post without the private filter. Only fetched client-side with the
// logged-in Studio user's token (used to render a private post's own page).
export const POST_QUERY_ANY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{
    title,
    publishedAt,
    sections[]{
      _key,
      content,
      image
    }
  }`,
)
