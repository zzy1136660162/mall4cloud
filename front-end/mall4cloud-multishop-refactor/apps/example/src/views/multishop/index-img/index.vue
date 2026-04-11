<template>
  <div class="page-index-img">
    <el-form :inline="true" :model="pageQuery" class="demo-form-inline">
      <el-form-item label="图片类型">
        <el-select v-model="pageQuery.imgType" placeholder="图片类型" clearable>
          <el-option label="首页轮播图" :value="1" />
          <el-option label="首页分类图" :value="2" />
          <el-option label="首页品牌图" :value="3" />
        </el-select>
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
      <el-table-column prop="imgUrl" label="图片" align="center" width="150">
        <template #default="{ row }">
          <el-image
            v-if="row.imgUrl"
            :src="getImgSrc(row.imgUrl)"
            :preview-src-list="[getImgSrc(row.imgUrl)]"
            fit="cover"
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="imgType" label="图片类型" align="center" width="150">
        <template #default="{ row }">
          <span>{{ getImgTypeName(row.imgType) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seq" label="排序" align="center" width="80" />
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
          <el-button type="primary" link @click="addOrUpdateHandle(row.imgId)">编辑</el-button>
          <el-button type="danger" link @click="deleteHandle(row.imgId)">删除</el-button>
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
      :title="dataForm.imgId ? '编辑' : '新增'"
      width="600px"
    >
      <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="80px">
        <el-form-item label="图片" prop="imgUrl">
          <ImgUpload v-model="dataForm.imgUrl" />
        </el-form-item>
        <el-form-item label="图片类型" prop="imgType">
          <el-select v-model="dataForm.imgType" placeholder="请选择图片类型">
            <el-option label="首页轮播图" :value="1" />
            <el-option label="首页分类图" :value="2" />
            <el-option label="首页品牌图" :value="3" />
          </el-select>
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
import ImgUpload from '@/components/ImgUpload/index.vue'

interface PageVO {
  list: any[]
  total: number
  pages: number
}

const pageQuery = reactive({
  pageNum: 1,
  pageSize: 10,
  imgType: null as number | null,
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
  imgId: 0,
  imgUrl: '',
  imgType: 1,
  seq: 0,
  status: 1,
})

const rules = {
  imgUrl: [{ required: true, message: '请上传图片', trigger: 'change' }],
  imgType: [{ required: true, message: '请选择图片类型', trigger: 'change' }],
}

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const getImgSrc = (img: string) => {
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return resourcesUrl + img
}

const getImgTypeName = (imgType: number) => {
  const map: Record<number, string> = {
    1: '首页轮播图',
    2: '首页分类图',
    3: '首页品牌图',
  }
  return map[imgType] || '未知'
}

const getPage = () => {
  pageLoading.value = true
  const params = {
    ...pageQuery,
    imgType: pageQuery.imgType || undefined,
    status: pageQuery.status || undefined,
  }
  shopApi.indexImg.page(params).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
    pageLoading.value = false
  })
}

const addOrUpdateHandle = (imgId?: number) => {
  dataForm.imgId = imgId || 0
  if (imgId) {
    shopApi.indexImg.get(imgId).then((res: any) => {
      Object.assign(dataForm, res)
    })
  } else {
    dataForm.imgUrl = ''
    dataForm.imgType = 1
    dataForm.seq = 0
    dataForm.status = 1
  }
  addOrUpdateVisible.value = true
}

const deleteHandle = (imgId: number) => {
  ElMessageBox.confirm('确定要删除该图片吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    shopApi.indexImg.delete(imgId).then(() => {
      ElMessage.success('删除成功')
      getPage()
    })
  })
}

const dataFormSubmit = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      const request = dataForm.imgId
        ? shopApi.indexImg.update(dataForm)
        : shopApi.indexImg.save(dataForm)
      request.then(() => {
        ElMessage.success('操作成功')
        addOrUpdateVisible.value = false
        getPage()
      })
    }
  })
}

const clearSearchInfo = () => {
  pageQuery.imgType = null
  pageQuery.status = null
  getPage()
}

onMounted(() => {
  getPage()
})
</script>
