<template>
  <div class="page-product-list">
    <FaPageHeader title="商品列表" description="集中管理商品信息、上下架状态与选品标签">
      <el-button type="primary" @click="router.push('/product/prod_info')">
        <FaIcon name="i-ep:plus" />
        发布商品
      </el-button>
    </FaPageHeader>

    <FaPageMain main-class="p-0">
      <FaSearchBar background :show-toggle="false">
        <el-form :model="pageQuery" label-width="72px" @submit.prevent="getPage()">
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12" :lg="6">
              <el-form-item label="商品名称">
                <el-input
                  v-model.trim="pageQuery.name"
                  placeholder="请输入商品名称"
                  clearable
                  @keyup.enter="getPage()"
                >
                  <template #prefix>
                    <FaIcon name="i-ep:search" class="text-secondary-foreground/45" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <el-form-item label="商品状态">
                <el-select v-model="pageQuery.status" placeholder="全部状态" clearable class="w-full">
                  <el-option label="上架" :value="1" />
                  <el-option label="下架" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <el-form-item label="选品状态">
                <el-select v-model="pageQuery.isSelection" placeholder="全部状态" clearable class="w-full">
                  <el-option label="选品" :value="1" />
                  <el-option label="非选品" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="6">
              <el-form-item label="商品标签">
                <el-select v-model="pageQuery.tagType" placeholder="全部标签" clearable class="w-full">
                  <el-option label="热销" :value="1" />
                  <el-option label="新品" :value="2" />
                  <el-option label="精选" :value="3" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="search-actions">
            <el-button type="primary" native-type="submit" :loading="pageLoading">
              <FaIcon name="i-ep:search" />
              查询
            </el-button>
            <el-button @click="clearSearchInfo()">
              <FaIcon name="i-ep:refresh-left" />
              重置
            </el-button>
          </div>
        </el-form>
      </FaSearchBar>

      <div class="table-toolbar">
        <div>
          <div class="table-title">商品数据</div>
          <div class="table-summary">共 {{ pageVO.total }} 件商品</div>
        </div>
        <el-button text :loading="pageLoading" @click="getPage()">
          <FaIcon name="i-ep:refresh" />
          刷新
        </el-button>
      </div>

      <el-table v-loading="pageLoading" :data="pageVO.list" stripe class="product-table">
        <el-table-column prop="spuId" label="商品ID" align="center" width="96" />
        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="getImgSrc(row.mainImgUrl)" fit="cover" class="product-image">
                <template #error>
                  <div class="image-placeholder">
                    <FaIcon name="i-ep:picture" />
                  </div>
                </template>
              </el-image>
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
            <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="light" round>
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="选品信息" min-width="150">
          <template #default="{ row }">
            <div class="selection-info">
              <el-tag v-if="row.isSelection === 1" type="warning" size="small" effect="plain">选品</el-tag>
              <span v-else class="muted-text">非选品</span>
              <div v-if="row.commissionRate" class="commission">佣金 {{ row.commissionRate }}%</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品标签" min-width="150">
          <template #default="{ row }">
            <div class="product-tags">
              <el-tag v-if="row.isHot === 1" type="danger" size="small" effect="light">热销</el-tag>
              <el-tag v-if="row.isNew === 1" type="success" size="small" effect="light">新品</el-tag>
              <el-tag v-if="row.isSelectionBest === 1" type="warning" size="small" effect="light">精选</el-tag>
              <span v-if="row.isHot !== 1 && row.isNew !== 1 && row.isSelectionBest !== 1" class="muted-text">—</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="130">
          <template #default="{ row }">
            <div class="sales-info">
              <div>累计 {{ row.totalSales || 0 }}</div>
              <div class="text-gray">月销 {{ row.monthSales || 0 }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="156" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="router.push(`/product/prod_info?spuId=${row.spuId}`)">
              编辑
            </el-button>
            <el-button type="danger" link @click="deleteHandle(row.spuId)">
              删除
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无符合条件的商品" :image-size="96" />
        </template>
      </el-table>

      <div v-if="pageVO.total > 0" class="pagination-area">
        <Pagination
          :total="pageVO.total"
          v-model:page="pageQuery.pageNum"
          v-model:limit="pageQuery.pageSize"
          @pagination="getPage()"
        />
      </div>
    </FaPageMain>
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
  isSelection: null as number | null,
  tagType: null as number | null,
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
    isSelection: pageQuery.isSelection || undefined,
    tagType: pageQuery.tagType || undefined,
  }
  productApi.spu.page(params).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
  }).finally(() => {
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
  pageQuery.isSelection = null
  pageQuery.tagType = null
  getPage()
}

onMounted(() => {
  getPage()
})
</script>

<style lang="scss" scoped>
.page-product-list {
  min-width: 0;
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  padding: 12px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.table-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.table-summary {
  margin-top: 3px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.product-table {
  width: 100%;

  :deep(.el-table__cell) {
    padding: 10px 0;
  }

  :deep(th.el-table__cell) {
    font-weight: 600;
    color: var(--el-text-color-secondary);
    background: var(--el-fill-color-lighter);
  }
}

.product-info {
  display: flex;
  align-items: center;
  min-width: 0;
}

.product-image {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  margin-right: 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
}

.image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 20px;
  color: var(--el-text-color-placeholder);
}

.product-detail {
  min-width: 0;
  text-align: left;
}

.product-name {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  font-size: 14px;
  line-height: 1.55;
  color: var(--el-text-color-primary);
  -webkit-box-orient: vertical;
}

.product-price {
  margin-top: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--el-color-danger);
}

.selection-info {
  text-align: left;
}

.selection-info .commission {
  margin-top: 4px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.product-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sales-info {
  font-size: 13px;
  line-height: 1.7;
  text-align: left;
}

.sales-info .text-gray {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.muted-text {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
}

.pagination-area {
  padding: 4px 20px 18px;
  border-top: 1px solid var(--el-border-color-lighter);
}

@media (width <= 767px) {
  .search-actions {
    justify-content: flex-start;
  }

  .table-toolbar {
    padding-inline: 14px;
  }
}
</style>
