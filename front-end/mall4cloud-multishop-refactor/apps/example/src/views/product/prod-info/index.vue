<template>
  <div class="page-prod-info">
    <div class="title">{{ dataForm.spuId ? '编辑商品信息' : '发布新商品' }}</div>

    <el-form ref="dataFormRef" :model="dataForm" :rules="rules" label-width="120px" class="part-form">
      <div class="info-box">
        <div class="part-content">
          <div class="part-tit">
            <span class="part-tit-num">1</span>
            <span class="part-tit-name">商品基本信息</span>
          </div>

          <el-form-item label="平台分类" required>
            <div class="classify-show">
              <div v-if="selectedCategorys.length > 0" class="category-tags">
                <span v-for="(name, index) in selectedCategorys" :key="index" class="category-tag">{{ name }}</span>
              </div>
              <el-button v-else size="small" @click="selectOrReviseCategory('platform')">
                选择分类
              </el-button>
            </div>
            <category-selector
              v-if="categorySelectorVisible"
              ref="categorySelectorRef"
              @get-category-selected="getCategorySelected"
            />
          </el-form-item>

          <el-form-item label="店铺分类" required>
            <div class="classify-show">
              <div v-if="selectedShopCategorys.length > 0" class="category-tags">
                <span v-for="(name, index) in selectedShopCategorys" :key="index" class="category-tag">{{ name }}</span>
              </div>
              <el-button v-else size="small" @click="selectOrReviseCategory('shop')">
                选择分类
              </el-button>
              <span v-if="!dataForm.categoryId || !dataForm.shopCategoryId" class="warning">请先选择分类再填写以下商品信息！</span>
            </div>
          </el-form-item>

          <el-form-item label="商品标题" prop="name">
            <el-input
              v-model.trim="dataForm.name"
              placeholder="商品标题组成：商品描述+属性"
              :disabled="!dataForm.categoryId"
              style="width: 90%"
            />
          </el-form-item>

          <el-form-item label="商品卖点" prop="sellingPoint">
            <el-input
              v-model.trim="dataForm.sellingPoint"
              type="textarea"
              placeholder="商品卖点"
              :disabled="!dataForm.categoryId"
              style="width: 90%"
            />
          </el-form-item>

          <el-form-item label="所属品牌">
            <div class="brand">
              <img v-if="brandImgUrl" :src="brandImgUrl" class="brand-img">
              <el-tag v-if="brandName" closable @close="handleCloseBrand">{{ brandName }}</el-tag>
              <el-button type="primary" link :class="['sel-brand', dataForm.categoryId ? '' : 'gray']" @click="brandSelectHandle">
                {{ brandName ? '修改' : '选择' }}品牌
              </el-button>
            </div>
            <brand-selector v-if="brandSelectVisible" ref="brandSelectRef" :is-single="true" @refresh-select-brand="selectBrand" />
          </el-form-item>

          <el-form-item label="商品排序">
            <el-input-number v-model="dataForm.seq" :min="1" :max="32767" />
          </el-form-item>

          <el-form-item label="商品主图" required>
            <img-upload v-model="dataForm.mainImgUrl" />
          </el-form-item>

          <el-form-item label="商品轮播图" required>
            <imgs-upload v-model="dataForm.imgUrls" :limit="9" />
            <div class="banner-tips">建议图片尺寸为 800*800，可拖动排序，最多上传9张</div>
          </el-form-item>
        </div>

        <div class="part-content">
          <div class="part-tit">
            <span class="part-tit-num">2</span>
            <span class="part-tit-name">商品销售属性与库存</span>
          </div>

          <div class="part-form-div">
            <div class="part-form-item-tit">销售属性</div>
            <div class="part-form-item">
              <div class="part-tips">最多添加两个商品属性，第一个商品属性可添加属性图片</div>
              <div class="sku-block-placeholder">SKU组件 - 待完整实现</div>
            </div>
          </div>

          <div class="part-form-div">
            <div class="part-form-item-tit">价格及库存</div>
            <div class="setup-spec">
              <div class="imp-tips">请如实填写库存信息，以确保商品可以在承诺发货时间内发出</div>
              <div class="sku-table-placeholder">SKU表格 - 待完整实现</div>
            </div>
          </div>

          <div class="part-form-div">
            <div class="part-form-item-tit">
              总库存
              <el-tooltip content="每个属性库存的总和" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
            <el-input v-model="dataForm.totalStock" readonly style="width: 150px" />
          </div>
        </div>

        <div class="part-content">
          <div class="part-tit">
            <span class="part-tit-num">3</span>
            <span class="part-tit-name">商品详情</span>
          </div>
          <div class="product-details">
            <el-input
              v-model="dataForm.detail"
              type="textarea"
              :rows="10"
              placeholder="请输入商品详情"
            />
          </div>
        </div>
      </div>

      <div class="foot-btn">
        <el-button type="primary" @click="changeFormatOfFormData">立即发布</el-button>
        <el-button @click="resetForm">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElIcon } from 'element-plus'
