import { FileText, Upload, Sun, Moon, Download, Pencil, Eye } from 'lucide-react'
import { Columns2 } from 'lucide-react'

const VIEW_MODES = [
  { id: 'editor', icon: Pencil, label: 'Editor' },
  { id: 'split',  icon: Columns2, label: 'Split'  },
  { id: 'preview', icon: Eye,    label: 'Preview' },
]

/**
 * Top application bar.
 *
 * Desktop: logo + view-mode segmented control + filename input + upload + dark-mode + download PDF.
 * Mobile:  compact logo icon + upload icon + dark-mode icon.
 *          The Download PDF action lives in MobileTabBar instead.
 */
export default function Header({
  viewMode,
  setViewMode,
  isDark,
  setIsDark,
  filename,
  setFilename,
  isExporting,
  onExportPDF,
  fileInputRef,
  onFileChange,
}) {
  return (
    <header className="no-print flex-shrink-0 h-14 flex items-center justify-between px-3 md:px-4 gap-2 md:gap-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-10">

      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-9 h-9 md:w-8 md:h-8 rounded-xl bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
          <FileText size={16} className="text-white" />
        </div>
        {/* Hidden on tiny phones (< sm = 640 px), visible on sm+ */}
        <div className="leading-none hidden sm:block">
          <p className="text-[13px] font-bold tracking-tight text-gray-900 dark:text-gray-100">
            MD to PDF
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            Converter
          </p>
        </div>
      </div>

      {/* ── Desktop view-mode segmented control ──────────────────────────── */}
      <div className="hidden md:flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-0.5">
        {VIEW_MODES.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setViewMode(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              viewMode === id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <Icon size={12} strokeWidth={2} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── Right action cluster ──────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">

        {/* Filename input — desktop only */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <FileText size={11} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            className="text-xs w-28 bg-transparent focus:outline-none text-gray-600 dark:text-gray-400 placeholder-gray-300"
            placeholder="filename"
            title="PDF filename (without extension)"
          />
          <span className="text-xs text-gray-400">.pdf</span>
        </div>

        {/* Upload — icon-only on mobile (44 × 44 px), label on desktop */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Upload a Markdown file"
          className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:px-3 md:py-1.5 flex items-center justify-center md:gap-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
        >
          <Upload size={16} />
          <span className="hidden md:inline">Upload</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt,.markdown"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0])}
        />

        {/* Dark mode toggle — 44 × 44 px on mobile */}
        <button
          onClick={() => setIsDark(!isDark)}
          title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="min-w-[44px] min-h-[44px] md:w-9 md:h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 transition-colors"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Download PDF — desktop header only; mobile uses MobileTabBar */}
        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-md shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
        >
          <Download size={13} />
          <span>{isExporting ? 'Exporting…' : 'Download PDF'}</span>
        </button>
      </div>
    </header>
  )
}
