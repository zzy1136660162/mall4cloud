<template>
  <div class="sku-selector">
    <div class="sku-attrs">
      <div v-for="(attr, attrIndex) in selectedAttrs" :key="attrIndex" class="sku-attr-item">
        <div class="attr-header">
          <span class="attr-name">{{ attr.name }}：</span>
          <el-checkbox-group v-model="attr.selectedValues">
            <el-checkbox
              v-for="val in attr.attrValues"
              :key="val.attrValueId"
              :label="val.attrValueId"
              @change="handleAttrChange"
            >
              {{ val.value }}
            </el-checkbox>
          </el-checkbox-group>
          <el-button type="danger" link size="small" @click="removeAttr(attrIndex)">
            删除
          </el-button>
        </div>
      </div>

      <div v-if="availableAttrs.length > 0 && selectedAttrs.length < 2" class="add-attr">
        <el-dropdown @command="handleAddAttr">
          <el-button type="primary" plain>
            添加销售属性
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="attr in availableAttrs"
                :key="attr.attrId"
                :command="attr"
              >
                {{ attr.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div v-if="selectedAttrs.length === 0 && categoryId" class="no-attrs">
        <span>暂无销售属性</span>
        <el-button type="primary" size="small" @click="loadAttrs">刷新</el-button>
      </div>
    </div>

    <div v-if="skuCombinations.length > 0" class="sku-table">
      <div class="sku-tips">
        <span>共 {{ skuCombinations.length }} 个SKU组合</span>
        <el-button type="primary" link @click="batchSetPrice">批量设置价格</el-button>
        <el-button type="primary" link @click="batchSetStock">批量设置库存</el-button>
      </div>
      <el-table :data="skuCombinations" border style="width: 100%">
        <el-table-column label="SKU图片" width="100">
          <template #default="{ row }">
            <div class="sku-img" @click="selectSkuImg(row)">
              <img v-if="row.imgUrl" :src="getImgSrc(row.imgUrl)" alt="">
              <el-icon v-else><Plus /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(attr, index) in selectedAttrs"
          :key="index"
          :label="attr.name"
          width="120"
        >
          <template #default="{ row }">
            {{ getAttrValueName(row, attr.attrId) }}
          </template>
        </el-table-column>
        <el-table-column label="SKU名称" min-width="150">
          <template #default="{ row }">
            <el-input v-model="row.skuName" placeholder="SKU名称" />
          </template>
        </el-table-column>
        <el-table-column label="价格(元)" width="130">
          <template #default="{ row }">
            <el-input-number
              v-model="row.priceFee"
              :min="0"
              :precision="2"
              :controls="false"
              placeholder="价格"
              @change="handleSkuChange"
            />
          </template>
        </el-table-column>
        <el-table-column label="划线价(元)" width="130">
          <template #default="{ row }">
            <el-input-number
              v-model="row.marketPriceFee"
              :min="0"
              :precision="2"
              :controls="false"
              placeholder="划线价"
              @change="handleSkuChange"
            />
          </template>
        </el-table-column>
        <el-table-column label="库存" width="120">
          <template #default="{ row }">
            <el-input-number
              v-model="row.stock"
              :min="0"
              :precision="0"
              :controls="false"
              placeholder="库存"
              @change="handleSkuChange"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <ImgBox
      v-if="imgBoxVisible"
      ref="imgBoxRef"
      @refresh-pic="handleImgSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowDown, Plus } from '@element-plus/icons-vue'
import ImgBox from '@/components/ImgBox/index.vue'
import { productApi, type AttrVO, type SkuVO, type SpuSkuAttrValue } from '@/api/modules/product'

const props = defineProps({
  modelValue: {
    type: Array as () => SkuVO[],
    default: () => [],
  },
  categoryId: {
    type: Number,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

interface AttrWithSelection extends AttrVO {
  selectedValues: number[]
}

const allAttrs = ref<AttrVO[]>([])
const selectedAttrs = ref<AttrWithSelection[]>([])
const skuCombinations = ref<SkuVO[]>([])
const imgBoxVisible = ref(false)
const currentSkuRow = ref<SkuVO | null>(null)
const imgBoxRef = ref()
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL

const availableAttrs = computed(() => {
  const selectedIds = selectedAttrs.value.map(a => a.attrId)
  return allAttrs.value.filter(attr => !selectedIds.includes(attr.attrId))
})

const cloneSkuList = (skuList: SkuVO[]) => JSON.parse(JSON.stringify(skuList)) as SkuVO[]

const hasSameAttrValues = (skuAttrs: SpuSkuAttrValue[], combination: SpuSkuAttrValue[]) => {
  return combination.every((comb: SpuSkuAttrValue) =>
    skuAttrs.some(s => s.attrValueId === comb.attrValueId)
  ) && skuAttrs.length === combination.length
}

const syncSelectedAttrsFromSkus = (skus: SkuVO[]) => {
  const attrMap = new Map<number, AttrWithSelection>()
  skus.forEach((sku) => {
    sku.spuSkuAttrValues?.forEach((skuAttr) => {
      if (skuAttr.attrId == null || skuAttr.attrValueId == null) {
        return
      }
      const attrConfig = allAttrs.value.find(attr => attr.attrId === skuAttr.attrId)
      const attr = attrMap.get(skuAttr.attrId) || {
        ...(attrConfig || {
          attrId: skuAttr.attrId,
          name: skuAttr.attrName,
          attrValues: [],
        }),
        selectedValues: [],
      }
      if (!attr.selectedValues.includes(skuAttr.attrValueId)) {
        attr.selectedValues.push(skuAttr.attrValueId)
      }
      if (!attr.attrValues?.some(value => value.attrValueId === skuAttr.attrValueId)) {
        attr.attrValues = [
          ...(attr.attrValues || []),
          { attrValueId: skuAttr.attrValueId, value: skuAttr.attrValueName },
        ]
      }
      attrMap.set(skuAttr.attrId, attr)
    })
  })
  selectedAttrs.value = Array.from(attrMap.values()).slice(0, 2)
}

const normalizeSkuList = (skuList: SkuVO[]) => {
  return cloneSkuList(skuList).map((sku) => {
    const stock = Number(sku.stock || 0)
    const originalStock = sku.originalStock ?? stock
    const changeStock = sku.skuId ? Math.max(stock - originalStock, 0) : undefined
    return {
      ...sku,
      stock,
      originalStock,
      changeStock,
      marketPriceFee: Number(sku.marketPriceFee || 0),
      priceFee: Number(sku.priceFee || 0),
    }
  })
}

const refreshSkuState = (skuList: SkuVO[]) => {
  skuCombinations.value = normalizeSkuList(skuList)
  syncSelectedAttrsFromSkus(skuCombinations.value)
}

watch(() => props.categoryId, (newVal) => {
  if (newVal) {
    loadAttrs()
  } else {
    allAttrs.value = []
    selectedAttrs.value = []
    skuCombinations.value = []
  }
}, { immediate: true })

watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.length > 0) {
    refreshSkuState(newVal)
  } else {
    skuCombinations.value = []
    selectedAttrs.value = []
  }
}, { immediate: true, deep: true })

const loadAttrs = async () => {
  if (!props.categoryId) return
  try {
    const data = await productApi.prodInfo.getAttrsByCategoryId({
      categoryId: props.categoryId,
      attrType: 2,
    })
    allAttrs.value = data || []
    syncSelectedAttrsFromSkus(skuCombinations.value)
  } catch (error) {
    console.error('获取销售属性失败', error)
  }
}

const handleAddAttr = (attr: AttrVO) => {
  const exists = selectedAttrs.value.find(a => a.attrId === attr.attrId)

  if (!exists && selectedAttrs.value.length < 2) {
    const allAttrValueIds = attr.attrValues?.map(v => v.attrValueId) || []
    selectedAttrs.value.push({
      ...attr,
      selectedValues: allAttrValueIds,
    })
    generateSkuCombinations()
  }
}

const removeAttr = (index: number) => {
  selectedAttrs.value.splice(index, 1)
  generateSkuCombinations()
}

const handleAttrChange = () => {
  generateSkuCombinations()
}

const generateSkuCombinations = () => {
  const selectedAttrValues = selectedAttrs.value.filter(attr => attr.selectedValues.length > 0)

  if (selectedAttrValues.length === 0) {
    skuCombinations.value = []
    emitUpdate()
    return
  }

  const combinations: SkuVO[] = []
  const cartesian = (...arrays: any[][]) => {
    return arrays.reduce((acc, curr) => {
      const result: any[] = []
      acc.forEach(x => {
        curr.forEach(y => {
          result.push([...x, y])
        })
      })
      return result
    }, [[]])
  }

  const valueArrays = selectedAttrValues.map(attr =>
    attr.selectedValues.map(valueId => ({
      attrId: attr.attrId,
      attrName: attr.name,
      attrValueId: valueId,
      attrValueName: attr.attrValues?.find(v => v.attrValueId === valueId)?.value || '',
    }))
  )

  if (valueArrays.length === 0) {
    skuCombinations.value = []
    emitUpdate()
    return
  }

  const allCombinations = cartesian(...valueArrays)

  allCombinations.forEach(combination => {
    const existingSku = skuCombinations.value.find(sku => {
      const skuAttrs = sku.spuSkuAttrValues || []
      return hasSameAttrValues(skuAttrs, combination)
    })

    if (existingSku) {
      combinations.push(existingSku)
    } else {
      const newSku: SkuVO = {
        priceFee: 0,
        marketPriceFee: 0,
        stock: 0,
        spuSkuAttrValues: combination,
      }
      combinations.push(newSku)
    }
  })

  skuCombinations.value = combinations
  emitUpdate()
}

const selectSkuImg = (row: SkuVO) => {
  currentSkuRow.value = row
  imgBoxVisible.value = true
  setTimeout(() => {
    imgBoxRef.value?.init(1, 1)
  }, 0)
}

const handleImgSelected = (imagePath: string) => {
  if (currentSkuRow.value && imagePath) {
    currentSkuRow.value.imgUrl = imagePath
    emitUpdate()
  }
  imgBoxVisible.value = false
}

const batchSetPrice = () => {
  ElMessageBox.prompt('请输入批量设置的价格（元）', '批量设置价格', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'number',
    inputValue: '0',
  }).then(({ value }) => {
    const price = parseFloat(value) || 0
    skuCombinations.value.forEach(sku => {
      sku.priceFee = price
    })
    emitUpdate()
  }).catch(() => {})
}

const batchSetStock = () => {
  ElMessageBox.prompt('请输入批量设置的库存', '批量设置库存', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'number',
    inputValue: '0',
  }).then(({ value }) => {
    const stock = parseInt(value) || 0
    skuCombinations.value.forEach(sku => {
      updateSkuStock(sku, stock)
    })
    emitUpdate()
  }).catch(() => {})
}

