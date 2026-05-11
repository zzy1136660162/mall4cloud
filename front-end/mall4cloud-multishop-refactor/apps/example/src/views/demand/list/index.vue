<template>
  <div class="page-demand-list">
    <div class="screening-conditions">
      <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item label="需求标题：">
          <el-input v-model="dataForm.title" placeholder="需求标题" clearable />
        </el-form-item>
        <el-form-item label="需求状态：">
          <el-select v-model="dataForm.status" clearable placeholder="请选择" @change="searchChange">
            <el-option label="待处理" :value="0" />
            <el-option label="确认中" :value="1" />
            <el-option label="研发中" :value="2" />
            <el-option label="样品制作" :value="3" />
            <el-option label="已完成" :value="4" />
            <el-option label="已取消" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchChange()">查询</el-button>
          <el-button @click="clear()">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main">
      <el-table :data="pageVO.list" style="width: 100%">
        <el-table-column prop="demandNo" label="需求编号" width="180" align="center" />
        <el-table-column prop="title" label="需求标题" min-width="200" align="center" show-overflow-tooltip />
        <el-table-column prop="submitterName" label="提交人" width="120" align="center">
          <template #default="{ row }">
            {{ row.submitterName || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="submitterPhone" label="联系电话" width="130" align="center">
          <template #default="{ row }">
            {{ row.submitterPhone || '未填写' }}
          </template>
        </el-table-column>
        <el-table-column prop="budgetRange" label="预算范围" width="120" align="center" />
        <el-table-column prop="statusText" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="160" align="center" />
        <el-table-column label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="openDetail(row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!pageVO.list.length" class="empty">暂无数据</div>
    </div>

    <Pagination
      v-if="pageVO.total > 0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getDataList()"
    />

    <el-dialog
      v-model="dialogVisible"
      title="需求详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <div v-if="detail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="需求编号">{{ detail.demandNo }}</el-descriptions-item>
          <el-descriptions-item label="需求状态">
            <el-tag :type="getStatusType(detail.status)">{{ detail.statusText }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="需求标题" :span="2">{{ detail.title }}</el-descriptions-item>
          <el-descriptions-item label="功能诉求" :span="2">
            <div style="white-space: pre-wrap;">{{ detail.functionalAppeal }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="目标人群">{{ detail.targetAudience }}</el-descriptions-item>
          <el-descriptions-item label="剂型偏好">{{ detail.dosageFormPreference || '-' }}</el-descriptions-item>
          <el-descriptions-item label="预算范围">{{ detail.budgetRange }}</el-descriptions-item>
          <el-descriptions-item label="期望交付时间">{{ detail.expectedDeliveryTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detail.remark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <el-descriptions :column="2" border title="提交人信息">
          <el-descriptions-item label="提交人">{{ detail.submitterName || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ detail.submitterPhone || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ detail.submitTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ detail.updateTime }}</el-descriptions-item>
        </el-descriptions>

        <template v-if="detail.adminRemark || detail.handlerName">
          <el-divider />
          <el-descriptions :column="2" border title="处理信息">
            <el-descriptions-item label="处理人">{{ detail.handlerName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="处理备注">{{ detail.adminRemark || '-' }}</el-descriptions-item>
          </el-descriptions>
        </template>

        <template v-if="canHandle">
          <el-divider />
          <el-form :model="handleForm" label-width="100px">
            <el-form-item label="处理状态：">
              <el-select v-model="handleForm.status" placeholder="请选择状态">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="处理人：">
              <el-input v-model="handleForm.handlerName" placeholder="请输入处理人姓名" />
            </el-form-item>
            <el-form-item label="处理备注：">
              <el-input v-model="handleForm.adminRemark" type="textarea" :rows="3" placeholder="请输入处理备注" />
            </el-form-item>
          </el-form>
        </template>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button v-if="canHandle" type="primary" @click="submitHandle">确认处理</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { demandApi } from '@/api/modules/demand'
import { ElMessage } from 'element-plus'
import Pagination from '@/components/Pagination/index.vue'

const dataForm = reactive({
  title: '',
  status: null as number | null,
})

const pageVO = reactive({
  list: [] as any[],
  total: 0,
  pages: 0,
})

const pageQuery = reactive({
  pageNum: 1,
  pageSize: 10,
})

const dialogVisible = ref(false)
const detail = ref<any>(null)

const handleForm = reactive({
  status: '' as number | '',
  handlerName: '',
  adminRemark: '',
})

const statusOptions = [
  { label: '待处理', value: 0 },
  { label: '确认中', value: 1 },
  { label: '研发中', value: 2 },
  { label: '样品制作', value: 3 },
  { label: '已完成', value: 4 },
  { label: '已取消', value: 5 },
]

const canHandle = computed(() => {
  if (!detail.value) return false
  return detail.value.status !== 4 && detail.value.status !== 5
})

const getDataList = () => {
  demandApi.page({
    ...pageQuery,
    title: dataForm.title || undefined,
    status: dataForm.status || undefined,
  }).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
  })
}

const searchChange = () => {
  pageQuery.pageNum = 1
  getDataList()
}

const clear = () => {
  dataForm.title = ''
  dataForm.status = null
  searchChange()
}

const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'warning',
    1: 'primary',
    2: 'info',
    3: 'success',
    4: 'success',
    5: 'info',
  }
  return typeMap[status] || ''
}

const openDetail = (id: number) => {
  demandApi.get(id).then((res: any) => {
    detail.value = res
    handleForm.status = res.status
    handleForm.handlerName = res.handlerName || ''
    handleForm.adminRemark = res.adminRemark || ''
    dialogVisible.value = true
  })
}

const submitHandle = () => {
  if (handleForm.status === '' || handleForm.status === null) {
    ElMessage.warning('请选择处理状态')
    return
  }
  if (!detail.value) return

  demandApi.handle({
    demandId: detail.value.id,
    status: handleForm.status,
    handlerName: handleForm.handlerName || undefined,
    adminRemark: handleForm.adminRemark || undefined,
  }).then(() => {
    ElMessage.success('处理成功')
    dialogVisible.value = false
    getDataList()
  })
}

onMounted(() => {
  getDataList()
})
</script>

<style lang="scss" scoped>
.page-demand-list {
  .screening-conditions {
    padding: 20px;
    background: #f8f8f9;
    margin-bottom: 20px;
  }

  .main {
    .empty {
      height: 200px;
      line-height: 200px;
      text-align: center;
      color: #aaa;
    }
  }

  .detail-content {
    padding: 10px;
  }
}
</style>
