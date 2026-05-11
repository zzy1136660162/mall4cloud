<template>
  <div class="page-hot-search">
    <el-form :inline="true" :model="pageQuery" class="demo-form-inline">
      <el-form-item label="热搜标题">
        <el-input v-model="pageQuery.title" placeholder="热搜标题" clearable />
      </el-form-item>
      <el-form-item label="热搜内容">
        <el-input v-model="pageQuery.content" placeholder="热搜内容" clearable />
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
      <el-table-column prop="title" label="热搜标题" align="center" />
      <el-table-column prop="content" label="热搜内容" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="seq" label="排序" align="center" width="80" />
      <el-table-column prop="status" label="状态" align="center" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'danger'">
            {{ row.status === 1 ? '启用' : '未启用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="addOrUpdateHandle(row.hotSearchId)">编辑</el-button>
          <el-button type="danger" link @click="deleteHandle(row.hotSearchId)">删除</el-button>
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
      :title="dataForm.hotSearchId ? '编辑' : '新增'"
      width="500px"
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="80px">
        <el-form-item label="热搜标题" prop="title">
          <el-input v-model="dataForm.title" placeholder="请输入热搜标题" />
        </el-form-item>
        <el-form-item label="热搜内容" prop="content">
          <el-input v-model="dataForm.content" placeholder="请输入热搜内容" />
        </el-form-item>
        <el-form-item label="排序" prop="seq">
          <el-input-number v-model="dataForm.seq" :min="0" :max="9999" controls-position="right" />
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
  title: '',
  content: '',
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
  hotSearchId: 0,
  title: '',
  content: '',
  seq: 0,
  status: 1,
})

const rules = {
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
}

const getPage = () => {
  pageLoading.value = true
  const params = {
    ...pageQuery,
    title: pageQuery.title || undefined,
    content: pageQuery.content || undefined,
    status: pageQuery.status || undefined,
  }
  shopApi.hotSearch.page(params).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
    pageLoading.value = false
  })
}

const addOrUpdateHandle = (hotSearchId?: number) => {
  dataForm.hotSearchId = hotSearchId || 0
  if (hotSearchId) {
    shopApi.hotSearch.get(hotSearchId).then((res: any) => {
      Object.assign(dataForm, res)
    })
  } else {
    dataForm.title = ''
    dataForm.content = ''
    dataForm.seq = 0
    dataForm.status = 1
  }
  addOrUpdateVisible.value = true
}

const deleteHandle = (hotSearchId: number) => {
  ElMessageBox.confirm('确定要删除该热搜吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    shopApi.hotSearch.delete(hotSearchId).then(() => {
      ElMessage.success('删除成功')
      getPage()
    })
  })
}

const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const request = dataForm.hotSearchId
        ? shopApi.hotSearch.update(dataForm)
        : shopApi.hotSearch.save(dataForm)
      request.then(() => {
        ElMessage.success('操作成功')
        addOrUpdateVisible.value = false
        getPage()
      })
    }
  })
}

const clearSearchInfo = () => {
  pageQuery.title = ''
  pageQuery.content = ''
  pageQuery.status = null
  getPage()
}

onMounted(() => {
  getPage()
})
</script>
