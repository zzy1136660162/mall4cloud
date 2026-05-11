<template>
  <el-dialog
    v-model="visible"
    title="查看图片"
    :close-on-click-modal="false"
    top="0"
    :append-to-body="true"
    :lock-scroll="true"
    width="650px"
  >
    <div class="img-box">
      <img :src="imgUrl" class="img" alt="">
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const visible = ref(false)
const imgUrl = ref('')
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const init = (img: string) => {
  if (img.startsWith('http://') || img.startsWith('https://')) {
    imgUrl.value = img
  } else {
    imgUrl.value = resourcesUrl + img
  }
  visible.value = true
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped>
.img-box {
  display: block;
  width: 100%;
  max-height: 700px;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  .img {
    display: block;
    width: 100%;
    height: auto;
  }
}
</style>
