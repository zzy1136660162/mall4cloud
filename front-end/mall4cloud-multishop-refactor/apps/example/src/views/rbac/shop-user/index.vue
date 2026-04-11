<template>
  <div class="page-shop-user">
    <el-form :inline="true" :model="pageQuery" class="demo-form-inline">
      <el-form-item label="店铺ID">
        <el-input v-model="pageQuery.shopId" placeholder="店铺ID" clearable />
      </el-form-item>
      <el-form-item label="启用状态">
        <el-select v-model="pageQuery.status" placeholder="启用状态" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="未启用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage()">查询</el-button>
        <el-button @click="clearSearchInfo()">清空</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-4">
      <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
    </div>

    <el-table v-loading="pageLoading" :data="pageVO.list" border style="width: 100%">
      <el-table-column prop="shopUserId" label="用户ID" align="center" width="100" />
      <el-table-column prop="shopId" label="店铺ID" align="center" width="100" />
      <el-table-column prop="userId" label="用户ID" align="center" width="100" />
      <el-table-column prop="isAdmin" label="是否管理员" align="center" width="120">
        <template #default="{ row }">
          <el-tag :type="row.isAdmin === 1 ? 'success' : 'info'">
            {{ row.isAdmin === 1 ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '未启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="addOrUpdateHandle(row.shopUserId)">编辑</el-button>
          <el-button type="danger" link @click="deleteHandle(row.shopUserId)">删除</el-button>
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

    <el-dialog
      v-model="addOrUpdateVisible"
      :title="dataForm.shopUserId ? '编辑' : '新增'"
      width="500px"
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="80px">
        <el-form-item label="店铺ID" prop="shopId">
          <el-input-number v-model="dataForm.shopId" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input-number v-model="dataForm.userId" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否管理员" prop="isAdmin">
          <el-radio-group v-model="dataForm.isAdmin">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">下线</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { shopApi } from '@/api/modules/shop'
import Pagination from '@/components/Pagination/index.vue'

interface PageVO {
  list: any[]
  total: number
  pages: number
}

const pageQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  shopId: null as number | null,
  status: null as number | null,
})

const pageVO = reactive<PageVO>({
  list: [],
  total: 0,
  pages: 0,
})

const pageLoading = ref(false)
const addOrUpdateVisible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
  shopUserId: 0,
  shopId: 0,
  userId: 0,
  isAdmin: 0,
  status: 1,
})

const rules = {
  shopId: [{ required: true, message: '店铺ID不能为空', trigger: 'blur' }],
  userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
}

const getPage = () => {
  pageLoading.value = true
  const params = {
    ...pageQuery,
    shopId: pageQuery.shopId || undefined,
    status: pageQuery.status || undefined,
  }
  shopApi.shopUser.page(params).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
    pageLoading.value = false
  })
}

const addOrUpdateHandle = (shopUserId?: number) => {
  dataForm.shopUserId = shopUserId || 0
  if (shopUserId) {
    shopApi.shopUser.get(shopUserId).then((res: any) => {
      Object.assign(dataForm, res)
    })
  } else {
    dataForm.shopId = 0
    dataForm.userId = 0
    dataForm.isAdmin = 0
    dataForm.status = 1
  }
  addOrUpdateVisible.value = true
}

const deleteHandle = (shopUserId: number) => {
  ElMessageBox.confirm('确定要删除该店铺用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    shopApi.shopUser.delete(shopUserId).then(() => {
      ElMessage.success('删除成功')
      getPage()
    })
  })
}

const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const request = dataForm.shopUserId
        ? shopApi.shopUser.update(dataForm)
        : shopApi.shopUser.save(dataForm)
      request.then(() => {
        ElMessage.success('操作成功')
        addOrUpdateVisible.value = false
        getPage()
      })
    }
  })
}

const clearSearchInfo = () => {
  pageQuery.shopId = null
  pageQuery.status = null
  getPage()
}

onMounted(() => {
  getPage()
})
</script>