const updateSkuStock = (sku: SkuVO, stock: number) => {
  if (sku.skuId && sku.originalStock != null && stock < sku.originalStock) {
    sku.stock = sku.originalStock
    sku.changeStock = 0
    ElMessage.warning('输入库存不得小于原有库存')
    return
  }
  sku.stock = stock
  if (sku.skuId && sku.originalStock != null) {
    sku.changeStock = stock - sku.originalStock
  }
}

const getAttrValueName = (row: SkuVO, attrId: number) => {
  const attr = row.spuSkuAttrValues?.find(a => a.attrId === attrId)
  return attr?.attrValueName || ''
}

const getImgSrc = (img: string) => {
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return resourcesUrl + img
}

const handleSkuChange = () => {
  skuCombinations.value.forEach((sku) => {
    updateSkuStock(sku, Number(sku.stock || 0))
  })
  emitUpdate()
}

const validateStock = () => {
  const invalidSku = skuCombinations.value.find((sku) => {
    return sku.skuId && sku.originalStock != null && Number(sku.stock || 0) < sku.originalStock
  })
  if (invalidSku) {
    ElMessage.warning('输入库存不得小于原有库存')
    return false
  }
  return true
}

const emitUpdate = () => {
  const nextSkuList = cloneSkuList(skuCombinations.value).map((sku) => {
    if (sku.skuId && sku.originalStock != null) {
      sku.changeStock = Math.max(Number(sku.stock || 0) - sku.originalStock, 0)
    }
    return sku
  })
  emit('update:modelValue', nextSkuList)
  emit('change', cloneSkuList(nextSkuList))
}

defineExpose({
  loadAttrs,
  validateStock,
})
</script>

<style lang="scss" scoped>
.sku-selector {
  .sku-attrs {
    margin-bottom: 20px;

    .sku-attr-item {
      margin-bottom: 15px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 4px;

      .attr-header {
        display: flex;
        align-items: center;
        gap: 10px;

        .attr-name {
          font-weight: bold;
          min-width: 80px;
        }

        :deep(.el-checkbox-group) {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
      }
    }

    .add-attr {
      margin-top: 10px;
    }

    .no-attrs {
      color: #999;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .sku-table {
    .sku-tips {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 10px;
      color: #666;
    }

    .sku-img {
      width: 60px;
      height: 60px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;

      &:hover {
        border-color: #409eff;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .el-icon {
        font-size: 20px;
        color: #8c939d;
      }
    }

    :deep(.el-table) {
      .el-input-number {
        width: 100%;

        .el-input__wrapper {
          padding-left: 8px;
          padding-right: 8px;
        }
      }
    }
  }
}
</style>
