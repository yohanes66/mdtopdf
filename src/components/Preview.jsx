import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MarkdownComponents } from '../lib/markdownComponents'

/**
 * Markdown preview pane.
 *
 * Renders the content as an A4 paper simulation on desktop.
 * On mobile, padding is reduced and the min-height constraint is removed
 * so the content flows naturally without excess whitespace.
 *
 * The `previewRef` is forwarded to the inner paper div so that App can
 * capture it with html2pdf.js for PDF export.
 */
export default function Preview({ markdown, previewRef, isMobile, width }) {
  return (
    <div className="flex flex-col overflow-hidden" style={{ width }}>
      {/* ── Pane label ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800/80">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
          Preview
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-600">
          A4 · PDF Ready
        </span>
      </div>

      {/* ── Scrollable paper area ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-950 p-2 sm:p-4 md:p-6">
        {/*
          A4 paper simulation.
          Desktop → full A4 proportions: 794 × 1123 px, generous padding.
          Mobile  → padding is reduced, min-height removed so it reads naturally.
        */}
        <div
          ref={previewRef}
          className="mx-auto bg-white dark:bg-gray-900 shadow-xl dark:shadow-2xl dark:shadow-black/60 rounded-sm"
          style={{
            maxWidth: '794px',
            minHeight: isMobile ? 'auto' : '1123px',
            padding: isMobile ? '20px 16px' : '60px 72px',
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
