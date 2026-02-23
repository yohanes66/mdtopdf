import { useState, useRef } from 'react'
import { Copy, Check, Trash2 } from 'lucide-react'

/**
 * Markdown editor pane.
 *
 * Includes:
 *   - Word / character stats in the pane header
 *   - Copy to Clipboard button (with 2 s "Copied!" feedback)
 *   - Clear All button (two-step confirmation — avoids native dialogs)
 *   - The <textarea> itself with keyboard shortcuts delegated via onKeyDown
 */
export default function Editor({
  markdown,
  setMarkdown,
  textareaRef,
  wordCount,
  charCount,
  onKeyDown,
  width,
}) {
  const [copied, setCopied] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const confirmTimer = useRef(null)

  // ── Copy to clipboard ───────────────────────────────────────────────────
  const handleCopy = async () => {
    if (!markdown) return
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea')
      ta.value = markdown
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ── Clear All (two-step) ────────────────────────────────────────────────
  // First click → shows "Confirm?" state for 3 s.
  // Second click within that window → clears the editor.
  // Hovering away or waiting resets automatically.
  const handleClear = () => {
    if (!markdown.trim()) return
    if (confirmClear) {
      clearTimeout(confirmTimer.current)
      setConfirmClear(false)
      setMarkdown('')
      textareaRef.current?.focus()
    } else {
      setConfirmClear(true)
      confirmTimer.current = setTimeout(() => setConfirmClear(false), 3000)
    }
  }

  const isEmpty = !markdown.trim()

  return (
    <div
      className="flex flex-col overflow-hidden border-r border-gray-200 dark:border-gray-800"
      style={{ width }}
    >
      {/* ── Pane header: stats + action buttons ──────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80 gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 flex-shrink-0">
          Markdown
        </span>

        <div className="flex items-center gap-1 ml-auto">
          {/* Word / char count — hidden on the smallest screens */}
          <span className="hidden sm:inline text-[10px] text-gray-400 dark:text-gray-600 mr-2">
            {wordCount.toLocaleString()} word{wordCount !== 1 ? 's' : ''} ·{' '}
            {charCount.toLocaleString()} chars
          </span>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopy}
            disabled={isEmpty}
            title={copied ? 'Copied to clipboard!' : 'Copy markdown to clipboard'}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
              copied
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Clear All */}
          <button
            onClick={handleClear}
            disabled={isEmpty}
            title={
              confirmClear
                ? 'Click again to confirm — clears everything'
                : 'Clear all content'
            }
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
              confirmClear
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 ring-1 ring-red-300 dark:ring-red-700'
                : 'text-gray-400 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <Trash2 size={11} />
            <span className="hidden sm:inline">
              {confirmClear ? 'Confirm?' : 'Clear'}
            </span>
          </button>
        </div>
      </div>

      {/* ── Textarea ─────────────────────────────────────────────────────── */}
      <textarea
        ref={textareaRef}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        className="md-editor flex-1 w-full px-4 py-4 md:px-5 md:py-5 resize-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-700 focus:outline-none"
        placeholder="Start typing your Markdown here…"
      />
    </div>
  )
}
