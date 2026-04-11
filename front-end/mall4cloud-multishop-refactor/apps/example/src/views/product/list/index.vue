<template>
  <div class="page-product-list">
    <el-form :inline="true" :model="pageQuery" class="demo-form-inline">
      <el-form-item label="商品名称">
        <el-input v-model="pageQuery.name" placeholder="商品名称" clearable />
      </el-form-item>
      <el-form-item label="商品状态">
        <el-select v-model="pageQuery.status" placeholder="商品状态" clearable>
          <el-option label="上架" :value="1" />
          <el-option label="下架" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage()">查询</el-button>
        <el-button @click="clearSearchInfo()">清空</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-4">
      <el-button type="primary" @click="router.push('/product/prod_info')">发布商品</el-button>
    </div>

    <el-table v-loading="pageLoading" :data="pageVO.list" border style="width: 100%">
      <el-table-column prop="spuId" label="商品ID" align="center" width="100" />
      <el-table-column label="商品信息" align="center" width="300">
        <template #default="{ row }">
          <div class="product-info">
            <el-image :src="getImgSrc(row.mainImgUrl)" fit="cover" class="product-image" />
            <div class="product-detail">
              <div class="product-name">{{ row.name }}</div>
              <div class="product-price">￥{{ (row.priceFee / 100).toFixed(2) }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="seq" label="排序" align="center" width="80" />
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="router.push(`/product/prod_info?spuId=${row.spuId}`)">编辑</el-button>
          <el-button type="danger" link @click="deleteHandle(row.spuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="pageVO.total > 0"
      :total="pageVO.total"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      @pagination="getPage()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { productApi } from '@/api/modules/product'
import Pagination from '@/components/Pagination/index.vue'

const router = useRouter()

interface PageVO {
  list: any[]
  total: number
  pages: number
}

const pageQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
  status: null as number | null,
})

const pageVO = reactive<PageVO>({
  list: [],
  total: 0,
  pages: 0,
})

const pageLoading = ref(false)
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

function getImgSrc(img: string) {
  if (!img) {
    return ''
  }
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img
  }
  return resourcesUrl + img
}

function getPage() {
  pageLoading.value = true
  const params = {
    ...pageQuery,
    name: pageQuery.name || undefined,
    status: pageQuery.status || undefined,
  }
  productApi.spu.page(params).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
    pageLoading.value = false
  })
}

function deleteHandle(spuId: number) {
  ElMessageBox.confirm('确定要删除该商品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    productApi.spu.delete(spuId).then(() => {
      ElMessage.success('删除成功')
      getPage()
    })
  })
}

function clearSearchInfo() {
  pageQuery.name = ''
  pageQuery.status = null
  getPage()
}

onMounted(() => {
  getPage()
})
</script>

<style scoped>
.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  flex-shrink: 0;
}

.product-detail {
  text-align: left;
}

.product-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  color: #ff4d4f;
  margin-top: 5px;
}
</style>
