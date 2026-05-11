import api from '@/api'

export interface OssInfoVO {
  accessKeyId: string
  accessKeySecret: string
  bucketName: string
  endpoint: string
  fileKey: string
  host: string
}

export interface FileGroupVO {
  fileGroupId?: number
  groupName: string
  createTime?: string
}

export interface AttachFileVO {
  fileId?: number
  fileGroupId?: number
  fileName: string
  fileUrl: string
  fileSize?: number
  createTime?: string
}

export const bizApi = {
  oss: {
    info: (fileNum?: number) =>
      api.request<OssInfoVO>({
        url: '/mall4cloud_biz/oss/info',
        method: 'get',
        params: { fileNum },
      }),
  },

  fileGroup: {
    page: () =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file_group/list',
        method: 'get',
      }),

    get: (fileGroupId: number) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file_group',
        method: 'get',
        params: { fileGroupId },
      }),

    save: (data: FileGroupVO) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file_group',
        method: 'post',
        data,
      }),

    update: (data: FileGroupVO) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file_group',
        method: 'put',
        data,
      }),

    delete: (fileGroupId: number) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file_group',
        method: 'delete',
        params: { fileGroupId },
      }),
  },

  attachFile: {
    page: (params: { pageNum?: number; pageSize?: number; fileGroupId?: number }) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file/page',
        method: 'get',
        params,
      }),

    save: (data: AttachFileVO) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file',
        method: 'post',
        data,
      }),

    updateFileName: (data: { fileId: number; fileName: string }) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file/update_file',
        method: 'put',
        data,
      }),

    delete: (fileId: number) =>
      api.request({
        url: '/mall4cloud_biz/m/attach_file',
        method: 'delete',
        params: { fileId },
      }),

    minIoUpload: (url: string, data: { type: string }) =>
      api.request({
        headers: {
          'Content-Type': data.type,
        },
        url,
        method: 'put',
        data,
      }),

    aliOssUpload: (url: string, data: { type: string }) =>
      api.request({
        headers: {
          'Content-Type': data.type,
        },
        url,
        method: 'post',
        data,
      }),
  },
}

export default bizApi
