type TinyMceModule = {
  default?: unknown
}

let loadPromise: Promise<void> | undefined

export function loadTinyMce() {
  if (!loadPromise) {
    loadPromise = (async () => {
      const tinyMceModule = await import('tinymce/tinymce') as TinyMceModule
      const tinyMce = tinyMceModule.default ?? tinyMceModule

      // TinyMCE extensions access the browser global during module evaluation.
      // Initialize it before loading themes, icons, models, or plugins.
      ;(globalThis as typeof globalThis & { tinymce?: unknown }).tinymce = tinyMce

      await Promise.all([
        import('tinymce/themes/silver/theme'),
        import('tinymce/icons/default/icons'),
        import('tinymce/models/dom'),
        import('tinymce/plugins/autolink'),
        import('tinymce/plugins/autoresize'),
        import('tinymce/plugins/code'),
        import('tinymce/plugins/fullscreen'),
        import('tinymce/plugins/image'),
        import('tinymce/plugins/insertdatetime'),
        import('tinymce/plugins/link'),
        import('tinymce/plugins/lists'),
        import('tinymce/plugins/media'),
        import('tinymce/plugins/preview'),
        import('tinymce/plugins/table'),
        import('tinymce/plugins/wordcount'),
      ])
    })().catch((error) => {
      loadPromise = undefined
      throw error
    })
  }

  return loadPromise
}
