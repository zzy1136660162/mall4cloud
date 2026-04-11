<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :background="background"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  page?: number
  limit?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  autoScroll?: boolean
  hidden?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 30, 50],
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  autoScroll: true,
  hidden: false,
})

const emit = defineEmits(['update:limit', 'update:page', 'pagination'])

const currentPage = computed({
  get() {
    return props.page
  },
  set(val: number) {
    emit('update:page', val)
  },
})

const pageSize = computed({
  get() {
    return props.limit
  },
  set(val: number) {
    emit('update:limit', val)
  },
})

const handleSizeChange = (val: number) => {
  emit('pagination', { pageNum: currentPage.value, pageSize: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

const handleCurrentChange = (val: number) => {
  emit('pagination', { pageNum: val, pageSize: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  background: #fff;
  padding: 32px 0;

  &.hidden {
    display: none;
  }
}
</style>
