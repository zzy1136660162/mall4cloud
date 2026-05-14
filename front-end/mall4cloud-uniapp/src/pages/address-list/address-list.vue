<template>
  <view class="page-address-list">
    <view class="list-box">
      <block
        v-for="(addressItem, addressIndex) in addressList"
        :key="addressIndex"
      >
        <view
          :class="['item', addressItem.isDefault === 1 ? 'default-address' : '', isSelectMode ? 'select-mode' : '']"
          @tap.stop="handleSelectAddress(addressItem)"
        >
          <view class="text-box">
            <view class="address">
              <view
                v-if="addressItem.isDefault === 1"
                class="default-flag"
              >
                默认
              </view>
              {{ addressItem.province + addressItem.city + addressItem.area + addressItem.addr }}
            </view>
            <view class="name-phone">
              <view class="name">
                {{ addressItem.consignee }}
              </view>
              <view class="phone">
                {{ addressItem.mobile }}
              </view>
            </view>
          </view>
          <view
            v-if="!isSelectMode"
            class="edit-icon"
            @tap.stop="toEditAddress(addressItem.addrId)"
          >
            <image src="https://www.jiedongyouxuan.com/public-files/jiedong_weapp_static/images/edit.png" />
          </view>
          <view
            v-else
            class="select-icon"
          >
            <text class="select-icon-text">选择</text>
          </view>
        </view>
      </block>
      <view
        v-if="!addressList || addressList.length === 0"
        class="empty-tips"
      >
        暂无数据
      </view>
    </view>
    <view class="new-address">
      <view
        v-if="!isSelectMode"
        class="btn"
        @tap="addAddress"
      >
        新建收货地址
      </view>
      <view
        v-else
        class="btn cancel-btn"
        @tap="cancelSelect"
      >
        取消选择
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'

const Data = reactive({
  addressList: []
})
const { addressList } = toRefs(Data)

const isSelectMode = ref(false)
let eventChannel = null

onLoad((options) => {
  console.log('address-list onLoad options:', options)
  if (options.type === 'select') {
    isSelectMode.value = true
    console.log('select mode enabled')
  }
})

onShow(() => {
  getAddressList()
})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage) {
    const eventChannels = currentPage.getOpenerEventChannel?.()
    if (eventChannels) {
      eventChannel = eventChannels
      console.log('eventChannel from getOpenerEventChannel:', eventChannel)
    }
  }
})

/**
 * 获取用户地址列表
 */
const getAddressList = () => {
  const params = {
    url: '/mall4cloud_user/user_addr/list',
    method: 'GET',
    data: {}
  }
  http.request(params).then((res) => {
    Data.addressList = res
  })
}

/**
 * 处理选择地址
 */
const handleSelectAddress = (addressItem) => {
  console.log('handleSelectAddress called, isSelectMode:', isSelectMode.value)
  if (!isSelectMode.value) {
    console.log('Not in select mode, returning')
    return
  }

  const addressData = {
    consignee: addressItem.consignee,
    mobile: addressItem.mobile,
    province: addressItem.province,
    city: addressItem.city,
    district: addressItem.area,
    area: addressItem.area,
    addr: addressItem.addr,
    addrId: addressItem.addrId,
    isDefault: addressItem.isDefault
  }

  console.log('addressData to emit:', addressData)
  console.log('eventChannel:', eventChannel)

  if (eventChannel && eventChannel.emit) {
    console.log('Emitting selectAddress event')
    eventChannel.emit('selectAddress', addressData)
  } else {
    console.log('eventChannel.emit not available')
  }

  uni.navigateBack()
}

/**
 * 取消选择
 */
const cancelSelect = () => {
  uni.navigateBack()
}

// 去编辑地址
const toEditAddress = (addrId) => {
  uni.navigateTo({
    url: '/pages/edit-address/edit-address?addrId=' + addrId
  })
}

/**
 * 新建地址
 */
const addAddress = () => {
  if (Data.addressList.length === 10) {
    uni.showToast({
      title: $t('addNewAddressTips'),
      icon: 'none'
    })
  } else {
    uni.navigateTo({
      url: '/pages/edit-address/edit-address'
    })
  }
}

</script>

<style lang="scss" scoped>
.page-address-list {
  padding-bottom: env(safe-area-inset-bottom);

  .list-box {
    padding-bottom: 120rpx;
  }

  .list-box .item {
    display: flex;
    padding: 30rpx;
    background: #fff;
    position: relative;
  }

  .list-box .item.select-mode {
    background: #fafafa;
  }

  .list-box .item.select-mode:active {
    background: #f0f0f0;
  }

  .list-box .item::after {
    position: absolute;
    bottom: 0;
    left: 30rpx;
    right: 30rpx;
    display: block;
    height: 2rpx;
    content: " ";
    font-size: 0;
    background: #f9f9f9;
  }

  .list-box .item .text-box {
    flex: 1;
    margin-right: 20rpx;
  }

  .list-box .item .text-box .address {
    line-height: 36rpx;
    font-weight: 600;
    font-size: 26rpx;
  }

  .list-box .item .text-box .address .default-flag {
    padding: 0 6rpx;
    background: #fc1b35;
    border-radius: 4rpx;
    color: #fff;
    font-size: 18rpx;
    margin-right: 10rpx;
    display: inline-block;
    height: 24rpx;
    line-height: 24rpx;
    vertical-align: top;
    margin-top: 6rpx;
  }

  .list-box .item .text-box .name-phone {
    display: flex;
    align-items: center;
    margin-top: 10rpx;
    color: #999;
  }

  .list-box .item .text-box .name-phone .name {
    margin-right: 20rpx;
  }

  .list-box .item .edit-icon {
    font-size: 0;
    width: 24rpx;
    height: 24rpx;
    margin-top: 6rpx;
  }

  .list-box .item .select-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx 20rpx;
    background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
    border-radius: 30rpx;
    margin-top: 6rpx;
  }

  .list-box .item .select-icon .select-icon-text {
    font-size: 24rpx;
    color: #fff;
    font-weight: 500;
  }

  .new-address {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20rpx 30rpx;
    height: 70rpx;
    line-height: 70rpx;
  }

  .new-address .btn {
    color: #fff;
    font-size: 26rpx;
    font-weight: 600;
    text-align: center;
    background: #fc1b35;
    border-radius: 70rpx;
  }

  .new-address .btn.cancel-btn {
    background: #999;
  }

}
</style>
