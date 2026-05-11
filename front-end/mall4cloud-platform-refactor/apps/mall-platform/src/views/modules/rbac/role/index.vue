<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="角色管理"
      description="管理角色信息，支持新增、编辑、删除角色。"
      class="mb-0!"
    >
      <template #default>
        <el-button
          v-permission="['rbac:role:save']"
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
        <!-- 创建时间 -->
        <el-table-column
          label="创建时间"
          prop="createTime"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <!-- 更新时间 -->
        <el-table-column
          label="更新时间"
          prop="updateTime"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <!-- 角色名称 -->
        <el-table-column
          label="角色名称"
          prop="roleName"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <!-- 备注 -->
        <el-table-column
          label="备注"
          prop="remark"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.remark }}</span>
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
              v-permission="['rbac:role:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.roleId)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['rbac:role:delete']"
              type="primary"
              link
              @click="deleteHandle(row.roleId)"
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

defineOptions({ name: 'Role' })
import * as api from '@/api/rbac/role'
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
const addOrUpdateHandle = (roleId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(roleId)
  })
}

const deleteHandle = (roleId) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => deleteById(roleId))
}

const deleteById = (roleId) => {
  api.deleteById(roleId).then(() => {
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
