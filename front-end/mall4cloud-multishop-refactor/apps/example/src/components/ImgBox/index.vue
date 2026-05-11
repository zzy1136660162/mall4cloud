<template>
  <el-dialog
    v-model="visible"
    title="图片管理"
    class="component-imgbox"
    top="10vh"
    :append-to-body="true"
    width="900px"
  >
    <div class="file-group">
      <div class="upload-btn">
        <div class="up-btn">
          <el-button type="primary" plain @click="uploadFileBtn">上传图片</el-button>
          <el-button @click="selectOrCreateGroup(1)">新建分组</el-button>
        </div>
        <el-form :inline="true" class="form">
          <el-form-item>
            <el-input v-model="fileName" placeholder="图片名称" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchImg">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="img-group-box">
        <div class="left-sidebar">
          <div class="group-list">
            <div
              :class="['group-item', dataForm.attachFileGroupId === 0 ? 'active' : '']"
              @click="clickOneGroup(0)"
            >
              <span class="group-name">全部图片</span>
            </div>
            <div
              v-for="gItem in groupList"
              :key="gItem.attachFileGroupId"
              :class="['group-item', dataForm.attachFileGroupId === gItem.attachFileGroupId ? 'active' : '']"
            >
              <span class="group-name" @click="clickOneGroup(gItem.attachFileGroupId)">{{ gItem.name }}</span>
              <span class="sidebar-operate">
                <el-icon @click="selectOrCreateGroup(1, gItem.attachFileGroupId)"><Edit /></el-icon>
                <el-icon @click="deleteFileGroup(gItem.attachFileGroupId)"><Delete /></el-icon>
              </span>
            </div>
          </div>
        </div>

        <div v-if="options.activeTab === 'pick'" class="pick-block">
          <div class="elx-img-list">
            <div v-if="isLoading" class="elx-img-list-loading">
              <div class="el-icon-loading" />
            </div>
            <div
              v-for="img in imgRes"
              :key="img.fileId"
              class="img-item"
            >
              <div class="thumb-wp" @click="onClickListImage(img)">
                <img :src="getImgSrc(img.filePath)" :alt="img.fileName">
              </div>
              <div class="title" @click="onClickListImage(img)">{{ img.fileName }}</div>
              <div class="operate">
                <el-link type="info" @click="changeName(img)">编辑</el-link>
                <el-link type="danger" @click="delectImg(img.fileId)">删除</el-link>
              </div>
              <span v-if="img.selected" class="selected" @click="onClickListImage(img)">
                <span class="icon el-icon-check" />
              </span>
            </div>
            <div v-if="!imgRes.length" class="empty">暂无图片</div>
          </div>

          <el-pagination
            layout="total, prev, pager, next"
            :current-page="page.current"
            :page-size="page.size"
            :total="page.total"
            @current-change="onPageNumChange"
          />

          <div class="elx-foot">
            <el-badge v-if="!isSingle" :value="images.length" class="item">
              <el-button type="primary" :disabled="images.length === 0" @click="onConfirm">确定</el-button>
            </el-badge>
            <el-button v-else type="primary" :disabled="disabled" @click="onConfirm">确定</el-button>
            <el-button type="primary" plain @click="uploadFileBtn">上传图片</el-button>
          </div>
        </div>

        <div v-if="options.activeTab === 'upload'" class="upload-block">
          <div class="upload-title">选择本地图片</div>
          <el-upload
            ref="uploadRef"
            v-model:file-list="fileList"
            class="upload-img-preview"
            list-type="picture-card"
            accept="image/*"
            :http-request="httpRequest"
            :multiple="true"
            :auto-upload="false"
            :limit="uploadNumberLimit()"
            :before-upload="beforeUpload"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
            :on-exceed="onUploadExceedTip"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <div class="file-group-btn">
            <span v-if="groupForm.name" class="sel-group-name">{{ groupForm.name }}</span>
            <el-button type="primary" link @click="selectOrCreateGroup(0)">选择分组</el-button>
            <el-button type="primary" link @click="selectOrCreateGroup(1)">新建分组</el-button>
          </div>

          <div class="upload-tip">{{ uploadTips() }}</div>

          <div class="elx-foot">
            <el-button type="primary" @click="onUploadConfirm">确认上传</el-button>
          </div>
        </div>
      </div>

      <el-dialog v-model="showGroupVisible" :title="selectGroup ? '选择分组' : createGroup ? '新建分组' : ''" :append-to-body="true" width="400px">
        <el-form ref="groupFormRef" :model="groupForm" label-width="90px">
          <el-form-item v-if="createGroup" label="分组名称" prop="name">
            <el-input v-model="groupForm.name" placeholder="请输入分组名称" />
          </el-form-item>
          <el-form-item v-if="selectGroup" label="选择分组">
            <el-select v-model="groupForm.attachFileGroupId" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.attachFileGroupId"
                :label="item.name"
                :value="item.attachFileGroupId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showGroupVisible = false">取消</el-button>
          <el-button type="primary" @click="groupFormSubmit">确定</el-button>
        </template>
      </el-dialog>

      <el-dialog v-model="changeNameVisible" title="修改图片名称" :close-on-click-modal="false" top="200px" :append-to-body="true" width="600px">
        <el-form v-if="changeNameVisible" :model="imageObject" label-width="80px">
          <el-form-item label="原名称">
            <span>{{ imageObject?.fileName }}</span>
          </el-form-item>
          <el-form-item label="新名称">
            <el-input v-model="newImgName" placeholder="请输入新名称" clearable />
          </el-form-item>
          <el-form-item label="选择分组">
            <el-select v-model="groupForm.attachFileGroupId" placeholder="请选择">
              <el-option
                v-for="item in groupList"
                :key="item.attachFileGroupId"
                :label="item.name"
                :value="item.attachFileGroupId"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="changeNameVisible = false">取消</el-button>
          <el-button @click="submitImgName">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { bizApi } from '@/api/modules/biz'

