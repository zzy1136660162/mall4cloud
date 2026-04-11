<template>
  <div class="selection-container">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="statistics-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ statistics.totalApplies || 0 }}</div>
          <div class="stat-label">总申请数</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card stat-card-warning">
          <div class="stat-value">{{ statistics.pendingApplies || 0 }}</div>
          <div class="stat-label">待审核</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card stat-card-success">
          <div class="stat-value">{{ statistics.approvedApplies || 0 }}</div>
          <div class="stat-label">已通过</div>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card shadow="hover" class="stat-card stat-card-danger">
          <div class="stat-value">{{ statistics.rejectedApplies || 0 }}</div>
          <div class="stat-label">已拒绝</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card stat-card-info">
          <div class="stat-value">{{ statistics.todayApplies || 0 }}</div>
          <div class="stat-label">今日新增</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选表单 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="审核状态">
          <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态" clearable>
            <el-option label="全部" :value="undefined" />
            <el-option label="待审核" :value="1" />
            <el-option label="已通过" :value="2" />
            <el-option label="已拒绝" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 申请列表 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="tableData">
        <el-table-column label="申请人" prop="userName" min-width="100" />
        <el-table-column label="联系电话" prop="contactPhone" width="130" />
        <el-table-column label="商品信息" min-width="250">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="row.mainImgUrl" class="product-image" fit="cover" />
              <div class="product-detail">
                <div class="product-name">{{ row.spuName }}</div>
                <div class="product-price">¥{{ (row.priceFee / 100).toFixed(2) }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="店铺" prop="shopName" width="120" />
        <el-table-column label="申请时间" prop="applyTime" width="160" />
        <el-table-column label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.auditStatus)">
              {{ row.auditStatusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleDetail(row)">查看</el-button>
            <el-button 
              v-if="row.auditStatus === 1" 
              type="success" 
              link 
              @click="handleAudit(row)"
            >
              审核
            </el-button>
            <el-button 
              v-if="row.auditStatus === 2 && !row.expressCompany" 
              type="warning" 
              link 
              @click="handleShip(row)"
            >
              填写物流
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 审核对话框 -->
    <el-dialog v-model="auditDialogVisible" title="审核申请" width="500px">
      <el-form :model="auditForm" label-width="100px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="auditForm.auditStatus">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input
            v-model="auditForm.auditRemark"
            type="textarea"
            :rows="3"
            placeholder="请输入审核备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAudit">提交</el-button>
      </template>
    </el-dialog>

    <!-- 物流对话框 -->
    <el-dialog v-model="shipDialogVisible" title="填写物流信息" width="500px">
      <el-form :model="shipForm" label-width="100px">
        <el-form-item label="快递公司" required>
          <el-input v-model="shipForm.expressCompany" placeholder="请输入快递公司" />
        </el-form-item>
        <el-form-item label="快递单号" required>
          <el-input v-model="shipForm.expressNo" placeholder="请输入快递单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="shipDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitShip">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { selectionApi, type SelectionApplyVO, type SelectionStatisticsVO } from '@/api/modules/selection'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 统计数据
const statistics = ref<SelectionStatisticsVO>({
  totalApplies: 0,
  pendingApplies: 0,
  approvedApplies: 0,
  rejectedApplies: 0,
  todayApplies: 0,
})

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  auditStatus: undefined as number | undefined,
  startTime: undefined as string | undefined,
  endTime: undefined as string | undefined,
})

// 日期范围
const dateRange = ref<[string, string] | null>(null)

// 表格数据
const tableData = ref<SelectionApplyVO[]>([])
const total = ref(0)

// 审核对话框
const auditDialogVisible = ref(false)
const auditForm = reactive({
  applyId: null as number | null,
  auditStatus: 2,
  auditRemark: '',
})

// 物流对话框
const shipDialogVisible = ref(false)
const shipForm = reactive({
  applyId: null as number | null,
  expressCompany: '',
  expressNo: '',
})

