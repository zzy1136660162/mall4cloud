<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="商品管理"
      description="管理商品信息，支持查看商品详情、编辑、删除商品。"
      class="mb-0!"
    >
      <template #default>
        <el-button
          type="primary"
          @click="toReleaseProdPage(-1)"
        >
          发布新商品
        </el-button>
      </template>
    </FaPageHeader>

    <!-- 内容区 -->
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <!-- 搜索栏 -->
      <FaSearchBar>
        <template #default>
          <el-form
            :model="dataForm"
            size="default"
            class="w-full"
          >
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="商品编码">
                  <el-input
                    v-model="dataForm.prodCode"
                    placeholder="请输入商品编码"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="商品名称">
                  <el-input
                    v-model="dataForm.prodName"
                    placeholder="请输入商品名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="平台分类">
                  <el-cascader
                    v-model="selectedMenu"
                    placeholder="请选择"
                    clearable
                    expand-trigger="hover"
                    :options="categoryList"
                    :props="categoryListTreeProps"
                    change-on-select
                    @change="handleSelectCategoryChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="累计销量">
                  <div class="range-box">
                    <el-input
                      v-model="dataForm.saleBeginInp"
                      type="number"
                      min="0"
                      max="100000"
                      placeholder="最小值"
                    />
                    <span class="interval-line">-</span>
                    <el-input
                      v-model="dataForm.saleEndInp"
                      type="number"
                      min="0"
                      max="100000"
                      placeholder="最大值"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="当前价">
                  <div class="range-box">
                    <el-input
                      v-model="dataForm.currentPriceBeginInp"
                      type="number"
                      min="0"
                      max="100000"
                      placeholder="最小值"
                    />
                    <span class="interval-line">-</span>
                    <el-input
                      v-model="dataForm.currentPriceEndInp"
                      type="number"
                      min="0"
                      max="100000"
                      placeholder="最大值"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="conditionSearch()"
                  >
                    筛选
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </FaSearchBar>

      <!-- 状态切换 -->
      <div class="border-b px-5 py-3">
        <el-radio-group
          v-model="prodStatusRadio"
          @change="switchProdList()"
        >
          <el-radio-button label="0">
            全部
          </el-radio-button>
          <el-radio-button label="1">
            在售中
          </el-radio-button>
          <el-radio-button label="2">
            已售罄
          </el-radio-button>
          <el-radio-button label="3">
            已下架
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 表格 -->
      <div class="flex-1 overflow-hidden">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          border
          stripe
          highlight-current-row
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          @sort-change="conditionSort"
        >
        <el-table-column
          type="selection"
          width="50"
        />
        <!-- 商品信息 -->
        <el-table-column
          label="商品信息"
          prop="name"
          align="center"
          min-width="200"
          show-overflow-tooltip
        />
        <!-- 商品图片 -->
        <el-table-column
          label="商品图片"
          prop="mainImgUrl"
          align="center"
          width="100"
        >
          <template #default="{row}">
            <img
              v-if="row.mainImgUrl"
              :src="resourcesUrl + row.mainImgUrl"
              class="w-10 h-10 rounded object-cover"
            >
          </template>
        </el-table-column>
        <!-- 当前价 -->
        <el-table-column
          label="当前价"
          prop="priceFee"
          align="center"
          width="120"
          sortable="custom"
        >
          <template #default="{row}">
            <span>¥{{ row.priceFee }}</span>
          </template>
        </el-table-column>
        <!-- 市场价 -->
        <el-table-column
          label="市场价"
          prop="marketPriceFee"
          align="center"
          width="120"
          sortable="custom"
        >
          <template #default="{row}">
            <span>¥{{ row.marketPriceFee }}</span>
          </template>
        </el-table-column>
        <!-- 累计销量 -->
        <el-table-column
          label="累计销量"
          prop="saleNum"
          align="center"
          width="100"
          sortable="custom"
        />
        <!-- 库存 -->
        <el-table-column
          label="库存"
          prop="totalStock"
          align="center"
          width="100"
          sortable="custom"
        />
        <!-- 序号 -->
        <el-table-column
          label="序号"
          prop="seq"
          align="center"
          width="80"
          sortable="custom"
        />
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="200"
          fixed="right"
        >
          <template #default="{row}">
            <el-button
              type="primary"
              link
              @click="toReleaseProdPage(row.spuId)"
            >
              查看详情
            </el-button>
            <span style="padding: 0 5px">|</span>
            <el-button
              type="primary"
              link
              @click="toReleaseProdPage(row.spuId, true)"
            >
              编辑
            </el-button>
            <span style="padding: 0 5px">|</span>
            <el-button
              v-if="row.status === 0"
              type="primary"
              link
              @click="prodSale(row.spuId)"
            >
              上架
            </el-button>
            <el-button
              v-else
              type="primary"
              link
              @click="prodNotSale(row.spuId)"
            >
              下架
            </el-button>
            <span style="padding: 0 5px">|</span>
            <el-button
              type="primary"
              link
              @click="prodDelete(row.spuId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>

      <!-- 分页 -->
      <div class="flex-none border-t px-5 py-3">
        <pagination
          v-model:page="pageQuery.pageNum"
          v-model:limit="pageQuery.pageSize"
          :total="pageVO.total"
          @pagination="getDataList()"
        />
      </div>
    </FaPageMain>
  </div>

  <!-- 商品详情弹窗 -->
  <prodDetails
    v-if="prodDetailsVisible"
    ref="prodDetailsRef"
    @refresh-data-list="getDataList()"
  />
