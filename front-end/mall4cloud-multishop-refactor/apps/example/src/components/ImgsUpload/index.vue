<template>
  <div class="component-imgs-upload">
    <div class="el-upload-list el-upload-list--picture-card">
      <div
        v-for="(item, index) in imageList"
        :key="index"
        class="el-upload-list__item is-success"
      >
        <img :src="item.url" class="el-upload-list__item-thumbnail" alt="">
        <a class="el-upload-list__item-name">
          <el-icon><Document /></el-icon>
        </a>
        <label class="el-upload-list__item-status-label">
          <el-icon class="el-icon-upload-success el-icon-check"><Check /></el-icon>
        </label>
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(item.url)">
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(index)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
      <div
        v-if="!disabled && imageList.length < limit"
        class="el-upload-list__item"
        @click="elxImgboxHandle"
      >
        <div tabindex="0" class="el-upload el-upload--picture-card">
          <el-icon><Plus /></el-icon>
        </div>
      </div>
    </div>
    <ImgBox v-if="elxImgboxVisible" ref="elxImgboxRef" @refresh-pic="refreshPic" />
    <el-dialog v-model="dialogVisible" :modal="modal" top="7vh" :append-to-body="true">
      <img :src="dialogImageUrl" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ImgBox from '@/components/ImgBox/index.vue'

interface ImageItem {
  url: string
  response: string
}

const props = withDefaults(defineProps<{
  modelValue?: string
  limit?: number
  disabled?: boolean
  modal?: boolean
}>(), {
  modelValue: '',
  limit: 9,
  disabled: false,
  modal: true,
})

const emit = defineEmits(['update:modelValue'])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const elxImgboxVisible = ref(false)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const imageList = ref<ImageItem[]>([])
const elxImgboxRef = ref()

const getImgSrc = (img: string) => {
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return resourcesUrl + img
}

watch(() => props.modelValue, () => {
  const res: ImageItem[] = []
  if (props.modelValue) {
    const imageArray = props.modelValue.split(',')
    for (let i = 0; i < imageArray.length; i++) {
      if (imageArray[i]) {
        res.push({ url: getImgSrc(imageArray[i]), response: imageArray[i] })
      }
    }
  }
  imageList.value = res
}, { immediate: true })

watch(imageList, () => {
  const pics = imageList.value.map(file => file.response).join(',')
  emit('update:modelValue', pics)
}, { deep: true })

const handleRemove = (index: number) => {
  imageList.value.splice(index, 1)
}

const handlePictureCardPreview = (imgUrl: string) => {
  dialogImageUrl.value = imgUrl
  dialogVisible.value = true
}

const elxImgboxHandle = () => {
  const num = props.limit - imageList.value.length
  if (num < 1) {
    return
  }
  elxImgboxVisible.value = true
}

const refreshPic = (imagePath: string) => {
  const imageArray = imagePath.split(',')
  let pics = imageArray.join(',')
  if (props.modelValue) {
    pics = props.modelValue + ',' + pics
  }
  emit('update:modelValue', pics)
}
</script>

<style lang="scss" scoped>
.component-imgs-upload {
  :deep(.el-upload-list--picture-card) {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  :deep(.el-upload-list__item) {
    width: 120px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    margin: 0;
  }

  :deep(.el-upload--picture-card) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    background: #fff;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    cursor: pointer;

    &:hover {
      border-color: #409eff;
    }
  }

  :deep(.el-icon-check) {
    color: #fff;
  }

  :deep(.el-upload-list__item-actions) {
    .el-upload-list__item-preview,
    .el-upload-list__item-delete {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
