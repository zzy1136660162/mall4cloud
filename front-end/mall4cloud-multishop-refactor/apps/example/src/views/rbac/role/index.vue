<template>
  <div class="page-role">
    <el-form :inline="true" :model="pageQuery" class="demo-form-inline">
      <el-form-item label="角色名称">
        <el-input v-model="pageQuery.roleName" placeholder="角色名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage()">查询</el-button>
        <el-button @click="clearSearchInfo()">清空</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-4">
      <el-button type="primary" @click="addOrUpdateHandle()">新增角色</el-button>
    </div>

    <el-table v-loading="pageLoading" :data="pageVO.list" border style="width: 100%">
      <el-table-column prop="roleId" label="角色ID" align="center" width="100" />
      <el-table-column prop="roleName" label="角色名称" align="center" />
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" align="center" width="280">
        <template #default="{ row }">
          <el-button type="primary" link @click="addOrUpdateHandle(row.roleId)">编辑</el-button>
          <el-button type="primary" link @click="handleMenuPerm(row.roleId)">分配权限</el-button>
          <el-button type="danger" link @click="deleteHandle(row.roleId)">删除</el-button>
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
      :title="dataForm.roleId ? '编辑角色' : '新增角色'"
      width="500px"
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dataForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dataForm.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addOrUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="menuPermVisible"
      title="分配权限"
      width="600px"
    >
      <div class="menu-perm-tree">
        <el-tree
          ref="menuTreeRef"
          :data="menuTree"
          :props="treeProps"
          node-key="menuId"
          show-checkbox
          :default-expand-all="true"
          check-strictly
        />
      </div>
      <template #footer>
        <el-button @click="menuPermVisible = false">取消</el-button>
        <el-button type="primary" @click="submitMenuPerm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { ElTree } from 'element-plus'
import { rbacApi } from '@/api/modules/rbac'
import Pagination from '@/components/Pagination/index.vue'

interface PageVO {
  list: any[]
  total: number
  pages: number
}

const pageQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  roleName: '',
})

const pageVO = reactive<PageVO>({
  list: [],
  total: 0,
  pages: 0,
})

const pageLoading = ref(false)
const addOrUpdateVisible = ref(false)
const menuPermVisible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
  roleId: 0,
  roleName: '',
  remark: '',
})

const rules = {
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
}

const menuTree = ref<any[]>([])
const treeProps = {
  children: 'children',
  label: 'name',
}
const currentRoleId = ref<number>(0)
const menuTreeRef = ref<InstanceType<typeof ElTree>>()

const getPage = () => {
  pageLoading.value = true
  const params = {
    ...pageQuery,
    roleName: pageQuery.roleName || undefined,
  }
  rbacApi.role.page(params).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
    pageLoading.value = false
  })
}

const addOrUpdateHandle = (roleId?: number) => {
  dataForm.roleId = roleId || 0
  if (roleId) {
    rbacApi.role.get(roleId).then((res: any) => {
      Object.assign(dataForm, res)
    })
  } else {
    dataForm.roleName = ''
    dataForm.remark = ''
  }
  addOrUpdateVisible.value = true
}

const deleteHandle = (roleId: number) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    rbacApi.role.delete(roleId).then(() => {
      ElMessage.success('删除成功')
      getPage()
    })
  })
}

const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const request = dataForm.roleId
        ? rbacApi.role.update(dataForm)
        : rbacApi.role.save(dataForm)
      request.then(() => {
        ElMessage.success('操作成功')
        addOrUpdateVisible.value = false
        getPage()
      })
    }
  })
}

const handleMenuPerm = (roleId: number) => {
  currentRoleId.value = roleId
  menuPermVisible.value = true

  Promise.all([
    rbacApi.menu.list(),
    rbacApi.menuPermission.getByRoleId(roleId),
  ]).then(([menuData, permData]: [any, any]) => {
    menuTree.value = menuData || []
    setTimeout(() => {
      if (permData && menuTreeRef.value) {
        const checkedKeys = permData.map((item: any) => item.menuId)
        menuTreeRef.value.setCheckedKeys(checkedKeys)
      }
    }, 100)
  })
}

const submitMenuPerm = () => {
  const checkedKeys = menuTreeRef.value?.getCheckedKeys() || []
  rbacApi.menuPermission.save({
    roleId: currentRoleId.value,
    menuIds: checkedKeys,
  }).then(() => {
    ElMessage.success('权限分配成功')
    menuPermVisible.value = false
  })
}

const clearSearchInfo = () => {
  pageQuery.roleName = ''
  getPage()
}

onMounted(() => {
  getPage()
})
</script>

<style scoped lang="scss">
.menu-perm-tree {
  max-height: 400px;
  overflow-y: auto;
}
</style>