// 获取状态类型
const getStatusType = (status: number) => {
  const types: Record<number, string> = {
    1: 'warning',
    2: 'success',
    3: 'danger',
  }
  return types[status] || 'info'
}

// 加载统计数据
const loadStatistics = async () => {
  try {
    const res = await selectionApi.statistics()
    if (res.data) {
      statistics.value = res.data
    }
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 加载申请列表
const loadData = async () => {
  loading.value = true
  try {
    const res = await selectionApi.page(queryParams)
    if (res.data) {
      tableData.value = res.data.list || []
      total.value = res.data.total || 0
    }
  } catch (error) {
    console.error('加载申请列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 日期变更
const handleDateChange = (val: [string, string] | null) => {
  if (val) {
    queryParams.startTime = val[0]
    queryParams.endTime = val[1]
  } else {
    queryParams.startTime = undefined
    queryParams.endTime = undefined
  }
}

// 查询
const handleQuery = () => {
  queryParams.pageNum = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryParams.pageNum = 1
  queryParams.auditStatus = undefined
  queryParams.startTime = undefined
  queryParams.endTime = undefined
  dateRange.value = null
  loadData()
}

// 分页大小变更
const handleSizeChange = () => {
  queryParams.pageNum = 1
  loadData()
}

// 页码变更
const handlePageChange = () => {
  loadData()
}

// 查看详情
const handleDetail = (row: SelectionApplyVO) => {
  router.push(`/selection/detail/${row.applyId}`)
}

// 审核
const handleAudit = (row: SelectionApplyVO) => {
  auditForm.applyId = row.applyId
  auditForm.auditStatus = 2
  auditForm.auditRemark = ''
  auditDialogVisible.value = true
}

// 提交审核
const submitAudit = async () => {
  if (!auditForm.applyId) return
  
  try {
    await selectionApi.audit(auditForm.applyId, {
      auditStatus: auditForm.auditStatus,
      auditRemark: auditForm.auditRemark,
    })
    ElMessage.success('审核成功')
    auditDialogVisible.value = false
    loadData()
    loadStatistics()
  } catch (error) {
    console.error('审核失败:', error)
  }
}

// 填写物流
const handleShip = (row: SelectionApplyVO) => {
  shipForm.applyId = row.applyId
  shipForm.expressCompany = ''
  shipForm.expressNo = ''
  shipDialogVisible.value = true
}

// 提交物流
const submitShip = async () => {
  if (!shipForm.applyId || !shipForm.expressCompany || !shipForm.expressNo) {
    ElMessage.warning('请填写完整的物流信息')
    return
  }
  
  try {
    await selectionApi.ship(
      shipForm.applyId,
      shipForm.expressCompany,
      shipForm.expressNo
    )
    ElMessage.success('物流信息已填写')
    shipDialogVisible.value = false
    loadData()
  } catch (error) {
    console.error('填写物流信息失败:', error)
  }
}

// 页面加载
onMounted(() => {
  loadStatistics()
  loadData()
})
</script>

<style scoped lang="scss">
.selection-container {
  padding: 20px;
}

.statistics-row {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-2px);
  }

  .stat-value {
    font-size: 28px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 8px;
  }

  .stat-label {
    font-size: 14px;
    color: #909399;
  }
}

.stat-card-warning .stat-value {
  color: #e6a23c;
}

.stat-card-success .stat-value {
  color: #67c23a;
}

.stat-card-danger .stat-value {
  color: #f56c6c;
}

.stat-card-info .stat-value {
  color: #409eff;
}

.filter-card {
  margin-bottom: 20px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;

  .product-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .product-detail {
    flex: 1;
    overflow: hidden;

    .product-name {
      font-size: 14px;
      color: #303133;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-price {
      font-size: 14px;
      color: #f56c6c;
      font-weight: bold;
    }
  }
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