const emit = defineEmits(['refreshPic'])

const visible = ref(false)
const isSingle = ref(false)
const disabled = ref(false)
const fileList = ref<any[]>([])
const images = ref<any[]>([])
const dataForm = reactive({
  attachFileGroupId: 0,
})
const groupList = ref<any[]>([])
const attachFiles = ref<any[]>([])
const resourcesUrl = import.meta.env.VITE_APP_RESOURCES_URL
const showGroupVisible = ref(false)
const selectGroup = ref(false)
const createGroup = ref(false)
const groupForm = reactive({
  attachFileGroupId: '',
  name: '',
})
const groupId = ref<number | null>(null)
const newImgName = ref('')
const imageObject = ref<any>(null)
const changeNameVisible = ref(false)
const fileName = ref('')
const isLoading = ref(false)
const imgRes = ref<any[]>([])
const page = reactive({
  current: 1,
  size: 15,
  total: 0,
})
const options = reactive({
  activeTab: 'pick',
  limit: 20,
})
const uploadRef = ref()
const groupFormRef = ref()
const ossList = ref<any[]>([])

const getImgSrc = (img: string) => {
  if (!img) return ''
  if (img.startsWith('http://') || img.startsWith('https://')) return img
  return resourcesUrl + img
}

const init = (type: number, limit: number) => {
  visible.value = true
  isLoading.value = false
  images.value = []
  isSingle.value = type === 1
  disabled.value = type === 1
  options.limit = limit || 20
  fileList.value = []
  page.current = 1
  loadImageGroup()
  loadListImage()
}

const loadImageGroup = () => {
  bizApi.fileGroup.page().then((data: any) => {
    groupList.value = data
  })
}

const clickOneGroup = (id: number) => {
  dataForm.attachFileGroupId = id
  options.activeTab = 'pick'
  loadListImage()
}

const selectOrCreateGroup = (st: number, gId?: number) => {
  if (!gId) {
    groupForm.attachFileGroupId = ''
    groupForm.name = ''
  }
  if (st === 0) {
    if (!groupList.value.length) {
      ElMessage.warning('当前暂无分组可选择，请先创建分组')
      showGroupVisible.value = false
      return
    }
    selectGroup.value = true
    createGroup.value = false
  } else if (st === 1) {
    createGroup.value = true
    selectGroup.value = false
    if (gId) {
      const item = groupList.value.find(g => g.attachFileGroupId === gId)
      if (item) {
        groupForm.name = item.name
        groupForm.attachFileGroupId = gId
      }
      groupId.value = gId
    }
  }
  showGroupVisible.value = true
}

