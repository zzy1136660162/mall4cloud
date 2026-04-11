<template>
  <div class="page-order-detail">
    <el-page-header @back="router.back()" content="订单详情" />

    <el-card v-loading="loading" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>订单信息</span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ orderInfo.orderId }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(orderInfo.status)">{{ getStatusText(orderInfo.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="支付状态">{{ orderInfo.isPayed ? '已支付' : '未支付' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ orderInfo.createTime }}</el-descriptions-item>
        <el-descriptions-item label="商品总价">￥{{ (orderInfo.total / 100).toFixed(2) }}</el-descriptions-item>
        <el-descriptions-item label="商品数量">{{ orderInfo.allCount }}件</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-loading="loading" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>收货人信息</span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="收货人">{{ orderInfo.consignee }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ orderInfo.mobile }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ orderInfo.addr }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card v-loading="loading" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>商品信息</span>
        </div>
      </template>

      <el-table :data="orderInfo.orderItems" border style="width: 100%">
        <el-table-column label="商品" min-width="300">
          <template #default="{ row }">
            <div class="product-info">
              <el-image :src="row.pic" fit="cover" class="product-image" />
              <div class="product-detail">
                <div class="product-name">{{ row.spuName }}</div>
                <div class="product-sku">{{ row.skuName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="单价" width="150" align="center">
          <template #default="{ row }">
            ￥{{ (row.price / 100).toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="100" align="center" />
        <el-table-column label="小计" width="150" align="center">
          <template #default="{ row }">
            <span class="text-danger">￥{{ ((row.price * row.count) / 100).toFixed(2) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card v-if="orderInfo.deliveryType" v-loading="loading" class="mt-4">
      <template #header>
        <div class="card-header">
          <span>物流信息</span>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="物流公司">{{ orderInfo.deliveryCompanyName || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="物流单号">{{ orderInfo.deliveryNo || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orderApi } from '@/api/modules/order'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const orderInfo = reactive<any>({
  orderId: '',
  status: 0,
  isPayed: false,
  createTime: '',
  total: 0,
  allCount: 0,
  consignee: '',
  mobile: '',
  addr: '',
  orderItems: [] as any[],
  deliveryCompanyName: '',
  deliveryNo: '',
})

const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    1: '待付款',
    2: '待发货',
    3: '待收货',
    5: '已完成',
    6: '已失败',
  }
  return map[status] || '未知'
}

const getStatusType = (status: number) => {
  const map: Record<number, string> = {
    1: 'warning',
    2: 'danger',
    3: 'primary',
    5: 'success',
    6: 'info',
  }
  return map[status] || 'info'
}

const fetchOrderDetail = async () => {
  const orderId = route.params.id
  if (!orderId) return

  loading.value = true
  try {
    const data: any = await orderApi.orderInfo(Number(orderId))
    Object.assign(orderInfo, data)
  } catch (error) {
    console.error('获取订单详情失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped lang="scss">
.page-order-detail {
  padding: 20px;

  .mt-4 {
    margin-top: 20px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .product-info {
    display: flex;
    align-items: center;
  }

  .product-image {
    width: 60px;
    height: 60px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .product-detail {
    text-align: left;
  }

  .product-name {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }

  .product-sku {
    font-size: 12px;
    color: #999;
  }

  .text-danger {
    color: #ff4d4f;
    font-weight: bold;
  }
}
</style>
