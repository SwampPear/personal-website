import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  // Fallback keeps createClient happy before configuration; fetches are gated
  // by `isSanityConfigured` so this placeholder is never actually queried.
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion,
  useCdn: true,
})
