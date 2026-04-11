<template>
  <div class="page-product-category">
    <el-form :inline="true" class="mb-4">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增分类</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="categoryList"
      row-key="categoryId"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      border
      style="width: 100%"
    >
      <el-table-column prop="name" label="分类名称" width="200" />
      <el-table-column prop="seq" label="排序" width="100" align="center" />
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column label="操作" align="center" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="addOrUpdateHandle(row.categoryId)">编辑</el-button>
          <el-button type="primary" link @click="addChildHandle(row.categoryId)">添加子分类</el-button>
          <el-button type="danger" link @click="deleteHandle(row.categoryId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="addOrUpdateVisible"
      :title="dataForm.categoryId ? '编辑分类' : '新增分类'"
      width="500px"
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="100px">
        <el-form-item label="上级分类" v-if="dataForm.parentId">
          <el-input v-model="parentCategoryName" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="dataForm.seq" :min="0" :max="9999" controls-position="right" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label="0">禁用</el-radio>
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { productApi } from '@/api/modules/product'

const loading = ref(false)
const categoryList = ref<any[]>([])
const addOrUpdateVisible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
  categoryId: 0,
  parentId: 0,
  name: '',
  seq: 0,
  status: 1,
})

const rules = {
  name: [{ required: true, message: '分类名称不能为空', trigger: 'blur' }],
}

const parentCategoryName = computed(() => {
  const findCategory = (list: any[], id: number): string => {
    for (const item of list) {
      if (item.categoryId === id) return item.name
      if (item.children) {
        const found = findCategory(item.children, id)
        if (found) return found
      }
    }
    return ''
  }
  return findCategory(categoryList.value, dataForm.parentId)
})

const loadData = () => {
  loading.value = true
  Promise.all([
    productApi.category.shopCategories(),
    productApi.category.platformCategories(),
  ]).then(([shopData, platformData]: [any, any]) => {
    categoryList.value = [...(shopData || []), ...(platformData || [])]
    loading.value = false
  })
}

const addOrUpdateHandle = (categoryId?: number, parentId?: number) => {
  dataForm.categoryId = categoryId || 0
  dataForm.parentId = parentId || 0
  if (categoryId) {
    productApi.category.get(categoryId).then((res: any) => {
      Object.assign(dataForm, res)
    })
  } else {
    dataForm.name = ''
    dataForm.seq = 0
    dataForm.status = 1
  }
  addOrUpdateVisible.value = true
}

const addChildHandle = (parentId: number) => {
  addOrUpdateHandle(undefined, parentId)
}

const handleStatusChange = (row: any) => {
  productApi.category.enableOrDisable({
    categoryId: row.categoryId,
    status: row.status,
  }).then(() => {
    ElMessage.success('状态更新成功')
  })
}

const deleteHandle = (categoryId: number) => {
  ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    productApi.category.delete(categoryId).then(() => {
      ElMessage.success('删除成功')
      loadData()
    })
  })
}

const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const request = dataForm.categoryId
        ? productApi.category.update(dataForm)
        : productApi.category.save(dataForm)
      request.then(() => {
        ElMessage.success('操作成功')
        addOrUpdateVisible.value = false
        loadData()
      })
    }
  })
}

loadData()
</script>
