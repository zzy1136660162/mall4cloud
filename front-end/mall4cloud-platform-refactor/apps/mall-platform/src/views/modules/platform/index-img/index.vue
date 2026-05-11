<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="首页图片管理"
      description="管理首页展示图片，支持新增、编辑、删除首页图片。"
      class="mb-0!"
    >
      <template #default>
        <el-button
          v-permission="['multishop:indexImg:save']"
          type="primary"
          @click="addOrUpdateHandle()"
        >
          新增
        </el-button>
      </template>
    </FaPageHeader>

    <!-- 内容区 -->
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
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
        <!-- 图片 -->
        <el-table-column
          label="图片"
          prop="imgUrl"
          align="center"
          width="300"
        >
          <template #default="{row}">
            <div class="img-box">
              <img
                :src="(row.imgUrl).indexOf('http')===-1 ? resourcesUrl + row.imgUrl : row.imgUrl"
                class="img"
              >
            </div>
          </template>
        </el-table-column>
        <!-- 顺序 -->
        <el-table-column
          label="顺序"
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
              禁用
            </el-tag>
            <el-tag v-else>
              正常
            </el-tag>
          </template>
        </el-table-column>
        <!-- 平台 -->
        <el-table-column
          label="平台"
          prop="imgType"
          align="center"
        >
          <template #default="{row}">
            <span>{{ ['移动端', 'PC端'][row.imgType] }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
        >
          <template #default="{row}">
            <el-button
              v-permission="['multishop:indexImg:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.imgId)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['multishop:indexImg:delete']"
              type="primary"
              link
              @click="deleteHandle(row.imgId)"
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

defineOptions({ name: 'IndexImg' })
import * as api from '@/api/platform/index-img'
import { onMounted, reactive } from 'vue'
import AddOrUpdate from './components/add-or-update.vue'

const Data = reactive({
  resourcesUrl: import.meta.env.VITE_APP_RESOURCES_URL,
  // 查询的参数
  pageQuery: {
    pageSize: 10,
    pageNum: 1,
    name: null,
    attrType: null
  },
  // 返回参数
  pageVO: {
    list: [], // 返回的列表
    total: 0, // 一共多少条数据
    pages: 0 // 一共多少页
  },
  // loading
  pageLoading: true,
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
const addOrUpdateHandle = (imgId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(imgId)
  })
}

const deleteHandle = (imgId) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => deleteById(imgId))
}

const deleteById = (imgId) => {
  api.deleteById(imgId).then(() => {
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

.img-box {
  width: 60px;
  height: 60px;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
