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

          <SkuSelector
            ref="skuSelectorRef"
            v-model="dataForm.skuList"
            :category-id="dataForm.categoryId"
            @change="handleSkuChange"
          />
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

        <div class="part-content">
          <div class="part-tit">
            <span class="part-tit-num">4</span>
            <span class="part-tit-name">选品设置</span>
          </div>

          <el-form-item label="是否选品">
            <el-switch
              v-model="dataForm.isSelection"
              :active-value="1"
              :inactive-value="0"
              active-text="是"
              inactive-text="否"
            />
            <div class="form-tip">开启后商品将在选品中心展示</div>
          </el-form-item>

          <el-form-item v-if="dataForm.isSelection === 1" label="佣金比例">
            <el-input-number
              v-model="dataForm.commissionRate"
              :min="0"
              :max="100"
              :precision="2"
              controls-position="right"
            />
            <span class="unit">%</span>
            <div class="form-tip">设置分销佣金比例，范围0-100%</div>
          </el-form-item>

          <el-form-item label="商品标签">
            <div class="tag-group">
              <el-checkbox v-model="dataForm.isHot" :true-label="1" :false-label="0">热销</el-checkbox>
              <el-checkbox v-model="dataForm.isNew" :true-label="1" :false-label="0">新品</el-checkbox>
              <el-checkbox v-model="dataForm.isRecommend" :true-label="1" :false-label="0">推荐</el-checkbox>
              <el-checkbox v-model="dataForm.isSelectionBest" :true-label="1" :false-label="0">精选</el-checkbox>
            </div>
          </el-form-item>

          <el-form-item label="推荐评分">
            <el-rate v-model="dataForm.rating" :max="5" show-text :texts="['极差', '失望', '一般', '满意', '惊喜']" />
            <div class="form-tip">0.0-5.0分，影响商品推荐权重</div>
          </el-form-item>

          <el-form-item label="销量设置">
            <div class="sales-inputs">
              <div class="input-item">
                <label>累计销量：</label>
                <el-input-number v-model="dataForm.totalSales" :min="0" :max="99999999" controls-position="right" />
              </div>
              <div class="input-item">
                <label>月销量：</label>
                <el-input-number v-model="dataForm.monthSales" :min="0" :max="99999999" controls-position="right" />
              </div>
            </div>
            <div class="form-tip">销量数据可在选品中心展示，手动设置可快速提升商品曝光</div>
          </el-form-item>
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
import { ElMessage } from 'element-plus'
import { productApi, type SkuVO } from '@/api/modules/product'
import ImgUpload from '@/components/ImgUpload/index.vue'
import ImgsUpload from '@/components/ImgsUpload/index.vue'
import CategorySelector from '@/components/CategorySelector/index.vue'
import BrandSelector from '@/components/BrandSelector/index.vue'
import SkuSelector from '@/components/SkuSelector/index.vue'

const route = useRoute()
const router = useRouter()

const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const dataFormRef = ref()
const categorySelectorRef = ref()
const brandSelectRef = ref()
const skuSelectorRef = ref()
const backTotalStock = ref(0)

