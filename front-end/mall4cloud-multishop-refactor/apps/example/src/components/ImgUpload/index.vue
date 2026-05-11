<template>
  <div class="component-img-upload">
    <div class="plugin-images">
      <div
        tabindex="0"
        class="el-upload el-upload--text"
        @click="elxImgboxHandle"
      >
        <img v-if="modelValue" :src="getImgSrc()" class="pic" alt="">
        <el-icon v-else class="el-icon-plus pic-uploader-icon">
          <Plus />
        </el-icon>
      </div>
    </div>
    <ImgBox v-if="elxImgboxVisible" ref="elxImgboxRef" @refresh-pic="refreshPic" />
    <el-dialog v-model="previewVisible" :append-to-body="true" width="650px">
      <img :src="getImgSrc()" width="100%" alt="">
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import ImgBox from '@/components/ImgBox/index.vue'

const props = defineProps({
  modelValue: {
    default: '',
    type: String,
  },
  disabled: {
    default: false,
    type: Boolean,
  },
})

const emit = defineEmits(['update:modelValue'])

const elxImgboxVisible = ref(false)
const previewVisible = ref(false)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const elxImgboxRef = ref()

const elxImgboxHandle = () => {
  if (props.disabled) {
    if (props.modelValue) {
      previewVisible.value = true
    }
    return
  }
  elxImgboxVisible.value = true
  nextTick(() => {
    elxImgboxRef.value?.init(1, 1)
  })
}

const getImgSrc = () => {
  if (!props.modelValue) return ''
  if (props.modelValue.startsWith('http://') || props.modelValue.startsWith('https://')) {
    return props.modelValue
  }
  return resourcesUrl + props.modelValue
}

const refreshPic = (imagePath: string) => {
  emit('update:modelValue', imagePath)
}
</script>

<style lang="scss" scoped>
.component-img-upload {
  .plugin-images {
    display: inline-block;

    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      .pic-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
      }

      .pic {
        width: 120px;
        height: 120px;
        display: block;
      }

      &:hover {
        border-color: #409eff;
      }
    }
  }
}
</style>
