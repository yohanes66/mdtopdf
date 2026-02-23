import { useState, useRef, useCallback, useEffect } from 'react'
import { GripVertical } from 'lucide-react'

import { DEFAULT_MARKDOWN } from './lib/defaultContent'
import { useMediaQuery } from './hooks/useMediaQuery'

import DragOverlay    from './components/DragOverlay'
import Header         from './components/Header'
import Toolbar        from './components/Toolbar'
import Editor         from './components/Editor'
import Preview        from './components/Preview'
import MobileTabBar   from './components/MobileTabBar'

// ─────────────────────────────────────────────────────────────────────────────
// App — root component, owns all state and side-effects.
//
// Rendering is delegated entirely to the child components above.
// This file is intentionally limited to: state, effects, and event handlers.
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── Persisted state ───────────────────────────────────────────────────────
  const [markdown, setMarkdown] = useState(() => {
    return localStorage.getItem('md2pdf:content') || DEFAULT_MARKDOWN
  })
  const [isDark, setIsDark] = useState(() =>
    localStorage.getItem('md2pdf:dark') === 'true'
  )

  // ── UI state ──────────────────────────────────────────────────────────────
  const [viewMode, setViewMode]   = useState('split')   // desktop: editor|split|preview
  const [mobileTab, setMobileTab] = useState('editor')  // mobile:  editor|preview
  const [filename, setFilename]   = useState('document')
  const [isExporting, setIsExporting] = useState(false)
  const [isDragging,  setIsDragging]  = useState(false)
  const [splitPos, setSplitPos]   = useState(50) // % width of left/editor pane

  // ── Refs ──────────────────────────────────────────────────────────────────
  const textareaRef     = useRef(null)
  const previewRef      = useRef(null)
  const fileInputRef    = useRef(null)
  const dividerDragging = useRef(false)

  // ── Responsive breakpoint ─────────────────────────────────────────────────
  // Mirrors Tailwind's `md` breakpoint (768 px).
  const isMobile = useMediaQuery('(max-width: 767px)')

  // ── Derived pane visibility ───────────────────────────────────────────────
  const showEditor  = isMobile ? mobileTab === 'editor'  : viewMode === 'editor'  || viewMode === 'split'
  const showPreview = isMobile ? mobileTab === 'preview' : viewMode === 'preview' || viewMode === 'split'
  const showDivider = !isMobile && viewMode === 'split'

  // ── Derived pane widths ───────────────────────────────────────────────────
  const editorWidth  = showDivider ? `${splitPos}%`       : '100%'
  const previewWidth = showDivider ? `${100 - splitPos}%` : '100%'

  // ── Derived stats ─────────────────────────────────────────────────────────
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0
  const charCount = markdown.length

  // ── Effects ───────────────────────────────────────────────────────────────
  // 1. Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('md2pdf:dark', isDark)
  }, [isDark])

  // 2. Auto-save markdown to localStorage (debounced 800 ms)
  useEffect(() => {
    const id = setTimeout(
      () => localStorage.setItem('md2pdf:content', markdown),
      800
    )
    return () => clearTimeout(id)
  }, [markdown])

  // 3. Resizable split pane — global mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      if (!dividerDragging.current) return
      const container = document.getElementById('main-container')
      if (!container) return
      const rect = container.getBoundingClientRect()
      const pct = ((e.clientX - rect.left) / rect.width) * 100
      setSplitPos(Math.min(Math.max(pct, 25), 75))
    }
    const onUp = () => {
      if (dividerDragging.current) {
        dividerDragging.current = false
        document.body.classList.remove('dragging-divider')
      }
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // ── Markdown insertion ────────────────────────────────────────────────────
  const insertMarkdown = useCallback(
    (before, after = '', placeholder = '') => {
      const el = textareaRef.current
      if (!el) return
      const start = el.selectionStart
      const end   = el.selectionEnd
      const selected = markdown.slice(start, end) || placeholder

      setMarkdown(
        markdown.slice(0, start) + before + selected + after + markdown.slice(end)
      )

      requestAnimationFrame(() => {
        el.focus()
        el.setSelectionRange(
          start + before.length,
          start + before.length + selected.length
        )
      })
    },
    [markdown]
  )

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      insertMarkdown('  ')
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      insertMarkdown('**', '**', 'bold text')
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      insertMarkdown('*', '*', 'italic text')
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      insertMarkdown('[', '](url)', 'link text')
    }
  }

  // ── File handling ─────────────────────────────────────────────────────────
  const handleFile = useCallback((file) => {
    if (!file) return
    setFilename(file.name.replace(/\.(md|txt|markdown)$/i, ''))
    const reader = new FileReader()
    reader.onload = (e) => setMarkdown(e.target.result)
    reader.readAsText(file)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      handleFile(e.dataTransfer.files[0])
    },
    [handleFile]
  )

  // ── PDF Export ────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    if (isExporting) return
    setIsExporting(true)

    // html2pdf captures computed styles, so we temporarily switch to light mode
    // to guarantee a white-on-white print regardless of the user's theme choice.
    const wasDark = isDark
    if (wasDark) {
      document.documentElement.classList.remove('dark')
      await new Promise((r) => setTimeout(r, 200)) // wait one repaint
    }

    try {
      // Lazy-load html2pdf so it doesn't bloat the initial bundle.
      const html2pdf = (await import('html2pdf.js')).default
      await html2pdf()
        .set({
          margin: [14, 18, 14, 18],
          filename: `${filename || 'document'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(previewRef.current)
        .save()
    } catch (err) {
      console.error('PDF export failed:', err)
    } finally {
      if (wasDark) document.documentElement.classList.add('dark')
      setIsExporting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="h-[100dvh] flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-200"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Global drag-and-drop overlay */}
      {isDragging && <DragOverlay />}

      {/* Top header bar */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDark={isDark}
        setIsDark={setIsDark}
        filename={filename}
        setFilename={setFilename}
        isExporting={isExporting}
        onExportPDF={exportPDF}
        fileInputRef={fileInputRef}
        onFileChange={handleFile}
      />

      {/* Formatting toolbar — only when the editor pane is visible */}
      {showEditor && <Toolbar insertMarkdown={insertMarkdown} />}

      {/* Main content area: editor + optional divider + preview */}
      <div id="main-container" className="flex flex-1 overflow-hidden">

        {showEditor && (
          <Editor
            markdown={markdown}
            setMarkdown={setMarkdown}
            textareaRef={textareaRef}
            wordCount={wordCount}
            charCount={charCount}
            onKeyDown={handleKeyDown}
            width={editorWidth}
          />
        )}

        {/* Resizable divider — desktop split view only */}
        {showDivider && (
          <div
            onMouseDown={() => {
              dividerDragging.current = true
              document.body.classList.add('dragging-divider')
            }}
            className="flex-shrink-0 w-1.5 cursor-col-resize group relative bg-gray-200 dark:bg-gray-800 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors duration-150"
            title="Drag to resize panes"
          >
            <div className="absolute inset-y-0 -left-1.5 -right-1.5 flex items-center justify-center">
              <GripVertical
                size={14}
                className="text-gray-400 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
              />
            </div>
          </div>
        )}

        {showPreview && (
          <Preview
            markdown={markdown}
            previewRef={previewRef}
            isMobile={isMobile}
            width={previewWidth}
          />
        )}
      </div>

      {/* Mobile bottom navigation (hidden on md+) */}
      <MobileTabBar
        mobileTab={mobileTab}
        setMobileTab={setMobileTab}
        isExporting={isExporting}
        onExportPDF={exportPDF}
      />
    </div>
  )
}
