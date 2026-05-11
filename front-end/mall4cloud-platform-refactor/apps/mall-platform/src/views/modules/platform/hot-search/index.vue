<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="热门搜索管理"
      description="管理热门搜索关键词，支持新增、编辑、删除热搜词。"
      class="mb-0!"
    >
      <template #default>
        <el-button
          v-permission="['platform:hotSearch:save']"
          type="primary"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
      </template>
    </FaPageHeader>

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
                <el-form-item label="热搜标题">
                  <el-input
                    v-model="pageQuery.title"
                    placeholder="热搜标题"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="热搜内容">
                  <el-input
                    v-model="pageQuery.content"
                    placeholder="热搜内容"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="启用状态">
                  <el-select
                    v-model="pageQuery.status"
                    placeholder="启用状态"
                    clearable
                  >
                    <el-option
                      label="启用"
                      value="1"
                    />
                    <el-option
                      label="未启用"
                      value="0"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="getSearchList()"
                  >
                    筛选
                  </el-button>
                  <el-button @click="clearSearchInfo()">
                    清空
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
        <!-- 热搜标题 -->
        <el-table-column
          label="标题"
          prop="title"
          align="center"
        />
        <!-- 内容 -->
        <el-table-column
          label="内容"
          prop="content"
          align="center"
        />
        <!-- 创建时间 -->
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
        />
        <!-- 排序 -->
        <el-table-column
          label="排序"
          prop="seq"
          align="center"
        />
        <!-- 状态 -->
        <el-table-column
          label="状态"
          prop="status"
          align="center"
        >
          <template #default="{row}">
            <el-tag
              v-if="row.status === 0"
              type="danger"
            >
              未启用
            </el-tag>
            <el-tag v-else>
              启用
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="230"
          fixed="right"
        >
          <template #default="{row}">
            <el-button
              v-permission="['platform:hotSearch:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.hotSearchId)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['platform:hotSearch:delete']"
              type="primary"
              link
              @click="deleteHandle(row.hotSearchId)"
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

<script setup>

defineOptions({ name: 'HotSearch' })
import * as api from '@/api/platform/hot-search'
import { onMounted, reactive } from 'vue'
import AddOrUpdate from './components/add-or-update.vue'

const Data = reactive({
  // 查询的参数
  pageQuery: {
    pageSize: 10,
    pageNum: 1,
    title: null,
    content: null,
    status: null
  },
  // 返回参数
  pageVO: {
    list: [], // 返回的列表
    total: 0, // 一共多少条数据
    pages: 0 // 一共多少页
  },
  // loading
  pageLoading: true,
  // 查询参数
  searchParam: {
  },
  addOrUpdateVisible: false
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

const getSearchList = () => {
  Data.pageQuery.pageNum = 1
  // 若请求参数某项没值，则不传此参数
  Data.pageQuery.title = Data.pageQuery.title || null
  Data.pageQuery.content = Data.pageQuery.content || null
  Data.pageQuery.status = Data.pageQuery.status || null
  getPage()
}

const clearSearchInfo = () => {
  // 若请求参数某项没值，则不传此参数
  Data.pageQuery.title = null
  Data.pageQuery.content = null
  Data.pageQuery.status = null
}

const addOrUpdateRef = ref()
const addOrUpdateHandle = (hotSearchId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(hotSearchId)
  })
}

const deleteHandle = (hotSearchId) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => deleteById(hotSearchId))
}

const deleteById = (hotSearchId) => {
  api.deleteById(hotSearchId).then(() => {
    ElMessage({
      message: '操作成功',
      type: 'success',
      duration: 1500,
      onClose: () => getPage()
    })
  })
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
</style>
