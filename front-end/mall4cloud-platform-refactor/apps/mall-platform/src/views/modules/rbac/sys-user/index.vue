<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="系统用户管理"
      description="管理系统用户信息，支持新增、编辑、删除用户。"
      class="mb-0!"
    >
      <template #default>
        <el-button
          v-permission="['multishop:shopUser:save']"
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
        <!-- 昵称 -->
        <el-table-column
          label="昵称"
          prop="nickName"
          align="center"
          width="250"
        >
          <template #default="{row}">
            <span>{{ row.nickName }}</span>
          </template>
        </el-table-column>
        <!-- 头像 -->
        <el-table-column
          label="头像"
          prop="avatar"
          align="center"
          width="100"
        >
          <template #default="{row}">
            <el-image
              :src="row.avatar"
              fit="contain"
            />
          </template>
        </el-table-column>
        <!-- 员工编号 -->
        <el-table-column
          label="编号"
          prop="code"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>
        <!-- 联系方式 -->
        <el-table-column
          label="手机号"
          prop="phoneNum"
          align="center"
        >
          <template #default="{row}">
            <span>{{ row.phoneNum }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="280"
          fixed="right"
        >
          <template #default="{row}">
            <el-button
              v-if="!row.hasAccount"
              v-permission="['account:authAccount:shopSave']"
              type="primary"
              link
              @click="addOrUpdateAccountHandle(row.sysUserId,row.hasAccount)"
            >
              设置账号
            </el-button>
            <el-button
              v-if="row.hasAccount"
              v-permission="['account:authAccount:shopUpdate']"
              type="primary"
              link
              @click="addOrUpdateAccountHandle(row.sysUserId,row.hasAccount)"
            >
              修改账号
            </el-button>
            <el-button
              v-permission="['platform:shopUser:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.sysUserId)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="['platform:shopUser:delete']"
              type="primary"
              link
              @click="deleteHandle(row.sysUserId)"
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
  <!-- 账户弹窗, 新增 / 修改 -->
  <account-add-or-update
    v-if="accountaddOrUpdateVisible"
    ref="accountAddOrUpdateRef"
    @refresh-data-list="getPage()"
  />
</template>

<script setup>

defineOptions({ name: 'SysUser' })
import * as api from '@/api/platform/sys-user'
import { onMounted, reactive } from 'vue'
import AddOrUpdate from './components/add-or-update.vue'
import AccountAddOrUpdate from './components/account-add-or-update.vue'

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
  addOrUpdateVisible: false,
  accountaddOrUpdateVisible: false
})
const { pageQuery, pageVO, pageLoading, addOrUpdateVisible, accountaddOrUpdateVisible } = toRefs(Data)

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
const addOrUpdateHandle = (sysUserId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(sysUserId)
  })
}

const accountAddOrUpdateRef = ref()
const addOrUpdateAccountHandle = (sysUserId, hasAccount) => {
  Data.accountaddOrUpdateVisible = true
  nextTick(() => {
    accountAddOrUpdateRef.value.init(sysUserId, hasAccount)
  })
}

const deleteHandle = (sysUserId) => {
  ElMessageBox.confirm('确定删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => deleteById(sysUserId))
}

const deleteById = (sysUserId) => {
  api.deleteById(sysUserId).then(() => {
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