const dataForm = reactive<any>({
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
  changeStock: 0,
  priceFee: 0,
  marketPriceFee: 0,
  spuAttrValues: [] as any[],
  skuList: [] as any[],
  isSelection: 0,
  commissionRate: 0,
  isHot: 0,
  isNew: 0,
  isRecommend: 0,
  isSelectionBest: 0,
  rating: 0,
  totalSales: 0,
  monthSales: 0,
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

const toYuan = (fee?: number | null) => {
  if (fee == null) {
    return 0
  }
  return Math.round(Number(fee)) / 100
}

const toCent = (amount?: number | null) => {
  if (amount == null) {
    return 0
  }
  return Math.round(Number(amount) * 100)
}

const normalizeSkuForEdit = (sku: SkuVO) => {
  const stock = Number(sku.stock || 0)
  return {
    ...sku,
    stock,
    originalStock: stock,
    changeStock: 0,
    marketPriceFee: toYuan(sku.marketPriceFee),
    priceFee: toYuan(sku.priceFee),
  }
}

const refreshSkuSummary = (skuList: SkuVO[]) => {
  let totalStock = 0
  const salePrices: number[] = []
  const marketPrices: number[] = []

  skuList.forEach((sku) => {
    totalStock += Number(sku.stock || 0)
    salePrices.push(Number(sku.priceFee || 0))
    marketPrices.push(Number(sku.marketPriceFee || 0))
  })

  dataForm.totalStock = totalStock
  dataForm.changeStock = dataForm.spuId ? Math.max(totalStock - backTotalStock.value, 0) : 0
  dataForm.priceFee = salePrices.length ? Math.min(...salePrices) : 0
  dataForm.marketPriceFee = marketPrices.length ? Math.min(...marketPrices) : 0
}

const handleSkuChange = (skuList: any[]) => {
  refreshSkuSummary(skuList)
  flatten.value = skuList
}

const buildSkuName = (sku: SkuVO) => {
  const attrValueNames = sku.spuSkuAttrValues?.map(attr => attr.attrValueName).filter(Boolean) || []
  return attrValueNames.length ? attrValueNames.join(' ') : sku.skuName
}

const buildSkuAttrs = (sku: SkuVO) => {
  const attrNames = sku.spuSkuAttrValues?.map(attr => attr.attrName).filter(Boolean) || []
  return Array.from(new Set(attrNames)).join(',')
}

const validateSubmitSkus = (skuList: SkuVO[]) => {
  if (!skuSelectorRef.value?.validateStock()) {
    return false
  }
  if (skuList.some(sku => sku.stock === null || sku.stock === undefined || Number.isNaN(Number(sku.stock)))) {
    ElMessage.warning('商品库存不能为空！')
    return false
  }
  if (skuList.some(sku => Number(sku.priceFee || 0) <= 0)) {
    ElMessage.warning('商品销售价格必须大于0！')
    return false
  }
  return true
}

const buildSubmitData = () => {
  refreshSkuSummary(dataForm.skuList)
  const submitData = JSON.parse(JSON.stringify(dataForm))
  const skuList = submitData.skuList.map((sku: SkuVO) => {
    const nextSku: SkuVO = {
      ...sku,
      attrs: buildSkuAttrs(sku),
      skuName: buildSkuName(sku),
      marketPriceFee: toCent(sku.marketPriceFee),
      priceFee: toCent(sku.priceFee),
      stock: Number(sku.stock || 0),
    }
    if (nextSku.skuId && nextSku.spuId) {
      nextSku.spuSkuAttrValues = undefined
    }
    if (nextSku.changeStock != null) {
      nextSku.changeStock = Math.max(Number(nextSku.changeStock), 0)
    }
    delete nextSku.originalStock
    return nextSku
  })

  submitData.skuList = skuList
  submitData.priceFee = toCent(dataForm.priceFee)
  submitData.marketPriceFee = toCent(dataForm.marketPriceFee)
  submitData.totalStock = dataForm.totalStock
  submitData.changeStock = Math.max(Number(dataForm.changeStock || 0), 0)
  delete submitData.skus
  delete submitData.brand
  delete submitData.category
  delete submitData.shopCategory
  delete submitData.shopName
  return submitData
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

    if (dataForm.skuList.length === 0) {
      ElMessage.warning('请添加销售属性！')
      return
    }

    if (!validateSubmitSkus(dataForm.skuList)) {
      return
    }

    const submitData = buildSubmitData()

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
  dataForm.skuList = []
  dataForm.totalStock = 0
  dataForm.changeStock = 0
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
    const skus = data.skus || []
    backTotalStock.value = skus.reduce((total: number, sku: SkuVO) => total + Number(sku.stock || 0), 0)
    dataForm.skuList = skus.map(normalizeSkuForEdit)
    dataForm.priceFee = toYuan(data.priceFee)
    dataForm.marketPriceFee = toYuan(data.marketPriceFee)
    dataForm.changeStock = 0
    refreshSkuSummary(dataForm.skuList)

    if (data.brand?.imgUrl) {
      brandImgUrl.value = data.brand.imgUrl.startsWith('http')
        ? data.brand.imgUrl
        : resourcesUrl + data.brand.imgUrl
    }
    brandName.value = data.brand?.name || ''
    selectedCategorys.value = data.category?.pathNames || []
    selectedShopCategorys.value = data.shopCategory?.pathNames || []
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

.form-tip {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 12px;
}

.unit {
  margin-left: 8px;
  color: #606266;
}

.tag-group {
  display: flex;
  gap: 20px;
}

.tag-group .el-checkbox {
  margin-right: 0;
}

.sales-inputs {
  display: flex;
  gap: 20px;
}

.sales-inputs .input-item {
  display: flex;
  align-items: center;
}

.sales-inputs .input-item label {
  white-space: nowrap;
  margin-right: 8px;
}
</style>
