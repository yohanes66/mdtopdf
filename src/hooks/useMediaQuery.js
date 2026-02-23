import { useState, useEffect } from 'react'

/**
 * Reactively tracks a CSS media query.
 * Returns true when the query matches, updates on resize/orientation change.
 *
 * @param {string} query - A valid CSS media query string, e.g. '(max-width: 767px)'
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}
