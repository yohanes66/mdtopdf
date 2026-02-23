export const DEFAULT_MARKDOWN = `# MD to PDF Converter

> A **sophisticated**, real-time Markdown editor with one-click PDF export.
> Type or upload any \`.md\` file and download a beautifully formatted PDF.

---

## Features at a Glance

| Feature | Description | Status |
|---|---|---|
| Live Preview | Renders as you type | ✅ Active |
| Dark / Light Mode | Comfortable editing any time | ✅ Active |
| Drag & Drop Upload | Drop a \`.md\` file anywhere | ✅ Active |
| Resizable Panes | Drag the divider to resize | ✅ Active |
| PDF Export | High-quality A4 PDF output | ✅ Active |
| Auto-save | Persists to local storage | ✅ Active |

---

## Text Formatting

You can write **bold**, *italic*, ~~strikethrough~~, and \`inline code\` text.
Combine them: ***bold italic***, ~~**bold strike**~~.

Here's a [hyperlink](https://github.com) that opens in a new tab.

---

## Code Blocks

\`\`\`javascript
// Fibonacci with memoization
function fib(n, memo = {}) {
  if (n in memo) return memo[n]
  if (n <= 1) return n
  memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
  return memo[n]
}

console.log(fib(40)) // → 102334155
\`\`\`

\`\`\`css
/* Beautiful gradient button */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  color: white;
  font-weight: 600;
}
\`\`\`

---

## Lists

### Unordered
- **Design** — Minimal, Apple-inspired interface
- **Performance** — Instant preview updates
  - Debounced for large documents
  - Zero layout shift
- **Accessibility** — Keyboard navigable toolbar

### Ordered
1. Open the app
2. Type your Markdown or upload a file
3. Preview updates in real time
4. Click **Download PDF** — done

### Task List
- [x] Build the editor pane
- [x] Add live markdown preview
- [x] Implement dark mode
- [x] Drag & drop file upload
- [x] PDF export with proper styling
- [ ] Add syntax highlighting (coming soon)

---

## Blockquotes

> "Simplicity is the soul of efficiency."
> — Austin Freeman

> **Nested quote example:**
>
> > "Any sufficiently advanced technology is indistinguishable from magic."
> > — Arthur C. Clarke

---

## Images

![Placeholder landscape](https://picsum.photos/seed/md2pdf/800/300)

*Caption: Images are fully supported and scale to the document width.*

---

## Horizontal Rules divide sections

---

**Start editing above** to see changes rendered instantly in the preview pane. →
`