const groupFormSubmit = async () => {
  if (selectGroup.value) {
    if (!groupForm.attachFileGroupId) {
      ElMessage.warning('请选择分组')
      return
    }
    const item = groupList.value.find(g => g.attachFileGroupId === groupForm.attachFileGroupId)
    if (item) groupForm.name = item.name
    showGroupVisible.value = false
    return
  }
  if (createGroup.value) {
    if (!groupForm.name) {
      ElMessage.warning('分组名称不能为空')
      return
    }
    try {
      if (groupId.value) {
        await bizApi.fileGroup.update({ attachFileGroupId: groupId.value, name: groupForm.name })
      } else {
        await bizApi.fileGroup.save({ name: groupForm.name })
      }
      ElMessage.success('操作成功')
      showGroupVisible.value = false
      loadImageGroup()
    } catch {
      // error
    }
  }
}

const deleteFileGroup = (groupId: number) => {
  ElMessageBox.confirm('确定要删除该分组吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await bizApi.fileGroup.delete(groupId)
    ElMessage.success('删除成功')
    loadImageGroup()
    searchImg()
  })
}

const loadListImage = () => {
  isLoading.value = true
  const param = {
    pageNum: page.current || 1,
    pageSize: page.size,
    fileName: fileName.value || undefined,
    fileGroupId: dataForm.attachFileGroupId || 0,
  }
  bizApi.attachFile.page(param).then((response: any) => {
    imgRes.value = response.list || []
    page.total = response.total || 0
    isLoading.value = false
  })
}

const onConfirm = () => {
  if (isSingle.value) {
    emit('refreshPic', images.value[0]?.filePath)
  } else {
    const imgPaths = images.value.map(file => file.filePath).join(',')
    emit('refreshPic', imgPaths)
  }
  visible.value = false
}

const changeName = (img: any) => {
  newImgName.value = ''
  imageObject.value = img
  changeNameVisible.value = true
  const item = groupList.value.find(g => g.attachFileGroupId === img.attachFileGroupId)
  if (item) {
    groupForm.name = item.name
    groupForm.attachFileGroupId = item.attachFileGroupId
  } else {
    groupForm.name = ''
    groupForm.attachFileGroupId = ''
  }
}

const submitImgName = async () => {
  try {
    await bizApi.attachFile.updateFileName({
      fileId: imageObject.value.fileId,
      fileName: newImgName.value || imageObject.value.fileName,
    })
    newImgName.value = ''
    changeNameVisible.value = false
    loadListImage()
  } catch {
    // error
  }
}

const delectImg = (fileId: number) => {
  ElMessageBox.confirm('确定要删除该图片吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await bizApi.attachFile.delete(fileId)
    images.value = []
    searchImg()
  })
}

const uploadFileBtn = () => {
  options.activeTab = 'upload'
  dataForm.attachFileGroupId = 0
  fileList.value = []
}

const onClickListImage = (img: any) => {
  if (isSingle.value) {
    clearListSelected()
    images.value = []
    disabled.value = false
  } else {
    const index = selectedImageIndex(img)
    if (index >= 0) {
      img.selected = false
      images.value.splice(index, 1)
      return
    }
  }
  if (!isSingle.value && images.value.length >= options.limit) {
    ElMessage.warning(`最多只能选择${options.limit}张图片`)
    return
  }
  images.value.push(JSON.parse(JSON.stringify(img)))
  img.selected = true
}

const clearListSelected = () => {
  imgRes.value.forEach(element => {
    element.selected = false
  })
}

const searchImg = () => {
  page.current = 1
  loadListImage()
}

const selectedImageIndex = (img: any) => {
  for (let i = 0; i < images.value.length; i++) {
    if (images.value[i].fileId === img.fileId) return i
  }
  return -1
}

const onPageNumChange = (p: number) => {
  page.current = p
  loadListImage()
}

const onUploadConfirm = () => {
  const fileNum = fileList.value.length
  bizApi.oss.info(fileNum).then(async (response: any) => {
    ossList.value = response.ossList || []
    await nextTick()
    uploadRef.value?.submit()
  })
}

const httpRequest = (event: any) => {
  const file = event.file
  const typeArray = file.type.split('/')
  const attachFile: any = {
    fileType: typeArray[1],
    fileName: file.name,
    fileSize: file.size,
    type: 1,
  }

  if (ossList.value.length <= 0) {
    ElMessage.error('数据异常，请刷新后重试')
    return
  }

  attachFile.filePath = '/' + ossList.value[0].dir + ossList.value[0].fileName
  attachFiles.value.push(attachFile)
  ossList.value.splice(0, 1)
  if (ossList.value.length <= 0) {
    event.onSuccess()
  }
}

