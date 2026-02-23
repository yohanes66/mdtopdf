import { Upload } from 'lucide-react'

/**
 * Full-screen overlay shown while the user drags a file over the app window.
 * Rendered at z-50 so it sits above all other content.
 */
export default function DragOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10 dark:bg-blue-400/10 border-4 border-dashed border-blue-400 dark:border-blue-500 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center ring-1 ring-gray-100 dark:ring-gray-700 mx-4">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-5">
          <Upload className="text-blue-500" size={28} />
        </div>
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Drop your Markdown file
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
          Supports{' '}
          <code className="text-blue-600 dark:text-blue-400">.md</code>,{' '}
          <code className="text-blue-600 dark:text-blue-400">.txt</code>,{' '}
          <code className="text-blue-600 dark:text-blue-400">.markdown</code>
        </p>
      </div>
    </div>
  )
}
