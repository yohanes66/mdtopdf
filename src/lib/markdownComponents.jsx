/**
 * Custom component overrides for react-markdown.
 * Each entry replaces the default HTML element with a styled React component.
 * These styles are intentionally framework-agnostic (Tailwind utility classes)
 * so the same component map can be reused in both the live preview and the
 * hidden export container.
 */
export const MarkdownComponents = {
  // ── Code ──────────────────────────────────────────────────────────────────
  pre({ children }) {
    return (
      <div className="my-5 rounded-xl overflow-hidden shadow-md">{children}</div>
    )
  },

  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const raw = String(children).replace(/\n$/, '')
    const isBlock = raw.includes('\n') || Boolean(match)

    if (isBlock) {
      return (
        <div>
          {match && (
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2.5 border-b border-gray-700">
              <span className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
                <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
                <span className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
              </span>
              <span className="ml-1 text-xs font-mono text-gray-400 tracking-wide">
                {match[1]}
              </span>
            </div>
          )}
          <pre className="bg-gray-900 text-gray-100 p-5 overflow-x-auto text-[13px] leading-relaxed font-mono m-0">
            <code>{raw}</code>
          </pre>
        </div>
      )
    }

    // Inline code
    return (
      <code
        className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono border border-rose-100 dark:border-rose-900/50"
        {...props}
      >
        {children}
      </code>
    )
  },

  // ── Block elements ─────────────────────────────────────────────────────────
  blockquote({ children }) {
    return (
      <blockquote className="not-prose my-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 pl-4 pr-4 py-3 rounded-r-xl text-gray-700 dark:text-gray-300 italic">
        {children}
      </blockquote>
    )
  },

  hr() {
    return (
      <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
    )
  },

  p({ children }) {
    return (
      <p className="my-3 text-gray-700 dark:text-gray-300 leading-relaxed">
        {children}
      </p>
    )
  },

  // ── Headings ───────────────────────────────────────────────────────────────
  h1({ children }) {
    return (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mt-8 mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700 first:mt-0">
        {children}
      </h1>
    )
  },
  h2({ children }) {
    return (
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-7 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700/60">
        {children}
      </h2>
    )
  },
  h3({ children }) {
    return (
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-5 mb-2">
        {children}
      </h3>
    )
  },
  h4({ children }) {
    return (
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-4 mb-2">
        {children}
      </h4>
    )
  },

  // ── Lists ──────────────────────────────────────────────────────────────────
  ul({ children }) {
    return (
      <ul className="my-3 pl-6 space-y-1 list-disc text-gray-700 dark:text-gray-300">
        {children}
      </ul>
    )
  },
  ol({ children }) {
    return (
      <ol className="my-3 pl-6 space-y-1 list-decimal text-gray-700 dark:text-gray-300">
        {children}
      </ol>
    )
  },
  li({ children, checked }) {
    if (checked !== null && checked !== undefined) {
      return (
        <li className="flex items-start gap-2 list-none -ml-1">
          <span
            className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${
              checked
                ? 'bg-blue-500 border-blue-500'
                : 'border-gray-400 dark:border-gray-500'
            }`}
          >
            {checked && (
              <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2.5">
                <path
                  d="M1 4l3 3 5-6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </span>
          <span
            className={
              checked ? 'line-through text-gray-400 dark:text-gray-500' : ''
            }
          >
            {children}
          </span>
        </li>
      )
    }
    return <li className="leading-relaxed">{children}</li>
  },

  // ── Table ──────────────────────────────────────────────────────────────────
  table({ children }) {
    return (
      <div className="not-prose overflow-x-auto my-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-sm text-left">{children}</table>
      </div>
    )
  },
  thead({ children }) {
    return (
      <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wider">
        {children}
      </thead>
    )
  },
  tbody({ children }) {
    return (
      <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
        {children}
      </tbody>
    )
  },
  th({ children }) {
    return <th className="px-4 py-3 font-semibold">{children}</th>
  },
  td({ children }) {
    return <td className="px-4 py-3">{children}</td>
  },

  // ── Inline ─────────────────────────────────────────────────────────────────
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 underline underline-offset-2 decoration-blue-300 dark:decoration-blue-700 hover:decoration-blue-500 transition-colors"
      >
        {children}
      </a>
    )
  },

  strong({ children }) {
    return (
      <strong className="font-semibold text-gray-900 dark:text-gray-100">
        {children}
      </strong>
    )
  },

  // ── Media ──────────────────────────────────────────────────────────────────
  img({ src, alt }) {
    return (
      <figure className="my-6">
        <img
          src={src}
          alt={alt}
          className="max-w-full h-auto rounded-xl shadow-md mx-auto"
        />
        {alt && (
          <figcaption className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    )
  },
}
