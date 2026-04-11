<template>
  <el-dialog
    v-model="visible"
    title="选择分类"
    :append-to-body="true"
    class="component-category-selector"
    width="1000px"
    @close="onClose"
  >
    <div class="prod-category clearfix">
      <div class="category">
        <div v-if="firstCategorys.dataList.length" class="category-box">
          <el-input
            v-model="firstCategorys.name"
            placeholder="请选择分类"
            :disabled="true"
          />
          <ul class="category-list">
            <li
              v-for="(item, index) in firstCategorys.dataList"
              :key="item.categoryId"
              :class="['category-item', item.categoryId == firstCategorys.id ? 'active' : '']"
              @click="selectFirstCategorys(item.categoryId, index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>

        <div v-if="secondCategorys.dataList.length && firstCategorys.id != 0" class="category-box">
          <el-input
            v-model="secondCategorys.name"
            placeholder="请选择分类"
            :disabled="true"
          />
          <ul class="category-list">
            <li
              v-for="(item, index) in secondCategorys.dataList"
              :key="item.categoryId"
              :class="['category-item', isCreateCategory ? 'prohibit-sel' : item.categoryId == secondCategorys.id ? 'active' : '']"
              @click="selectSecondCategorys(item.categoryId, index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>

        <div v-if="showthreeCategorys && threeCategorys.dataList.length > 0 && secondCategorys.id != 0" class="category-box">
          <el-input
            v-model="threeCategorys.name"
            placeholder="请选择分类"
            :disabled="true"
          />
          <ul class="category-list">
            <li
              v-for="(item, index) in threeCategorys.dataList"
              :key="item.categoryId"
              :class="['category-item', isCreateCategory ? 'prohibit-sel' : item.categoryId == threeCategorys.id ? 'active' : '']"
              @click="selectThreeCategorys(item.categoryId, index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="current-selected">
        <span class="bold">当前选择：</span>
        <span class="select-item">{{ firstCategorys.name }}</span>
        <span v-if="!isCreateCategory && secondCategorys.id" class="select-item">&nbsp;>&nbsp;&nbsp;{{ secondCategorys.name }}</span>
        <span v-if="showthreeCategorys && threeCategorys.id" class="select-item">&nbsp;>&nbsp;&nbsp;{{ threeCategorys.name }}</span>
      </div>

      <div class="read-rule">
        <div :class="['read-rule-txt', buttonHighlight ? 'todo' : '']" @click="optionsConfirm">
          已阅读并同意以上规则
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { productApi } from '@/api/modules/product'

const emit = defineEmits(['getCategorySelected'])

const visible = ref(false)
const allDataList = ref<any[]>([])

const firstCategorys = reactive({
  id: 0,
  name: '',
  dataList: [] as any[],
})

const secondCategorys = reactive({
  id: 0,
  name: '',
  dataList: [] as any[],
})

const threeCategorys = reactive({
  id: 0,
  name: '',
  dataList: [] as any[],
})

const parentId = ref(0)
const isCreateCategory = ref(false)
const showthreeCategorys = ref(false)
const buttonHighlight = ref(false)

const init = (type: number, key: string) => {
  visible.value = true
  if (key === 'platform') {
    productApi.category.platformCategories().then((data: any) => {
      allDataList.value = data
      firstCategorys.dataList = allDataList.value.filter((item: any) => item.level === 0)
    })
    showthreeCategorys.value = true
  } else {
    productApi.category.shopCategories().then((data: any) => {
      allDataList.value = data
      firstCategorys.dataList = allDataList.value.filter((item: any) => item.level === 0)
    })
    showthreeCategorys.value = false
  }
  isCreateCategory.value = !!(type === 1)
}

const selectFirstCategorys = (categoryId: number, index: number) => {
  secondCategorys.dataList = allDataList.value.filter((item: any) => item.parentId === categoryId)
  firstCategorys.name = firstCategorys.dataList[index].name
  parentId.value = firstCategorys.id = categoryId
  secondCategorys.id = 0
  threeCategorys.id = 0

  if (isCreateCategory.value || (!isCreateCategory.value && secondCategorys.dataList.length === 0)) {
    buttonHighlight.value = true
  } else {
    buttonHighlight.value = false
  }
}

const selectSecondCategorys = (categoryId: number, index: number) => {
  if (isCreateCategory.value) return

  threeCategorys.dataList = allDataList.value.filter((item: any) => item.parentId === categoryId)
  parentId.value = secondCategorys.id = categoryId
  secondCategorys.name = secondCategorys.dataList[index].name
  threeCategorys.id = 0

  if (!isCreateCategory.value && !buttonHighlight.value && !showthreeCategorys.value) {
    buttonHighlight.value = true
  } else {
    buttonHighlight.value = false
  }
}

const selectThreeCategorys = (categoryId: number, index: number) => {
  if (isCreateCategory.value) return

  parentId.value = threeCategorys.id = categoryId
  threeCategorys.name = threeCategorys.dataList[index].name
  buttonHighlight.value = true
}

const optionsConfirm = () => {
  if (showthreeCategorys.value && !threeCategorys.id) return
  if (!showthreeCategorys.value && isCreateCategory.value && !firstCategorys.id) return
  if (!showthreeCategorys.value && !isCreateCategory.value && secondCategorys.dataList.length > 0 && !secondCategorys.id) return

  const selectedCategorys: string[] = []
  if (firstCategorys.id) {
    selectedCategorys.push(firstCategorys.name)
  }
  if (!isCreateCategory.value && secondCategorys.id) {
    selectedCategorys.push(secondCategorys.name)
  }
  if (showthreeCategorys.value && !isCreateCategory.value && threeCategorys.id) {
    selectedCategorys.push(threeCategorys.name)
  }
  emit('getCategorySelected', selectedCategorys, parentId.value)
}

const onClose = () => {
  allDataList.value = []
  firstCategorys.id = 0
  firstCategorys.name = ''
  firstCategorys.dataList = []
  secondCategorys.id = 0
  secondCategorys.name = ''
  secondCategorys.dataList = []
  threeCategorys.id = 0
  threeCategorys.name = ''
  threeCategorys.dataList = []
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped>
.component-category-selector {
  .clearfix::after {
    display: block;
    content: "";
    visibility: hidden;
    height: 0;
    clear: both;
  }

  .category-box {
    box-sizing: border-box;
    width: 32%;
    display: inline-block;
    border: 1px solid #e4e4e4;
    padding: 20px;
    background: #fff;
    box-shadow: 0 5px 8px -4px #e2e2e2;
    margin-right: 1%;
    vertical-align: top;
  }

  .category-list {
    margin-top: 10px;
    height: 250px;
    margin-left: 10px;
    overflow-y: auto;

    .category-item {
      padding: 6px;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:hover,
      &.active {
        background: #f5f5f5;
        border-radius: 3px;
      }

      &.prohibit-sel {
        cursor: not-allowed;
        opacity: 0.6;
      }
    }
  }

  .current-selected {
    margin-top: 20px;
    border: 2px solid #fedbab;
    padding: 6px;
    background: #fffaf2;
    line-height: 1.5em;

    .bold {
      font-weight: bold;
    }
  }

  .read-rule {
    width: 100%;
    margin-top: 20px;

    .read-rule-txt {
      text-align: center;
      color: #fff;
      background: #999;
      line-height: 3em;
      width: 50%;
      margin: 0 auto;
      cursor: pointer;

      &.todo {
        background: #02a1e9;
      }
    }
  }
}
</style>
