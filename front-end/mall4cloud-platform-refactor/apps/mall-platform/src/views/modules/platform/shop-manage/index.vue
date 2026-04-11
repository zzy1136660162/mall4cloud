<template>
  <div class="absolute-container">
    <!-- 页头 -->
    <FaPageHeader
      title="店铺管理"
      description="展示平台所有店铺信息，支持查看店铺详情、店铺账号管理。"
      class="mb-0!"
    />

    <!-- 内容区 -->
    <FaPageMain class="flex-1 overflow-auto" main-class="flex-1 flex flex-col overflow-auto">
      <!-- 搜索栏 -->
      <FaSearchBar>
        <template #default>
          <el-form
            :model="searchParam"
            size="default"
            class="w-full"
          >
            <el-row :gutter="16">
              <el-col :span="8">
                <el-form-item label="店铺名称">
                  <el-input
                    v-model="searchParam.shopName"
                    placeholder="请输入店铺名称"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="getPage()"
                  >
                    筛选
                  </el-button>
                  <el-button
                    v-permission="['multishop:indexImg:save']"
                    type="primary"
                    @click="addOrUpdateHandle()"
                  >
                    新增
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>


          </el-form>
        </template>
      </FaSearchBar>

      <!-- 表格 -->
      <div class="flex-1 overflow-hidden">
        <el-table
          v-loading="pageLoading"
          :data="pageVO.list"
          border
          stripe
          highlight-current-row
          style="width: 100%;"
        >
        <!-- 店铺名称 -->
        <el-table-column
          label="店铺名称"
          prop="shopName"
          align="center"
          min-width="150"
        />
        <!-- 店铺类型 1自营店 2普通店 -->
        <el-table-column
          label="店铺类型"
          prop="type"
          align="center"
          width="120"
        >
          <template #default="{row}">
            <el-tag
              v-if="row.type === 1"
              type="success"
            >
              自营店
            </el-tag>
            <el-tag
              v-if="row.type === 2"
            >
              普通店
            </el-tag>
          </template>
        </el-table-column>
        <!-- 店铺logo -->
        <el-table-column
          label="店铺logo"
          prop="shopLogo"
          align="center"
          width="120"
        >
          <template #default="{row}">
            <img-show
              :src="row.shopLogo"
              class="w-12 h-12 rounded"
            />
          </template>
        </el-table-column>
        <!-- 店铺简介 -->
        <el-table-column
          label="店铺简介"
          prop="intro"
          align="center"
          min-width="200"
          show-overflow-tooltip
        />
        <!-- 申请时间 -->
        <el-table-column
          label="申请时间"
          prop="createTime"
          align="center"
          width="180"
        />
        <!-- 店铺状态 -1:未开通 0:停业中 1:营业中 -->
        <el-table-column
          label="店铺状态"
          prop="shopStatus"
          align="center"
          width="100"
        >
          <template #default="{row}">
            <el-tag
              v-if="row.shopStatus === -1"
              type="danger"
            >
              未开通
            </el-tag>
            <el-tag
              v-else-if="row.shopStatus === 0"
              type="danger"
            >
              停业中
            </el-tag>
            <el-tag
              v-else-if="row.shopStatus === 1"
              type="success"
            >
              营业中
            </el-tag>
            <el-tag v-else>
              {{ row.shopStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column
          label="操作"
          align="center"
          width="200"
          fixed="right"
        >
          <template #default="{row}">
            <el-button
              v-permission="['multishop:indexImg:update']"
              type="primary"
              link
              @click="addOrUpdateHandle(row.shopId)"
            >
              查看
            </el-button>
            <el-button
              v-permission="['multishop:indexImg:update']"
              type="primary"
              link
              @click="accountManageHandle(row.shopId)"
            >
              账号管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>

      <!-- 分页 -->
      <div class="flex-none border-t px-5 py-3">
        <pagination
          v-model:page="pageQuery.pageNum"
          v-model:limit="pageQuery.pageSize"
          :total="pageVO.total"
          @pagination="getPage()"
        />
      </div>
    </FaPageMain>
  </div>

  <!-- 弹窗, 新增 / 修改 -->
  <add-or-update
    v-if="addOrUpdateVisible"
    ref="addOrUpdateRef"
    @refresh-data-list="getPage()"
  />
  <!-- 弹窗, 账号管理 -->
  <account-manage
    v-if="accountManageVisible"
    ref="accountManageRef"
    @refresh-data-list="getPage()"
  />
</template>

<script setup lang="ts">

defineOptions({ name: 'ShopManage' })
import * as api from '@/api/platform/shop'
import { onMounted, reactive } from 'vue'
import AddOrUpdate from './components/add-or-update.vue'
import accountManage from './components/account-manage.vue'

const Data = reactive({
  // 查询的参数
  pageQuery: {
    pageSize: 10,
    pageNum: 1
  },
  searchParam: {
    shopName: '',
    noticeMobile: ''
  },
  // 返回参数
  pageVO: {
    list: [],
    total: 0,
    pages: 0
  },
  // loading
  pageLoading: true,
  addOrUpdateVisible: false,
  accountManageVisible: false
})

const { pageQuery, searchParam, pageVO, pageLoading, addOrUpdateVisible, accountManageVisible } = toRefs(Data)

onMounted(() => {
  getPage()
})

const getPage = () => {
  Data.pageLoading = true
  api.managePage({ ...Data.pageQuery, ...Data.searchParam }).then(pageVO => {
    Data.pageVO = pageVO
    Data.pageLoading = false
  })
}

const addOrUpdateRef = ref()
// 查看
const addOrUpdateHandle = (shopId) => {
  Data.addOrUpdateVisible = true
  nextTick(() => {
    addOrUpdateRef.value.init(shopId)
  })
}

const accountManageRef = ref()
// 账号管理
const accountManageHandle = (shopId) => {
  Data.accountManageVisible = true
  nextTick(() => {
    accountManageRef.value.init(shopId)
  })
}

</script>

<style scoped>
.absolute-container {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
