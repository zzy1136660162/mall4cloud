<template>
  <el-dialog v-model="visible" title="订单发货" width="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="订单号">
        <el-input v-model="form.orderId" disabled />
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="orderInfo.consignee" disabled />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="orderInfo.mobile" disabled />
      </el-form-item>
      <el-form-item label="收货地址">
        <el-input v-model="orderInfo.addr" type="textarea" disabled />
      </el-form-item>
      <el-form-item label="物流公司" prop="deliveryCompanyId">
        <el-select v-model="form.deliveryCompanyId" placeholder="请选择物流公司" style="width: 100%">
          <el-option
            v-for="item in deliveryCompanyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" prop="deliveryNo">
        <el-input v-model="form.deliveryNo" placeholder="请输入物流单号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定发货</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { orderApi } from '@/api/modules/order'

const emit = defineEmits(['refresh'])

const visible = ref(false)
const formRef = ref()
const form = reactive({
  orderId: 0,
  deliveryCompanyId: '',
  deliveryNo: '',
})

const orderInfo = reactive({
  consignee: '',
  mobile: '',
  addr: '',
})

const deliveryCompanyList = ref([
  { id: 1, name: '顺丰速运' },
  { id: 2, name: '圆通速递' },
  { id: 3, name: '中通快递' },
  { id: 4, name: '韵达快递' },
  { id: 5, name: '申通快递' },
  { id: 6, name: '京东物流' },
  { id: 7, name: '邮政EMS' },
  { id: 8, name: '天天快递' },
])

const rules = {
  deliveryCompanyId: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
  deliveryNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
}

const init = async (order: any) => {
  form.orderId = order.orderId
  form.deliveryCompanyId = ''
  form.deliveryNo = ''

  try {
    const data: any = await orderApi.getOrderItemAndAddress(order.orderId)
    orderInfo.consignee = data.consignee || ''
    orderInfo.mobile = data.mobile || ''
    orderInfo.addr = data.addr || ''
  } catch (error) {
    console.error('获取订单信息失败', error)
  }

  visible.value = true
}

const submit = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return

    try {
      await orderApi.delivery({
        orderId: form.orderId,
        deliveryCompanyId: form.deliveryCompanyId,
        deliveryNo: form.deliveryNo,
      })
      ElMessage.success('发货成功')
      visible.value = false
      emit('refresh')
    } catch (error) {
      console.error('发货失败', error)
    }
  })
}

defineExpose({
  init,
})
</script>
