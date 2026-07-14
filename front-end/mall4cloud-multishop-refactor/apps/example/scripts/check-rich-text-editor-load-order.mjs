import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const editorPath = fileURLToPath(new URL('../src/components/RichTextEditor/index.vue', import.meta.url))
const source = await readFile(editorPath, 'utf8')

assert.doesNotMatch(
  source,
  /^import\s+['"]tinymce\/(?:themes|icons|models|plugins)\//m,
  'TinyMCE extensions must load after the TinyMCE global is initialized',
)

assert.match(
  source,
  /await\s+loadTinyMce\(\)/,
  'RichTextEditor must wait for TinyMCE extensions before rendering the editor',
)

assert.match(
  source,
  /v-if="editorReady"/,
  'RichTextEditor must not render before TinyMCE is ready',
)

console.log('rich text editor load-order check passed')
