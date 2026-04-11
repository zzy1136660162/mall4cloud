<template>
  <el-dialog
    v-model="visible"
    title="选择品牌"
    top="50px"
    :close-on-click-modal="false"
    class="component-brand-selector"
    width="800px"
  >
    <el-form :inline="true" :model="dataForm" class="demo-form-inline">
      <el-form-item label="品牌名称">
        <el-input v-model.trim="brandName" placeholder="品牌名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="prods-select-body">
      <el-table
        ref="brandTable"
        v-loading="brandListLoading"
        :data="pageVO.list"
        border
        style="width: 100%;"
      >
        <el-table-column v-if="isSingle" width="50" header-align="center" align="center">
          <template #default="{ row }">
            <el-radio v-model="singleSelectBrandId" :label="row.brandId" @change="getSelectBrandRow(row)" />
          </template>
        </el-table-column>

        <el-table-column prop="brandName" header-align="center" align="center" label="品牌名称">
          <template #default="{ row }">
            {{ row.name }}
          </template>
        </el-table-column>

        <el-table-column prop="firstChar" align="center" label="品牌首字母">
          <template #default="{ row }">
            {{ row.firstLetter }}
          </template>
        </el-table-column>

        <el-table-column prop="status" align="center" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '正常' : '下线' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" width="140" label="品牌图片">
          <template #default="{ row }">
            <img v-if="row.imgUrl" :src="getImgSrc(row.imgUrl)" class="brand-img" alt="">
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submitBrand">提交</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { productApi } from '@/api/modules/product'

interface Brand {
  brandId: number
  name: string
  firstLetter?: string
  imgUrl: string
  status: number
}

const props = defineProps({
  isSingle: {
    default: false,
    type: Boolean,
  },
})

const emit = defineEmits(['refreshSelectBrand'])

const visible = ref(false)
const brandName = ref('')
const dataForm = reactive({
  categoryId: 0,
})
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const pageVO = reactive({
  list: [] as any[],
  total: 0,
  pages: 0,
})
const brandListLoading = ref(false)
const singleSelectBrandId = ref(0)
const brandListSelections = ref<any[]>([])
const brandTable = ref()

const getImgSrc = (img: string) => {
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return resourcesUrl + img
}

const init = (selectBrand: any[], categoryId: number) => {
  visible.value = true
  dataForm.categoryId = categoryId
  brandListLoading.value = true
  brandListSelections.value = []
  if (selectBrand) {
    selectBrand.forEach((row: any) => {
      brandListSelections.value.push(row)
    })
  }
  getBrandList()
}

const onSearch = () => {
  getBrandList()
}

const getBrandList = () => {
  brandListLoading.value = true
  productApi.brand.getByCategoryId({
    categoryId: dataForm.categoryId,
    name: brandName.value || undefined,
  }).then((data: any) => {
    pageVO.list = data
    brandListLoading.value = false
  })
}

const getSelectBrandRow = (row: any) => {
  brandListSelections.value = [row]
}

const submitBrand = () => {
  const brands = brandListSelections.value.map(item => ({
    brandId: item.brandId,
    brandName: item.name,
    brandImgUrl: getImgSrc(item.imgUrl),
  }))
  emit('refreshSelectBrand', brands)
  brandListSelections.value = []
  visible.value = false
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped>
.component-brand-selector {
  .prods-select-body {
    height: 500px;
    overflow: auto;
  }

  .brand-img {
    width: auto;
    max-width: 100%;
    height: auto;
    max-height: 80px;
  }
}
</style>