import { QuestionFilled } from '@element-plus/icons-vue'
import { productApi } from '@/api/modules/product'
import ImgUpload from '@/components/ImgUpload/index.vue'
import ImgsUpload from '@/components/ImgsUpload/index.vue'
import CategorySelector from '@/components/CategorySelector/index.vue'
import BrandSelector from '@/components/BrandSelector/index.vue'

const route = useRoute()
const router = useRouter()

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const dataFormRef = ref()
const categorySelectorRef = ref()
const brandSelectRef = ref()

const dataForm = reactive({
  spuId: route.query.spuId || null,
  categoryId: null as number | null,
  shopCategoryId: null as number | null,
  name: '',
  sellingPoint: '',
  brandId: 0,
  imgUrls: '',
  mainImgUrl: '',
  seq: null as number | null,
  detail: '',
  totalStock: 0,
  skuList: [] as any[],
})

const brandName = ref('')
const brandImgUrl = ref('')
const brandSelectVisible = ref(false)
const basicAttrs = ref<any[]>([])
const salesAttrs = ref<any[]>([])
const categorySelectorVisible = ref(false)
const selectedCategorys = ref<string[]>([])
const selectedShopCategorys = ref<string[]>([])
const showCategorySelectBtn = ref(true)
const showShopCategorySelectBtn = ref(true)
const flatten = ref<any[]>([])

const rules = {
  name: [{ required: true, message: '请输入商品标题', trigger: 'blur' }],
  sellingPoint: [{ required: true, message: '请输入商品卖点', trigger: 'blur' }],
}

const selectKey = ref('')

const getCategorySelected = (selected: string[], parentId: number) => {
  categorySelectorVisible.value = false
  if (selectKey.value === 'platform') {
    selectedCategorys.value = selected
    dataForm.categoryId = parentId
  } else {
    selectedShopCategorys.value = selected
    dataForm.shopCategoryId = parentId
  }
}

const selectOrReviseCategory = (key: string) => {
  selectKey.value = key
  categorySelectorVisible.value = true
  nextTick(() => {
    categorySelectorRef.value?.init(0, key)
  })
}

const brandSelectHandle = () => {
  if (!dataForm.categoryId) return
  brandSelectVisible.value = true
  nextTick(() => {
    brandSelectRef.value?.init([{ brandId: dataForm.brandId }], dataForm.categoryId as number)
  })
}

const selectBrand = (brands: any[]) => {
  if (brands && brands.length > 0) {
    brandImgUrl.value = brands[0].brandImgUrl
    dataForm.brandId = brands[0].brandId
    brandName.value = brands[0].brandName
  }
}

const handleCloseBrand = () => {
  brandImgUrl.value = ''
  brandName.value = ''
  dataForm.brandId = 0
}

const changeSkuGroupData = (data: any[]) => {
  salesAttrs.value = data
}

const handleChangeData = (data: any[]) => {
  let totalStock = 0
  data.forEach((sku: any) => {
    if (sku.stock) {
      totalStock += Number(sku.stock)
    }
  })
  dataForm.totalStock = totalStock
  flatten.value = data
}

