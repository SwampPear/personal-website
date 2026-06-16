// Sanity connection config, read from env. Kept non-throwing so the rest of the
// site still builds/runs before a project id is wired up — `isSanityConfigured`
// gates the actual data fetching.
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

export const isSanityConfigured = Boolean(projectId)
