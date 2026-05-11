<template>
  <el-dialog
    v-model="visible"
    title="dataForm.categoryId ? 编辑 : 新增"
    :close-on-click-modal="false"
    class="component-category-add-or-update"
    top="10vh"
    width="750px"
    @close="closeDialog"
  >
    <el-form
      ref="dataFormRef"
      :rules="rules"
      :model="dataForm"
      label-width="90px"
      class="category-form"
      style="width: 500px; margin-left:50px;"
    >
      <!-- 分类名称 -->
      <el-form-item
        label="分类名称"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          placeholder="请输入分类名称"
          maxlength="255"
        />
      </el-form-item>
      <!-- 分类图片 -->
      <el-form-item
        label="图片"
        prop="imgUrl"
      >
        <img-upload v-model="dataForm.imgUrl" />
        <span v-if="dataForm.parentId === 0">{{ 推荐图片尺寸 + '510*80' }}</span>
      </el-form-item>
      <!-- 分类图标 -->
      <el-form-item
        label="图标"
        prop="icon"
      >
        <img-upload v-model="dataForm.icon" />
      </el-form-item>
      <!-- 上级分类 -->
      <el-form-item
        v-if="showSelectColumnOfCategory"
        label="上级分类"
      >
        <category-group
          :selected-categories="selectedCategories"
          :show-category-select-btn="showCategorySelectBtn"
          :single="true"
          @select-or-revise-category="selectOrReviseCategory"
        />
      </el-form-item>
      <!-- 排序 -->
      <el-form-item
        label="排序"
        prop="seq"
      >
        <el-input-number
          v-model="dataForm.seq"
          :min="0"
          controls-position="right"
          :precision="0"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="dataFormSubmit()"
        >
          确定
        </el-button>
      </div>
    </template>

    <category-selector
      v-if="categorySelectorVisible"
      ref="categorySelectorRef"
      @get-category-selected="getCategorySelected"
    />
  </el-dialog>
</template>

<script setup>

defineOptions({ name: 'CategoryAddOrUpdate' })
import * as api from '@/api/product/category'
import { reactive } from 'vue'

const emit = defineEmits(['refreshDataList'])

const Data = reactive({
  visible: false,
  dataForm: {
    categoryId: 0,
    shopId: null,
    parentId: 0,
    name: null,
    desc: null,
    path: null,
    status: '1',
    icon: '',
    imgUrl: '',
    level: null,
    seq: 1
  },
  showCategorySelectBtn: true,
  categoryList: [],
  categorySelectorVisible: false,
  selectedCategories: [],
  showSelectColumnOfCategory: true, // 是否显示上级分类栏
  rules: {
    name: [
      { required: true, message: 请输入分类名称, trigger: 'blur' }
    ],
    imgUrl: [
      { required: true, message: 请上传图片, trigger: 'blur' }
    ]
  }
})
const { visible, dataForm, showCategorySelectBtn, categorySelectorVisible, selectedCategories, showSelectColumnOfCategory, rules } = toRefs(Data)

const dataFormRef = ref()
const init = (categoryId) => {
  Data.visible = true
  Data.dataForm.categoryId = categoryId || 0
  nextTick(() => {
    dataFormRef.value.resetFields()
    if (!Data.dataForm.categoryId) {
      return
    }
    if (categoryId) {
      api.get(categoryId).then(data => {
        Data.dataForm = data
        Data.selectedCategories = data.pathNames ? data.pathNames : []
        Data.showCategorySelectBtn = false
        data.level === 0 ? Data.showSelectColumnOfCategory = false : Data.showSelectColumnOfCategory = true
      })
    }
  })
}

// 关闭dialog时
const closeDialog = () => {
  Data.selectedCategories = []
  Data.showCategorySelectBtn = true
  Data.showSelectColumnOfCategory = true
}

/**
 * 选择分类弹窗
 */
const categorySelectorRef = ref()
const selectOrReviseCategory = () => {
  Data.categorySelectorVisible = true
  nextTick(() => {
    categorySelectorRef.value.init(1) // 1代表从创建分类进入
  })
}

/**
     * 获取子组件返回数据
     */
const getCategorySelected = (selectedCategories, parentId) => {
  Data.categorySelectorVisible = false
  Data.selectedCategories = selectedCategories
  Data.dataForm.parentId = parentId
}

// 表单提交
const dataFormSubmit = () => {
  dataFormRef.value.validate(valid => {
    if (!valid) {
      return
    }
    // 层级 0第一级
    Data.dataForm.level = !Data.selectedCategories.length ? 0 : Data.selectedCategories.length
    const request = Data.dataForm.categoryId ? api.update(Data.dataForm) : api.save(Data.dataForm)
    request.then(() => {
      ElMessage({
        message: '操作成功',
        type: 'success',
        duration: 1500,
        onClose: () => {
          Data.visible = false
          emit('refreshDataList')
          dataFormRef.value.resetFields()
        }
      })
    })
  })
}

defineExpose({
  init
})
</script>

<style lang="scss" scoped>
.component-category-add-or-update {
  .category-form {
    :deep(.el-form-item__content) {
      display: block;
    }
  }
}
</style>