</template>

<script setup lang="ts">

defineOptions({ name: 'ProductList' })
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { treeDataTranslate } from '@/utils'
import * as api from '@/api/product/list'
import * as categoryApi from '@/api/product/category'
import prodDetails from './components/prod-details.vue'

const router = useRouter()

const Data = reactive({
  resourcesUrl: import.meta.env.VITE_APP_RESOURCES_URL,
  dataForm: {},
  selectedMenu: [],
  categoryList: [],
  categoryListTreeProps: {
    value: 'categoryId',
    label: 'name'
  },
  prodStatusRadio: 0,
  currentMoveSpuId: '',
  // 多选
  checkAll: false,
  isIndeterminate: false,
  checkedCount: 0,
  selectedProdList: [],
  // 查询的参数
  searchParam: {
  },
  pageQuery: {
    pageSize: 10,
    pageNum: 1
  },
  // 返回参数
  pageVO: {
    list: [],
    total: 0,
    pages: 0
  },
  // loading
  pageLoading: true,
  prodDetailsVisible: false,
  spuId: null
})

const { dataForm, selectedMenu, categoryList, categoryListTreeProps, prodStatusRadio, pageQuery, pageVO, prodDetailsVisible } = toRefs(Data)

onMounted(() => {
  getDataList()
  getProdCategoryList()
})

// 条件搜索
const conditionSearch = () => {
  Data.pageQuery.pageNum = 1
  const minPrice = Data.dataForm.currentPriceBeginInp ? Data.dataForm.currentPriceBeginInp * 100 : undefined
  const maxPrice = Data.dataForm.currentPriceEndInp ? Data.dataForm.currentPriceEndInp * 100 : undefined
  Data.searchParam = {
    spuId: Data.dataForm.prodId || undefined,
    partyCode: Data.dataForm.prodCode || undefined,
    keyword: Data.dataForm.prodName || undefined,
    primaryCategoryId: Data.dataForm.primaryCategoryId || undefined,
    secondaryCategoryId: Data.dataForm.secondaryCategoryId || undefined,
    categoryId: Data.dataForm.categoryId || undefined,
    minSaleNum: Data.dataForm.saleBeginInp || undefined,
    maxSaleNum: Data.dataForm.saleEndInp || undefined,
    minPrice,
    maxPrice,
    isCompose: Data.dataForm.currentyuPreSaleStatus === '' ? undefined : Data.dataForm.currentyuPreSaleStatus,
    dataType: parseInt(Data.prodStatusRadio)
  }
  getDataList()
}

// 获取商品列表
const getDataList = () => {
  Data.pageLoading = true
  api.page({ ...Data.pageQuery, ...Data.searchParam }).then(pageVO => {
    Data.pageVO = pageVO
    Data.pageVO.list.forEach(item => {
      item.exhibitionProdName = item.name
      item.exhibitionSeq = item.seq
      item.priceFee = item.priceFee / 100
      item.marketPriceFee = item.marketPriceFee / 100
    })
    Data.pageLoading = false
  })
}

