'use client'

import { createClient } from 'next-sanity'
import { useEffect, useState } from 'react'

import { apiVersion, dataset, projectId } from '../env'

type StudioClient = ReturnType<typeof createClient>

// The embedded Studio stores the logged-in user's token in localStorage under
// this key as JSON `{ token: "..." }` (token / "dual" login). Reading it lets
// the public site act as the logged-in user without its own login flow.
function getStudioToken(): string | null {
  if (typeof window === 'undefined' || !projectId) return null
  try {
    const raw = window.localStorage.getItem(`__studio_auth_token_${projectId}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { token?: unknown }
    return typeof parsed.token === 'string' && parsed.token ? parsed.token : null
  } catch {
    return null
  }
}

// A Sanity client authenticated as the logged-in Studio user, or null when no
// one is logged in. We build a candidate that carries both the stored token
// (token/"dual" login) and credentials (cookie login), then confirm it against
// /users/me — so it works regardless of which login mode the Studio used, and
// fails safe to logged-out if the check doesn't come back with a user.
export function useStudioClient(): {
  client: StudioClient | null
  checked: boolean
} {
  const [client, setClient] = useState<StudioClient | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!projectId) {
      setChecked(true)
      return
    }

    const candidate = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false, // the CDN ignores tokens and serves cached public data
      token: getStudioToken() ?? undefined,
      withCredentials: true,
    })

    let active = true
    candidate
      .request<{ id?: string } | null>({ uri: '/users/me' })
      .then((user) => {
        if (!active) return
        setClient(user && typeof user.id === 'string' ? candidate : null)
        setChecked(true)
      })
      .catch(() => {
        if (!active) return
        setClient(null)
        setChecked(true)
      })

    return () => {
      active = false
    }
  }, [])

  return { client, checked }
}
