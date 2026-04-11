<template>
  <div class="selection-detail-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>申请详情</span>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="申请人">
          {{ detail.userName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ detail.contactPhone || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="邮寄地址" :span="2">
          {{ detail.deliveryAddress || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <el-descriptions :column="2" border title="商品信息">
        <el-descriptions-item label="商品名称">
          {{ detail.spuName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="商品价格">
          <span class="price-text">¥{{ detail.priceFee ? (detail.priceFee / 100).toFixed(2) : '0.00' }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="商品图片" :span="2">
          <el-image 
            v-if="detail.mainImgUrl" 
            :src="detail.mainImgUrl" 
            :preview-src-list="[detail.mainImgUrl]" 
            fit="cover"
            class="product-image"
          />
          <span v-else>-</span>
        </el-descriptions-item>
        <el-descriptions-item label="店铺名称">
          {{ detail.shopName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="商品ID">
          {{ detail.spuId || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <el-descriptions :column="2" border title="申请信息">
        <el-descriptions-item label="申请时间">
          {{ detail.applyTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="申请备注">
          {{ detail.applyRemark || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-divider />

      <el-descriptions :column="2" border title="审核信息">
        <el-descriptions-item label="审核状态">
          <el-tag :type="getStatusType(detail.auditStatus)">
            {{ detail.auditStatusText || '待审核' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="审核时间">
          {{ detail.auditTime || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="审核备注" :span="2">
          {{ detail.auditRemark || '-' }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 物流信息 -->
      <template v-if="detail.auditStatus === 2">
        <el-divider />
        <el-descriptions :column="2" border title="物流信息">
          <el-descriptions-item label="快递公司">
            {{ detail.expressCompany || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="快递单号">
            {{ detail.expressNo || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="发货时间">
            {{ detail.shipTime || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </template>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button 
          v-if="detail.auditStatus === 1" 
          type="primary" 
          @click="handleAudit"
        >
          审核
        </el-button>
        <el-button 
          v-if="detail.auditStatus === 2 && !detail.expressCompany" 
          type="success" 
          @click="handleShip"
        >
          填写物流
        </el-button>
        <el-button @click="handleBack">返回</el-button>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { selectionApi, type SelectionApplyVO } from '@/api/modules/selection'

const route = useRoute()
const router = useRouter()

// 详情数据
const detail = ref<Partial<SelectionApplyVO>>({})

// 审核对话框
const auditDialogVisible = ref(false)
const auditForm = reactive({
  auditStatus: 2,
  auditRemark: '',
})

// 物流对话框
const shipDialogVisible = ref(false)
const shipForm = reactive({
  expressCompany: '',
  expressNo: '',
})

// 获取状态类型
const getStatusType = (status?: number) => {
  if (!status) return 'info'
  const types: Record<number, string> = {
    1: 'warning',
    2: 'success',
    3: 'danger',
  }
  return types[status] || 'info'
}

// 加载详情
const loadDetail = async () => {
  const applyId = route.params.applyId
  if (!applyId) return
  
  try {
    const res = await selectionApi.get(Number(applyId))
    if (res.data) {
      detail.value = res.data
    }
  } catch (error) {
    console.error('加载详情失败:', error)
  }
}

// 审核
const handleAudit = () => {
  auditForm.auditStatus = 2
  auditForm.auditRemark = ''
  auditDialogVisible.value = true
}

// 提交审核
const submitAudit = async () => {
  const applyId = route.params.applyId
  if (!applyId) return
  
  try {
    await selectionApi.audit(Number(applyId), {
      auditStatus: auditForm.auditStatus,
      auditRemark: auditForm.auditRemark,
    })
    ElMessage.success('审核成功')
    auditDialogVisible.value = false
    loadDetail()
  } catch (error) {
    console.error('审核失败:', error)
  }
}

// 填写物流
const handleShip = () => {
  shipForm.expressCompany = ''
  shipForm.expressNo = ''
  shipDialogVisible.value = true
}

// 提交物流
const submitShip = async () => {
  if (!shipForm.expressCompany || !shipForm.expressNo) {
    ElMessage.warning('请填写完整的物流信息')
    return
  }
  
  const applyId = route.params.applyId
  if (!applyId) return
  
  try {
    await selectionApi.ship(
      Number(applyId),
      shipForm.expressCompany,
      shipForm.expressNo
    )
    ElMessage.success('物流信息已填写')
    shipDialogVisible.value = false
    loadDetail()
  } catch (error) {
    console.error('填写物流信息失败:', error)
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 页面加载
onMounted(() => {
  loadDetail()
})
</script>

<style scoped lang="scss">
.selection-detail-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-text {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.product-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.action-buttons {
  margin-top: 30px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style>