// 获取商品目录
const getProdCategoryList = () => {
  categoryApi.categoryPage({}).then(pageVO => {
    Data.categoryList = treeDataTranslate(pageVO, 'categoryId', 'parentId')
  })
}

// 监听分类选择的变化
const handleSelectCategoryChange = (val) => {
  Data.dataForm.primaryCategoryId = undefined
  Data.dataForm.secondaryCategoryId = undefined
  Data.dataForm.categoryId = undefined
  if (val.length === 1) {
    Data.dataForm.primaryCategoryId = val[0]
  }
  else if (val.length === 2) {
    Data.dataForm.secondaryCategoryId = val[1]
  }
  else if (val.length === 3) {
    Data.dataForm.categoryId = val[2]
  }
}

// 切换不同状态的商品展示
const switchProdList = () => {
  Data.checkAll = false
  Data.pageQuery.pageNum = 1
  Data.searchParam = {
    dataType: parseInt(Data.prodStatusRadio)
  }
  getDataList()
}

const prodDetailsRef = ref()
const toReleaseProdPage = (spuId, edit = false) => {
  if (edit) {
    // 编辑模式，跳转到 prod-info 页面
    router.push({ path: '/product/prod-info', query: { spuId } })
  } else {
    // 查看详情模式
    Data.prodDetailsVisible = true
    nextTick(() => {
      prodDetailsRef.value.init(spuId)
    })
  }
}

// 商品上架
const prodSale = (spuId) => {
  ElMessageBox.confirm('是否确认上架该商品？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.updateProdStatus({ spuId, status: 1 }).then(() => {
      ElMessage({
        message: '上架成功',
        type: 'success',
        duration: 1000,
        onClose: () => getDataList()
      })
    })
  }).catch(() => {})
}

// 商品下架
const prodNotSale = (spuId) => {
  ElMessageBox.confirm('是否确认下架该商品？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.updateProdStatus({ spuId, status: 0 }).then(() => {
      ElMessage({
        message: '下架成功',
        type: 'success',
        duration: 1000,
        onClose: () => getDataList()
      })
    })
  }).catch(() => {})
}

// 监听表格选中
const handleSelectionChange = (value) => {
  const checkedCount = value.length
  Data.checkedCount = checkedCount
  Data.checkAll = checkedCount === Data.pageVO.list.length
  Data.isIndeterminate = checkedCount > 0 && checkedCount < Data.pageVO.list.length
  const selectedProdList = []
  if (value.length > 0) {
    value.forEach(item => {
      selectedProdList.push(item.spuId)
    })
  }
  Data.selectedProdList = selectedProdList
}

// 条件排序
const conditionSort = (column) => {
  Data.pageQuery.pageNum = 1
  const orderMode = column.order === 'ascending' ? 1 : column.order === 'descending' ? 0 : undefined
  if (column.prop === 'priceFee') {
    Data.searchParam = { priceFeeSort: orderMode }
  }
  else if (column.prop === 'marketPriceFee') {
    Data.searchParam = { marketPriceFeeSort: orderMode }
  }
  else if (column.prop === 'saleNum') {
    Data.searchParam = { saleNumSort: orderMode }
  }
  else if (column.prop === 'totalStock') {
    Data.searchParam = { stockSort: orderMode }
  }
  else if (column.prop === 'seq') {
    Data.searchParam = { seqSort: orderMode }
  }
  else if (column.prop === 'createTime') {
    Data.searchParam = { createTimeSort: orderMode }
  }
  getDataList()
}

// 商品删除
const prodDelete = (spuId) => {
  ElMessageBox.confirm('是否确认删除该商品？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.deleteById(spuId).then(() => {
      ElMessage({
        message: '商品删除成功',
        type: 'success',
        duration: 1000,
        onClose: () => getDataList()
      })
    })
  }).catch(() => {})
}

</script>

<style lang="scss" scoped>
.absolute-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.range-box {
  display: flex;
  align-items: center;
  gap: 8px;

  :deep(.el-input) {
    width: 100px;
  }

  .interval-line {
    color: #999;
  }
}
</style>
