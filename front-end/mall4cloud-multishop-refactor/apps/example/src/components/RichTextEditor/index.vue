<script setup lang="ts">
import TinymceEditor from '@tinymce/tinymce-vue'
import { computed, onMounted, ref } from 'vue'
import { useAppSettingsStore } from '@/store/modules/app/settings'
import { loadTinyMce } from './loadTinyMce'

defineOptions({
  name: 'RichTextEditor',
})

const props = withDefaults(defineProps<{
  disabled?: boolean
  minHeight?: number
  placeholder?: string
}>(), {
  disabled: false,
  minHeight: 360,
  placeholder: '请输入商品详情，可插入图片、链接、表格等内容',
})

const modelValue = defineModel<string>({ default: '' })
const appSettingsStore = useAppSettingsStore()
const editorReady = ref(false)
const editorLoadError = ref(false)

const colorScheme = computed(() => appSettingsStore.currentColorScheme || 'light')

const editorOptions = computed(() => ({
  license_key: 'gpl',
  language_url: 'tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  skin_url: colorScheme.value === 'light' ? 'tinymce/skins/ui/oxide' : 'tinymce/skins/ui/oxide-dark',
  content_css: colorScheme.value === 'light' ? 'tinymce/skins/content/default/content.min.css' : 'tinymce/skins/content/dark/content.min.css',
  min_height: props.minHeight,
  max_height: 720,
  placeholder: props.placeholder,
  plugins: 'autolink autoresize code fullscreen image insertdatetime link lists media preview table wordcount',
  toolbar: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | forecolor backcolor removeformat | link image media table | preview code fullscreen',
  branding: false,
  promotion: false,
  menubar: false,
  statusbar: true,
  toolbar_mode: 'sliding' as const,
  resize: true,
  convert_urls: false,
  relative_urls: false,
  remove_script_host: false,
  paste_data_images: true,
  content_style: 'body { line-height: 1.7; padding: 8px 12px; } img { max-width: 100%; height: auto; }',
  insertdatetime_formats: [
    '%Y年%m月%d日',
    '%H点%M分%S秒',
    '%Y-%m-%d',
    '%H:%M:%S',
  ],
  images_upload_handler: (blobInfo: { base64: () => string, blob: () => Blob }) => {
    const mimeType = blobInfo.blob().type || 'image/jpeg'
    return Promise.resolve(`data:${mimeType};base64,${blobInfo.base64()}`)
  },
}))

onMounted(async () => {
  try {
    await loadTinyMce()
    editorReady.value = true
  } catch (error) {
    editorLoadError.value = true
    console.error('富文本编辑器加载失败', error)
  }
})
</script>

<template>
  <div class="rich-text-editor">
    <TinymceEditor
      v-if="editorReady"
      :key="colorScheme"
      v-model="modelValue"
      :disabled="disabled"
      :init="editorOptions"
    />
    <div v-else class="editor-loading" :class="{ 'is-error': editorLoadError }">
      <FaIcon :name="editorLoadError ? 'i-ep:warning-filled' : 'i-ep:loading'" :class="{ 'is-loading': !editorLoadError }" />
      {{ editorLoadError ? '富文本编辑器加载失败，请刷新页面重试' : '正在加载富文本编辑器…' }}
    </div>
    <div class="editor-hint">
      <FaIcon name="i-ep:info-filled" />
      商品详情将以 HTML 富文本保存，已有图片和排版会在编辑器内直接显示。
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rich-text-editor {
  width: 100%;
  min-width: 0;

  :deep(.tox-tinymce) {
    border-color: var(--el-border-color);
    border-radius: 8px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  :deep(.tox-tinymce:focus-within) {
    border-color: var(--el-color-primary);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--el-color-primary) 12%, transparent);
  }
}

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
  gap: 8px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-lighter);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;

  &.is-error {
    color: var(--el-color-danger);
  }

  .is-loading {
    animation: editor-loading-rotate 1s linear infinite;
  }
}

@keyframes editor-loading-rotate {
  to {
    transform: rotate(360deg);
  }
}

.editor-hint {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--el-text-color-secondary);
}
</style>
