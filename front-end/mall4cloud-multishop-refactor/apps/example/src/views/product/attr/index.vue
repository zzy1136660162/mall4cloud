<template>
  <div class="page-product-attr">
    <el-form :inline="true" :model="pageQuery" class="demo-form-inline">
      <el-form-item label="属性名称">
        <el-input v-model="pageQuery.name" placeholder="属性名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getPage()">查询</el-button>
        <el-button @click="clearSearchInfo()">清空</el-button>
      </el-form-item>
    </el-form>

    <div class="mb-4">
      <el-button type="primary" @click="addOrUpdateHandle()">新增属性</el-button>
    </div>

    <el-table v-loading="pageLoading" :data="pageVO.list" border style="width: 100%">
      <el-table-column prop="name" label="属性名称" align="center" />
      <el-table-column prop="attrType" label="属性类型" align="center" width="150">
        <template #default="{ row }">
          <span>{{ row.attrType === 1 ? '基本属性' : '销售属性' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="searchType" label="搜索类型" align="center" width="150">
        <template #default="{ row }">
          <el-tag :type="row.searchType === 1 ? 'warning' : 'info'">
            {{ row.searchType === 1 ? '必填属性' : '可选属性' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="属性值" align="center">
        <template #default="{ row }">
          <span v-if="row.attrValues && row.attrValues.length">
            {{ row.attrValues.map((v: any) => v.value).join('、') }}
          </span>
          <span v-else class="text-gray-400">无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="addOrUpdateHandle(row.attrId)">编辑</el-button>
          <el-button type="danger" link @click="deleteHandle(row.attrId)">删除</el-button>
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
      :title="dataForm.attrId ? '编辑属性' : '新增属性'"
      width="700px"
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="100px">
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="请输入属性名称" />
        </el-form-item>
        <el-form-item label="属性类型" prop="attrType">
          <el-radio-group v-model="dataForm.attrType">
            <el-radio :label="1">基本属性</el-radio>
            <el-radio :label="2">销售属性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="搜索类型" prop="searchType">
          <el-radio-group v-model="dataForm.searchType">
            <el-radio :label="0">可选属性</el-radio>
            <el-radio :label="1">必填属性</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性值">
          <div class="attr-values">
            <el-tag
              v-for="(item, index) in dataForm.attrValues"
              :key="index"
              closable
              @close="removeAttrValue(index)"
              class="mr-2 mb-2"
            >
              {{ item.value }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="InputRef"
              v-model="inputValue"
              size="small"
              class="input-new-attr"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
            />
            <el-button v-else size="small" @click="showInput">+ 添加属性值</el-button>
          </div>
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
import { ref, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { productApi } from '@/api/modules/product'
import Pagination from '@/components/Pagination/index.vue'

interface PageVO {
  list: any[]
  total: number
  pages: number
}

interface AttrValue {
  attrValueId?: number
  value: string
}

const pageQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  name: '',
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
  attrId: 0,
  name: '',
  attrType: 1,
  searchType: 0,
  attrValues: [] as AttrValue[],
})

const rules = {
  name: [{ required: true, message: '属性名称不能为空', trigger: 'blur' }],
}

const inputVisible = ref(false)
const inputValue = ref('')
const InputRef = ref()

const getPage = () => {
  pageLoading.value = true
  const params = {
    ...pageQuery,
    name: pageQuery.name || undefined,
  }
  productApi.attr.page(params).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
    pageLoading.value = false
  })
}

const addOrUpdateHandle = (attrId?: number) => {
  dataForm.attrId = attrId || 0
  if (attrId) {
    productApi.attr.get(attrId).then((res: any) => {
      Object.assign(dataForm, res)
    })
  } else {
    dataForm.name = ''
    dataForm.attrType = 1
    dataForm.searchType = 0
    dataForm.attrValues = []
  }
  addOrUpdateVisible.value = true
}

const deleteHandle = (attrId: number) => {
  ElMessageBox.confirm('确定要删除该属性吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    productApi.attr.delete(attrId).then(() => {
      ElMessage.success('删除成功')
      getPage()
    })
  })
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    dataForm.attrValues.push({ value: inputValue.value })
  }
  inputVisible.value = false
  inputValue.value = ''
}

const removeAttrValue = (index: number) => {
  dataForm.attrValues.splice(index, 1)
}

const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const submitData = {
        ...dataForm,
        attrValues: dataForm.attrValues.map((v, i) => ({
          ...v,
          attrValueId: v.attrValueId || i + 1,
        })),
      }
      const request = dataForm.attrId
        ? productApi.attr.update(submitData)
        : productApi.attr.save(submitData)
      request.then(() => {
        ElMessage.success('操作成功')
        addOrUpdateVisible.value = false
        getPage()
      })
    }
  })
}

const clearSearchInfo = () => {
  pageQuery.name = ''
  getPage()
}

getPage()
</script>

<style scoped>
.attr-values {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.input-new-attr {
  width: 100px;
}
</style>
