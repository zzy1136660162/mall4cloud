<template>
  <div class="page-order-list">
    <div class="screening-conditions">
      <el-form :inline="true" :model="dataForm" @keyup.enter="getDataList()">
        <el-form-item label="订单号：">
          <el-input v-model="dataForm.orderId" placeholder="订单号" clearable />
        </el-form-item>
        <el-form-item label="订单状态：">
          <el-select v-model="status" clearable placeholder="请选择" @change="orderStatus">
            <el-option label="待付款" :value="1" />
            <el-option label="待发货" :value="2" />
            <el-option label="待收货" :value="3" />
            <el-option label="已完成" :value="5" />
            <el-option label="已失败" :value="6" />
          </el-select>
        </el-form-item>
        <el-form-item label="收货人：">
          <el-input v-model="dataForm.consignee" placeholder="收货人" clearable />
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="dataForm.mobile" placeholder="联系电话" clearable />
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
          <el-button class="ml-10" @click="setDateRange(1)">今天</el-button>
          <el-button @click="setDateRange(2)">昨天</el-button>
          <el-button @click="setDateRange(3)">近7天</el-button>
          <el-button @click="setDateRange(4)">近30天</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchChange()">查询</el-button>
          <el-button @click="clear()">清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="main">
      <div class="status-nav clearfix">
        <ul class="nav-list clearfix">
          <li :class="['nav-item', sts == 0 ? 'selected' : '']" @click="selectNav(0)">全部</li>
          <li :class="['nav-item', sts == 1 ? 'selected' : '']" @click="selectNav(1)">待付款</li>
          <li :class="['nav-item', sts == 2 ? 'selected' : '']" @click="selectNav(2)">待发货</li>
          <li :class="['nav-item', sts == 3 ? 'selected' : '']" @click="selectNav(3)">待收货</li>
          <li :class="['nav-item', sts == 5 ? 'selected' : '']" @click="selectNav(5)">已完成</li>
          <li :class="['nav-item', sts == 6 ? 'selected' : '']" @click="selectNav(6)">已失败</li>
        </ul>
      </div>

      <div class="tit">
        <el-row style="width: 100%">
          <el-col :span="5">
            <span class="item product">商品</span>
          </el-col>
          <el-col :span="5" class="transaction-price">
            <span class="item">单价/数量</span>
          </el-col>
          <el-col :span="3" class="column-title">
            <span class="item">实付金额</span>
          </el-col>
          <el-col :span="2" class="column-title">
            <span class="item">支付状态</span>
          </el-col>
          <el-col :span="3" class="column-title">
            <span class="item">买家信息</span>
          </el-col>
          <el-col :span="2" class="column-title">
            <span class="item">订单状态</span>
          </el-col>
          <el-col :span="2" class="column-title">
            <span class="item">操作</span>
          </el-col>
        </el-row>
      </div>

      <div v-for="order in pageVO.list" :key="order.orderId" class="prod">
        <div class="prod-tit">
          <span>订单号：{{ order.orderId }}</span>
          <span>创建时间：{{ order.createTime }}</span>
        </div>
        <div class="prod-cont">
          <el-row style="width: 100%">
            <el-col :span="10">
              <div class="prod-item">
                <div v-for="orderItem in order.orderItems" :key="orderItem.orderItemId" class="items name">
                  <div class="prod-image">
                    <img :src="orderItem.pic" alt="">
                  </div>
                  <div class="prod-name">
                    <div class="prod-con">
                      <div class="prod-name-txt">{{ orderItem.spuName }}</div>
                      <div class="order-status">{{ getOrderStatusText(order, orderItem) }}</div>
                    </div>
                  </div>
                  <div class="prod-price">
                    <span>￥{{ (orderItem.price / 100).toFixed(2) }}</span>
                    <span>{{ orderItem.count }}件</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="3" style="height: 100%">
              <div class="item">
                <div>
                  <span class="totalprice">￥{{ (order.total / 100).toFixed(2) }}</span>
                  <br>
                  <span>共{{ order.allCount }}件</span>
                </div>
              </div>
            </el-col>
            <el-col :span="2" style="height: 100%">
              <div class="item">
                <div>{{ order.isPayed ? '已支付' : '未支付' }}</div>
              </div>
            </el-col>
            <el-col :span="3" style="height: 100%">
              <div class="item">
                <div class="buyer-info">
                  <div class="buyer-name">{{ order.consignee || '' }}</div>
                  <div class="buyer-phone">{{ order.mobile || '' }}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="2" style="height: 100%">
              <div class="item">
                <span :class="getStatusClass(order.status)">{{ getStatusText(order.status) }}</span>
              </div>
            </el-col>
            <el-col :span="2" style="height: 100%">
              <div class="item">
                <div class="operate">
                  <el-button type="primary" link @click="router.push(`/order/detail/${order.orderId}`)">查看详情</el-button>
                  <el-button v-if="order.status === 2 && order.deliveryType !== 2" type="primary" link @click="openDelivery(order)">发货</el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div v-if="!pageVO.list.length" class="empty">暂无数据</div>
    </div>

    <Pagination
      v-if="pageVO.total > 0"
      v-model:page="pageQuery.pageNum"
      v-model:limit="pageQuery.pageSize"
      :total="pageVO.total"
      @pagination="getDataList()"
    />

    <order-delivery-update v-if="devyVisible" ref="orderDeliveryUpdateRef" @refresh="getDataList" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from '@/utils/dayjs'
import { orderApi } from '@/api/modules/order'
import Pagination from '@/components/Pagination/index.vue'
import OrderDeliveryUpdate from '../components/delivery-update.vue'