const beforeUpload = (file: File) => {
  const typeArray = file.type.split('/')
  if (typeArray[0] !== 'image') {
    ElMessage.error('只能上传图片文件')
    return false
  }
  const isSize = file.size / (1024 * 1024) < 2
  if (!isSize) {
    ElMessage.error('图片大小不能超过2M')
    return false
  }
  return true
}

const uploadNumberLimit = () => {
  return options.limit - images.value.length
}

const uploadTips = () => {
  const tips: string[] = ['支持 jpg/png/gif 格式', '图片大小不超过2M']
  if (images.value.length > 0) {
    tips.push(`已选择${images.value.length}张`)
  }
  tips.push(`最多还能上传${uploadNumberLimit()}张`)
  return tips.join('，')
}

const onUploadError = () => {
  ElMessage.error('上传失败')
}

const onUploadSuccess = async () => {
  const uploadFiles = attachFiles.value.map(file => ({
    ...file,
    attachFileGroupId: groupForm.attachFileGroupId || undefined,
  }))
  await bizApi.attachFile.save(uploadFiles)
  attachFiles.value = []
  options.activeTab = 'pick'
  dataForm.attachFileGroupId = 0
  loadListImage()
  disabled.value = true
  fileList.value = []
  page.current = 1
}

const onUploadExceedTip = () => {
  ElMessage.warning(`最多只能选择${uploadNumberLimit()}张图片`)
}

defineExpose({
  init,
})
</script>

<style lang="scss" scoped>
.component-imgbox {
  .file-group {
    padding: 20px 0;

    .upload-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      margin-bottom: 15px;

      .up-btn {
        display: flex;
        gap: 10px;
      }
    }

    .form {
      margin-left: 50px;
    }

    .img-group-box {
      display: flex;

      .left-sidebar {
        width: 190px;
        height: 620px;
        font-size: 13px;
        color: #666;
        border-right: 1px solid #f2f3f5;
        overflow-y: auto;

        .group-list {
          .group-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            height: 38px;
            line-height: 38px;
            cursor: pointer;

            .group-name {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .sidebar-operate {
              display: none;
              gap: 10px;

              .el-icon {
                cursor: pointer;
                &:hover {
                  color: #409eff;
                }
              }
            }

            &:hover .sidebar-operate {
              display: flex;
            }
          }

          .group-item.active,
          .group-item:hover {
            background: #f2f3f5;
          }
        }
      }

      .pick-block {
        flex: 1;
        position: relative;
        height: 620px;

        .elx-img-list {
          padding: 10px;
          height: 520px;
          overflow-y: auto;

          .img-item {
            float: left;
            margin: 10px;
            width: 100px;
            cursor: pointer;
            position: relative;
            font-size: 12px;

            img {
              width: 100px;
              height: 100px;
              display: block;
            }

            .title {
              line-height: 24px;
              height: 24px;
              overflow: hidden;
              background: #f6f6f6;
              padding: 0 5px;
              text-align: center;
            }

            .operate {
              line-height: 24px;
              height: 24px;
              overflow: hidden;
              margin-top: 2px;
              padding: 0 5px;
              display: flex;
              justify-content: space-between;

              .el-link {
                font-size: 12px;
              }
            }

            .selected {
              position: absolute;
              right: -3px;
              top: -3px;
              width: 104px;
              height: 130px;
              border: 3px solid #409eff;
              border-radius: 3px;

              .icon {
                position: absolute;
                right: 0;
                top: 0;
                background: #409eff;
                color: #fff;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
              }
            }
          }

          .empty {
            display: block;
            width: 100%;
            margin-top: 150px;
            color: #bbb;
            text-align: center;
          }

          &::after {
            content: " ";
            display: table;
            clear: both;
          }
        }

        .elx-foot {
          padding: 15px 10px 0;
          display: flex;
          gap: 10px;
        }
      }

      .upload-block {
        flex: 1;
        padding: 20px;

        .upload-img-preview {
          :deep(.el-upload-list--picture-card) {
            .el-upload-list__item-status-label i {
              margin-top: 12px;
            }
          }
        }

        .file-group-btn {
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 10px;

          .sel-group-name {
            margin-right: 10px;
          }
        }

        .upload-tip {
          padding: 10px 0;
          font-size: 13px;
          color: #999;
        }

        .elx-foot {
          padding: 15px 0;
        }
      }
    }
  }

  .elx-img-list-loading {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    height: 520px;
    background: #fff;
    text-align: center;

    .el-icon-loading {
      font-size: 50px;
      color: #409eff;
      line-height: 460px;
    }
  }
}
</style>
