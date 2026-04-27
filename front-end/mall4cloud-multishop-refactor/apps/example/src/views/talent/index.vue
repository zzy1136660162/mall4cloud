<script setup lang="ts">
import talentApi from '@/api/modules/talent'
import Pagination from '@/components/Pagination/index.vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageLoading = ref(false)
const pageQuery = reactive({
  limit: 10,
  page: 1,
  talentStatus: null,
})
const pageVO = reactive({
  list: [] as any[],
  total: 0,
})

onMounted(() => {
  getPage()
})

const getPage = () => {
  pageLoading.value = true
  talentApi.page(pageQuery).then((res: any) => {
    pageVO.list = res.list
    pageVO.total = res.total
    pageLoading.value = false
  }).catch(() => {
    pageLoading.value = false
  })
}

const handleAudit = (row: any, status: number) => {
  const statusText = status === 1 ? '通过' : '拒绝'
  ElMessageBox.confirm(`确定要${statusText}该达人申请吗？`, '提示').then(() => {
    talentApi.audit({
      userId: row.userId,
      status,
    }).then(() => {
      ElMessage.success('操作成功')
      getPage()
    })
  }).catch(() => {})
}
</script>

<template>
  <div class="page-talent">
    <div class="filter-container">
      <el-select v-model="pageQuery.talentStatus" placeholder="审核状态" clearable class="filter-item" @change="getPage">
        <el-option label="待审核" :value="0" />
        <el-option label="已通过" :value="1" />
        <el-option label="已拒绝" :value="2" />
      </el-select>
      <el-button class="filter-item" @click="getPage">搜索</el-button>
    </div>

    <el-table v-loading="pageLoading" :data="pageVO.list" border fit highlight-current-row style="width: 100%">
      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column label="真实姓名" prop="talentRealName" align="center" width="120" />
      <el-table-column label="手机号" prop="talentPhone" align="center" width="130" />
      <el-table-column label="地区" align="center" min-width="200">
        <template #default="{row}">
          {{ row.talentProvince }} {{ row.talentCity }} {{ row.talentArea }}
        </template>
      </el-table-column>
      <el-table-column label="申请理由" prop="talentApplyReason" align="center" show-overflow-tooltip />
      <el-table-column label="个人简介" prop="talentIntro" align="center" show-overflow-tooltip />
      <el-table-column label="申请时间" prop="talentApplyTime" align="center" width="180" />
      <el-table-column label="审核状态" align="center" width="100">
        <template #default="{row}">
          <el-tag v-if="row.talentStatus === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.talentStatus === 1" type="success">已通过</el-tag>
          <el-tag v-else-if="row.talentStatus === 2" type="danger">已拒绝</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template #default="{row}">
          <el-button v-if="row.talentStatus === 0" type="primary" link @click="handleAudit(row, 1)">通过</el-button>
          <el-button v-if="row.talentStatus === 0" type="danger" link @click="handleAudit(row, 2)">拒绝</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination v-show="pageVO.total > 0" v-model:page="pageQuery.page" v-model:limit="pageQuery.limit" :total="pageVO.total" @pagination="getPage" />
  </div>
</template>

<style scoped>
.page-talent {
  padding: 20px;
}
.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style>
