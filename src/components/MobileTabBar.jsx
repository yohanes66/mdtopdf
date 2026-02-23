import { Pencil, Eye, Download } from 'lucide-react'

/**
 * Bottom navigation bar — visible only on mobile (< md breakpoint).
 *
 * Layout:  [ Edit tab ]  [ Download PDF circle button ]  [ Preview tab ]
 *
 * The centred circle button is the primary action on mobile (analogous to
 * the "Download PDF" button in the desktop header). It uses the same gradient
 * as the desktop button so the brand stays consistent across breakpoints.
 *
 * Both tab buttons have min-h-[60px] to satisfy the 44 × 44 px touch-target
 * guidelines with comfortable vertical padding.
 */
export default function MobileTabBar({ mobileTab, setMobileTab, isExporting, onExportPDF }) {
  return (
    <nav className="md:hidden no-print flex-shrink-0 flex items-stretch bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 safe-b">

      {/* Edit tab */}
      <button
        onClick={() => setMobileTab('editor')}
        className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[60px] transition-colors active:bg-gray-50 dark:active:bg-gray-800 ${
          mobileTab === 'editor'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        <Pencil size={20} strokeWidth={mobileTab === 'editor' ? 2.5 : 1.5} />
        <span className="text-[11px] font-medium">Edit</span>
      </button>

      {/* Centred Download PDF action */}
      <div className="flex items-center justify-center px-5 py-2">
        <button
          onClick={onExportPDF}
          disabled={isExporting}
          title="Download PDF"
          aria-label="Download PDF"
          className="flex flex-col items-center justify-center w-[56px] h-[56px] rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/30 disabled:opacity-60 active:scale-95 transition-all duration-150"
        >
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Download size={19} strokeWidth={2} />
              <span className="text-[9px] font-semibold mt-0.5 tracking-wide">PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Preview tab */}
      <button
        onClick={() => setMobileTab('preview')}
        className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 min-h-[60px] transition-colors active:bg-gray-50 dark:active:bg-gray-800 ${
          mobileTab === 'preview'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}
      >
        <Eye size={20} strokeWidth={mobileTab === 'preview' ? 2.5 : 1.5} />
        <span className="text-[11px] font-medium">Preview</span>
      </button>
    </nav>
  )
}
