<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="商品属性管理"
      description="管理商品属性信息，支持新增、编辑、删除属性。"
      class="mb-0!"
    />

    <!-- 内容区 -->
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <!-- 搜索栏 -->
      <FaSearchBar>
        <template #default>
          <el-form
            :model="pageQuery"
            size="default"
            class="w-full"
          >
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="属性名称">
                  <el-input
                    v-model="pageQuery.name"
                    placeholder="请输入属性名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="getPage()"
                  >
                    筛选
                  </el-button>
                  <el-button
                    v-permission="['product:attr:save']"
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
        <!-- 属性名称 -->
        <el-table-column
          label="属性名称"
          prop="name"
          align="center"
          min-width="150"
        />
        <!-- 搜索类型 0:不需要，1:需要 -->
        <el-table-column
          label="搜索类型"
          prop="searchType"
          align="center"
          width="120"
        >
          <template #default="{row}">
            <span>{{ row.searchType === 0 ? '否' : '是' }}</span>
          </template>
        </el-table-column>
        <!-- 属性类型 0:销售属性，1:基本属性 -->
        <el-table-column
          label="属性类型"
          prop="attrType"
          align="center"
          width="120"
        >
          <template #default="{row}">
            <span>{{ row.attrType === 0 ? '销售属性' : '基本属性' }}</span>
          </template>
        </el-table-column>
        <!-- 创建时间 -->
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
          width="180"
        />
        <!-- 更新时间 -->
        <el-table-column
          label="更新时间"
          prop="updateTime"
          align="center"
          width="180"
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
              v-permission="['product:attr:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.attrId)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['product:attr:delete']"
              type="primary"
              link
              @click="deleteHandle(row.attrId)"
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

defineOptions({ name: 'Attr' })
import * as api from '@/api/product/attr'
import { onMounted, reactive } from 'vue'
import AddOrUpdate from './components/add-or-update.vue'

const Data = reactive({
  // 查询的参数
  pageQuery: {
    pageSize: 10,
    pageNum: 1,
    name: undefined
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
  addOrUpdateVisible: false,
  options: [
    { value: '销售属性', label: 0 },
    { value: '基本属性', label: 1 }
  ]
})

const { pageQuery, pageVO, pageLoading, addOrUpdateVisible } = toRefs(Data)

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
const addOrUpdateHandle = (attrId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(attrId)
  })
}

const deleteHandle = (attrId) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => deleteById(attrId))
}

const deleteById = (attrId) => {
  api.deleteById(attrId).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
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
</style>
