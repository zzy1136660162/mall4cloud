<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="商品品牌管理"
      description="管理商品品牌信息，支持新增、编辑、上架/下架、删除品牌。"
      class="mb-0!"
    />

    <!-- 内容区 -->
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <!-- 搜索栏 -->
      <FaSearchBar>
        <template #default>
          <el-form
            size="default"
            class="w-full"
          >
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item>
                  <el-button
                    v-permission="['product:brand:save']"
                    type="primary"
                    @click="addOrUpdateHandle()"
                  >
                    新增
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </FaSearchBar>

      <!-- 表格 -->
      <div class="flex-1 overflow-hidden">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          border
          stripe
          highlight-current-row
          style="width: 100%;"
        >
        <!-- 品牌名称 -->
        <el-table-column
          label="品牌名称"
          prop="name"
          align="center"
          min-width="150"
        />
        <!-- 描述 -->
        <el-table-column
          label="描述"
          prop="desc"
          align="center"
          min-width="200"
          show-overflow-tooltip
        />
        <!-- 品牌图片 -->
        <el-table-column
          label="品牌图片"
          prop="imgUrl"
          align="center"
          width="150"
        >
          <template #default="{row}">
            <img
              :src="row.imgUrl?.indexOf('http') === -1 ? resourcesUrl + row.imgUrl : row.imgUrl"
              class="brand-logo-img"
            >
          </template>
        </el-table-column>
        <!-- 品牌首字母 -->
        <el-table-column
          label="品牌首字母"
          prop="firstLetter"
          align="center"
          width="120"
        />
        <!-- 排序 -->
        <el-table-column
          label="排序"
          prop="seq"
          align="center"
          width="100"
        />
        <!-- 状态 1:正常, 0:下线 -->
        <el-table-column
          label="状态"
          prop="status"
          align="center"
          width="100"
        >
          <template #default="{row}">
            <el-tag
              v-if="row.status === 0"
              type="danger"
            >
              下线
            </el-tag>
            <el-tag v-else>
              正常
            </el-tag>
          </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          width="180"
        />
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="230"
          fixed="right"
        >
          <template #default="{row}">
            <el-button
              v-permission="['product:brand:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.brandId)"
            >
              编辑
            </el-button>
            <el-button
              v-if="row.status === 0"
              type="primary"
              link
              @click="enableOrDisable(row.brandId, row.status)"
            >
              上架
            </el-button>
            <el-button
              v-if="row.status === 1"
              type="primary"
              link
              @click="enableOrDisable(row.brandId, row.status)"
            >
              下架
            </el-button>
            <el-button
              v-permission="['product:brand:delete']"
              type="primary"
              link
              @click="deleteHandle(row.brandId)"
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
          @pagination="getPage()"
        />
      </div>
    </FaPageMain>
  </div>

  <!-- 弹窗, 新增 / 修改 -->
  <add-or-update
    v-if="addOrUpdateVisible"
    ref="addOrUpdateRef"
    @refresh-data-list="getPage()"
  />
</template>

<script setup lang="ts">

defineOptions({ name: 'Brand' })
import * as api from '@/api/product/brand'
import { onMounted, reactive } from 'vue'
import AddOrUpdate from './components/add-or-update.vue'

const Data = reactive({
  resourcesUrl: import.meta.env.VITE_APP_RESOURCES_URL,
  // 查询的参数
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
  // 查询参数
  searchParam: {
  },
  addOrUpdateVisible: false
})

const { resourcesUrl, pageQuery, pageVO, pageLoading, addOrUpdateVisible } = toRefs(Data)

onMounted(() => {
  getPage()
})

const getPage = () => {
  Data.pageLoading = true
  api.page({ ...Data.pageQuery, ...Data.searchParam }).then(pageVO => {
    Data.pageVO = pageVO
    Data.pageLoading = false
  })
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (brandId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(brandId)
  })
}

const deleteHandle = (brandId) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => deleteById(brandId))
}

const deleteById = (brandId) => {
  api.deleteById(brandId).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
}

const enableOrDisable = (brandId, sts) => {
  const brandObj = { brandId, status: sts === 0 ? 1 : 0 }
  ElMessageBox.confirm(sts === 1 ? '是否确认下架当前品牌?' : '是否确认上架当前品牌?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.enableOrDisable(brandObj).then((data) => {
      ElMessage({
        message: data || '操作成功',
        type: data ? 'error' : 'success',
        duration: 1500,
        onClose: () => getPage()
      })
    })
  }).catch(() => {})
}

</script>

<style scoped>
.absolute-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.brand-logo-img {
  width: auto;
  height: auto;
  max-width: 80px;
  max-height: 60px;
}
</style>
