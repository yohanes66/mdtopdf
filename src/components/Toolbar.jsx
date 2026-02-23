import {
  Bold, Italic, Strikethrough, Code, Code2,
  Heading1, Heading2, Heading3,
  Link2, Image, Quote, List, ListOrdered,
  Table, Minus, CheckSquare,
} from 'lucide-react'

// ─── Primitive components ────────────────────────────────────────────────────
function ToolbarBtn({ icon: Icon, label, title, onClick }) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault() // keep textarea focused while clicking toolbar
        onClick()
      }}
      title={title || label}
      aria-label={title || label}
      className="
        flex items-center justify-center gap-1
        min-h-[44px] min-w-[44px] px-2.5
        md:min-h-0 md:min-w-0 md:px-2 md:py-1.5
        rounded-md text-xs font-medium
        text-gray-500 dark:text-gray-400
        hover:bg-gray-100 dark:hover:bg-gray-800
        active:bg-gray-200 dark:active:bg-gray-700
        hover:text-gray-900 dark:hover:text-white
        transition-colors duration-100 whitespace-nowrap select-none
      "
    >
      {Icon && <Icon size={15} strokeWidth={2} />}
      {label && <span className="hidden xl:inline text-[11px]">{label}</span>}
    </button>
  )
}

function Divider() {
  return (
    <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1 flex-shrink-0 self-center" />
  )
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────
/**
 * Horizontally scrollable formatting toolbar.
 * Receives `insertMarkdown` from App and passes it to each button's onClick.
 * Touch targets are 44 × 44 px on mobile; compact on desktop.
 */
export default function Toolbar({ insertMarkdown }) {
  const groups = [
    [
      { icon: Heading1, label: 'H1', title: 'Heading 1', fn: () => insertMarkdown('# ', '', 'Heading 1') },
      { icon: Heading2, label: 'H2', title: 'Heading 2', fn: () => insertMarkdown('## ', '', 'Heading 2') },
      { icon: Heading3, label: 'H3', title: 'Heading 3', fn: () => insertMarkdown('### ', '', 'Heading 3') },
    ],
    [
      { icon: Bold,          label: 'Bold',        title: 'Bold (⌘B)',    fn: () => insertMarkdown('**', '**', 'bold text') },
      { icon: Italic,        label: 'Italic',      title: 'Italic (⌘I)',  fn: () => insertMarkdown('*', '*', 'italic text') },
      { icon: Strikethrough, label: 'Strike',      title: 'Strikethrough', fn: () => insertMarkdown('~~', '~~', 'strikethrough') },
      { icon: Code,          label: 'Inline Code', title: 'Inline code',  fn: () => insertMarkdown('`', '`', 'code') },
    ],
    [
      { icon: Link2, label: 'Link',  title: 'Link (⌘K)', fn: () => insertMarkdown('[', '](https://)', 'link text') },
      { icon: Image, label: 'Image', title: 'Image',     fn: () => insertMarkdown('![', '](https://)', 'alt text') },
    ],
    [
      { icon: Quote,       label: 'Quote',   title: 'Blockquote',  fn: () => insertMarkdown('\n> ', '', 'quote text') },
      { icon: List,        label: 'List',    title: 'Bullet list', fn: () => insertMarkdown('\n- ', '', 'list item') },
      { icon: ListOrdered, label: 'Ordered', title: 'Ordered list', fn: () => insertMarkdown('\n1. ', '', 'list item') },
      { icon: CheckSquare, label: 'Tasks',   title: 'Task list',   fn: () => insertMarkdown('\n- [ ] ', '', 'task item') },
    ],
    [
      {
        icon: Table, label: 'Table', title: 'Insert table',
        fn: () => insertMarkdown(
          '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n| Cell 4   | Cell 5   | Cell 6   |\n',
          ''
        ),
      },
      { icon: Code2, label: 'Code Block', title: 'Fenced code block', fn: () => insertMarkdown('\n```\n', '\n```\n', 'code here') },
      { icon: Minus, label: 'Rule',       title: 'Horizontal rule',   fn: () => insertMarkdown('\n\n---\n\n', '') },
    ],
  ]

  return (
    <div className="no-print flex-shrink-0 flex items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 overflow-x-auto scrollbar-none px-1 md:px-2">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center flex-shrink-0">
          {gi > 0 && <Divider />}
          {group.map((btn, bi) => (
            <ToolbarBtn
              key={bi}
              icon={btn.icon}
              label={btn.label}
              title={btn.title}
              onClick={btn.fn}
            />
          ))}
        </div>
      ))}
      {/* trailing spacer prevents the last button from sitting flush on scroll */}
      <div className="w-2 flex-shrink-0" aria-hidden="true" />
    </div>
  )
}