const router = useRouter()

const dataForm = reactive({
  orderId: '',
  consignee: '',
  mobile: '',
})

const status = ref<number | null>(null)
const sts = ref(0)
const dateRange = ref<string[]>([])
const pageVO = reactive({
  list: [] as any[],
  total: 0,
  pages: 0,
})
const pageQuery = reactive({
  pageNum: 1,
  pageSize: 10,
})
const devyVisible = ref(false)
const orderDeliveryUpdateRef = ref()

const getDataList = () => {
  orderApi.page({
    ...pageQuery,
    orderId: dataForm.orderId || undefined,
    consignee: dataForm.consignee || undefined,
    mobile: dataForm.mobile || undefined,
    status: status.value || undefined,
    startTime: dateRange.value?.[0] || undefined,
    endTime: dateRange.value?.[1] || undefined,
  }).then((res: any) => {
    pageVO.list = res.list || []
    pageVO.total = res.total || 0
    sts.value = status.value || 0
  })
}

const selectNav = (type: number) => {
  sts.value = type
  status.value = type === 0 ? null : type
  pageQuery.pageNum = 1
  getDataList()
}

const orderStatus = (val: number | null) => {
  status.value = val
}

const setDateRange = (val: number) => {
  let startDay = 0
  let endDay = 0
  switch (val) {
    case 1:
      startDay = 0
      endDay = 0
      break
    case 2:
      startDay = -1
      endDay = -1
      break
    case 3:
      startDay = -7
      endDay = -1
      break
    case 4:
      startDay = -30
      endDay = -1
      break
    default:
      return
  }
  const startTime = dayjs().add(startDay, 'days').startOf('days').format('YYYY-MM-DD HH:mm:ss')
  const endTime = dayjs().add(endDay, 'days').endOf('days').format('YYYY-MM-DD HH:mm:ss')
  dateRange.value = [startTime, endTime]
}

const searchChange = () => {
  pageQuery.pageNum = 1
  getDataList()
}

const clear = () => {
  dataForm.orderId = ''
  dataForm.consignee = ''
  dataForm.mobile = ''
  dateRange.value = []
  status.value = null
}

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

const getStatusClass = (status: number) => {
  const map: Record<number, string> = {
    1: 'status-warning',
    2: 'status-danger',
    3: 'status-info',
    5: 'status-success',
    6: 'status-gray',
  }
  return map[status] || ''
}

const getOrderStatusText = (order: any, orderItem: any) => {
  if (!orderItem.returnMoneySts || orderItem.returnMoneySts < 0 || orderItem.returnMoneySts > 5) {
    if (orderItem.status === 0 && order.status === 2) {
      return '待收货'
    }
    const statusMap: Record<number, string> = {
      1: '待付款',
      2: '待发货',
      3: '待收货',
      5: '已完成',
      6: '已失败',
    }
    return statusMap[order.status] || ''
  }
  return ''
}

const openDelivery = (order: any) => {
  devyVisible.value = true
  setTimeout(() => {
    orderDeliveryUpdateRef.value?.init(order)
  }, 0)
}

onMounted(() => {
  getDataList()
})
</script>

<style lang="scss" scoped>
.page-order-list {
  .screening-conditions {
    padding: 20px;
    background: #f8f8f9;
    margin-bottom: 20px;
  }

  .main {
    font-size: 14px;

    .status-nav {
      margin-bottom: 15px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ddd;

      .nav-list {
        display: flex;

        .nav-item {
          padding: 0 20px;
          background: #f8f8f9;
          border: 1px solid #ddd;
          cursor: pointer;
          margin-right: -1px;

          &.selected {
            background: #fff;
            border-bottom: 1px solid #fff;
          }
        }
      }
    }

    .tit {
      margin-bottom: 15px;
      background: #f8f8f9;
      padding: 10px 0;

      .column-title {
        text-align: center;
      }

      .transaction-price {
        text-align: right;
      }
    }

    .prod {
      margin-bottom: 15px;

      .prod-tit {
        padding: 10px;
        background: #f8f8f9;
        border: 1px solid #dddee1;

        span {
          margin-right: 15px;
        }
      }

      .prod-cont {
        border-top: 1px solid #dddee1;
        border-bottom: 1px solid #dddee1;
        border-left: 1px solid #dddee1;
        border-right: 1px solid #dddee1;

        .item {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          border-right: 1px solid #dddee1;
          min-height: 80px;
        }

        .prod-item {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #dddee1;

          .items {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #dddee1;

            &:last-child {
              border-bottom: none;
            }
          }
        }

        .prod-image {
          width: 80px;
          height: 80px;
          margin-right: 20px;
          flex-shrink: 0;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .prod-name {
          flex: 1;
          text-align: left;

          .prod-name-txt {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }

        .prod-price {
          text-align: center;
          margin-left: 10px;

          span {
            display: block;

            &:first-child {
              margin-bottom: 10px;
            }
          }
        }

        .totalprice {
          color: #c00;
        }

        .buyer-info {
          text-align: left;

          .buyer-name {
            margin-bottom: 5px;
          }

          .buyer-phone {
            color: #999;
          }
        }

        .operate {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
      }
    }

    .empty {
      height: 200px;
      line-height: 200px;
      text-align: center;
      color: #aaa;
    }
  }

  .status-warning {
    color: #e6a23c;
  }

  .status-danger {
    color: #f56c6c;
  }

  .status-info {
    color: #409eff;
  }

  .status-success {
    color: #67c23a;
  }

  .status-gray {
    color: #909399;
  }
}

.ml-10 {
  margin-left: 10px;
}
</style>
