<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="菜单权限管理"
      description="管理菜单权限信息，支持新增、编辑、删除权限。"
      class="mb-0!"
    >
      <template #default>
        <el-button
          v-permission="['rbac:menuPermission:save']"
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
        <!-- 菜单标题 -->
        <el-table-column
          label="菜单标题"
          prop="menuTitle"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.menuTitle }}</span>
          </template>
        </el-table-column>
        <!-- 权限名称 -->
        <el-table-column
          label="权限名称"
          prop="name"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <!-- 权限标识 -->
        <el-table-column
          label="权限标识"
          prop="permission"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.permission }}</span>
          </template>
        </el-table-column>
        <!-- 路径 -->
        <el-table-column
          label="路径"
          prop="uri"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.uri }}</span>
          </template>
        </el-table-column>
        <!-- 请求方式 -->
        <el-table-column
          label="请求方式"
          prop="method"
          align="center"
        >
          <template #default="{row}">
            <span>{{ ['', 'GET', 'POST', 'PUT', 'DELETE'][row.method] }}</span>
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
              v-permission="['rbac:menuPermission:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.menuPermissionId)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['rbac:menuPermission:delete']"
              type="primary"
              link
              @click="deleteHandle(row.menuPermissionId)"
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

defineOptions({ name: 'MenuPermission' })
import * as api from '@/api/rbac/menu-permission'
import { onMounted, reactive } from 'vue'
import AddOrUpdate from './components/add-or-update.vue'

const Data = reactive({
  // 查询的参数
  pageQuery: {
    pageSize: 10,
    pageNum: 1
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

const addOrUpdateRef = ref()
const addOrUpdateHandle = (menuPermissionId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(menuPermissionId)
  })
}

const deleteHandle = (menuPermissionId) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => deleteById(menuPermissionId))
}

const deleteById = (menuPermissionId) => {
  api.deleteById(menuPermissionId).then(() => {
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