const changeFormatOfFormData = () => {
  dataFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请先将必填信息填写完整！')
      return
    }

    if (!dataForm.mainImgUrl) {
      ElMessage.warning('请上传商品主图！')
      return
    }

    if (!dataForm.imgUrls) {
      ElMessage.warning('请上传商品轮播图！')
      return
    }

    const submitData = {
      ...dataForm,
      skuList: flatten.value,
    }

    const request = dataForm.spuId
      ? productApi.prodInfo.update(submitData)
      : productApi.prodInfo.save(submitData)

    request.then(() => {
      ElMessage.success('操作成功')
      router.push('/product/list')
    })
  })
}

const resetForm = () => {
  dataFormRef.value?.resetFields()
  brandName.value = ''
  brandImgUrl.value = ''
  dataForm.mainImgUrl = ''
  dataForm.imgUrls = ''
  dataForm.seq = null
  dataForm.detail = ''
  selectedShopCategorys.value = []
  if (!dataForm.spuId) {
    selectedCategorys.value = []
    dataForm.categoryId = null
    basicAttrs.value = []
  }
}

const init = async () => {
  const spuId = route.query.spuId
  if (!spuId) return

  try {
    const data: any = await productApi.prodInfo.get(spuId)
    Object.assign(dataForm, data)

    if (data.brand?.imgUrl) {
      brandImgUrl.value = data.brand.imgUrl.startsWith('http')
        ? data.brand.imgUrl
        : resourcesUrl + data.brand.imgUrl
    }
    brandName.value = data.brand?.name || ''
    showCategorySelectBtn.value = false
    showShopCategorySelectBtn.value = false
  } catch (error) {
    console.error('获取商品信息失败', error)
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
.page-prod-info {
  color: #606266;

  .star::before {
    content: "*";
    color: #ff4949;
    margin-right: 4px;
  }

  .title {
    padding: 0 20px;
    font-weight: bold;
    font-size: 16px;
    height: 50px;
    line-height: 50px;
  }

  .info-box {
    margin: 0 auto;
    border: 1px solid #eee;
    margin-bottom: 45px;

    .part-content {
      padding: 20px;

      .part-tit {
        margin-bottom: 20px;

        .part-tit-num {
          color: #02a1e9;
          font-size: 25px;
          font-style: italic;
        }

        .part-tit-name {
          font-size: 15px;
          margin: 0 10px;
        }
      }

      .brand {
        display: flex;
        align-items: center;

        .brand-img {
          width: auto;
          max-width: 60px;
          height: auto;
          max-height: 40px;
          margin-right: 6px;
        }
      }

      .warning {
        color: #e43130;
        margin-left: 10px;
      }

      .banner-tips {
        margin-top: 10px;
        font-size: 13px;
        color: #999;
      }

      .part-form-div {
        display: flex;
        align-items: top;
        font-size: 14px;
        margin-bottom: 22px;

        .part-form-item-tit {
          width: 120px;
          min-width: 120px;
          text-align: right;
          padding-right: 14px;
          line-height: 36px;
        }

        .part-tips {
          color: #999;
          font-size: 13px;
          line-height: 36px;
        }

        .part-form-item {
          width: 100%;

          .classify-show {
            line-height: 36px;
          }
        }

        .setup-spec {
          width: 100%;
          box-sizing: border-box;
          background: #fafafa;
          padding: 15px;

          .imp-tips {
            font-size: 13px;
            color: #ec6b01;
            margin-bottom: 5px;
          }
        }
      }
    }

    .part-content:not(:first-child) {
      border-top: 1px solid #eee;
    }
  }

  .foot-btn {
    position: fixed;
    bottom: 0;
    width: calc(100% - 270px);
    padding: 15px 0;
    display: flex;
    justify-content: center;
    background: #fff;
    box-shadow: 0 -2px 3px rgba(139, 139, 139, 0.1);
    z-index: 111;
  }
}

.category-tag {
  margin-right: 10px;
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 4px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sel-brand.gray {
  color: #bcbcbc;
}

.product-details {
  :deep(.el-textarea) {
    width: 90%;
  }
}
</style>
