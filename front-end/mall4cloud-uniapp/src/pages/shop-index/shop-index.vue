<template>
  <view class="page-shop-index">
    <view class="shop-index">
      <!-- 头部 -->
      <view class="header">
        <view class="bg">
          <image
            v-if="shopInfo.mobileBackgroundPic"
            :src="util.getImgUrl(shopInfo.mobileBackgroundPic)"
          />
          <image
            v-else
            src="/static/img/banner3.png"
          />
        </view>
      </view>
      <!-- 店铺信息 -->
      <view class="shop-info">
        <view class="logo">
          <image :src="util.getImgUrl(shopInfo.shopLogo)" />
        </view>
        <view class="text-box">
          <view class="name">
            {{ shopInfo.shopName }}
          </view>
          <view class="focus-box">
            <view
              v-if="shopInfo.type === 1"
              class="self"
            >
              自营
            </view>
          </view>
        </view>
      </view>
      <view class="shop-des">
        {{ shopInfo.intro }}
      </view>

      <!-- 广告 -->
      <view class="shop-adv" />

      <!-- 店铺热销 -->
      <view class="shop-prods">
        <view class="shop-tit">
          <view class="text">
            店铺热销
          </view>
        </view>
        <view class="prods">
          <block
            v-for="(item,index) in prodList"
            :key="index"
          >
            <view
              class="item"
              @tap="detail(item.spuId)"
            >
              <view class="img">
                <image :src="util.getImgUrl(item.mainImgUrl)" />
              </view>
              <view class="text-box">
                <view class="name">
                  {{ item.spuName }}
                </view>
                <!-- <view class="sku">夏季换新 银色 256g</view> -->
                <view class="price-box">
                  <view class="price">
                    <view class="symbol">
                      ￥
                    </view>
                    <view class="big">
                      {{ price(item.priceFee) }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </block>
        </view>
        <view class="nomore">
          没有更多了，看看别的吧
        </view>
      </view>
    </view>

    <!-- 自定义tabbar -->
    <diy-tabbar :current-index="0" @change="handleTabChange" />
  </view>
</template>

<script setup>
import { reactive } from 'vue'
import util from '@/utils/util.js'

const Data = reactive({
  isCollect: false, // 是否收藏
  shopId: 1,
  shopInfo: {},
  pageNum: 1,
  pageSize: 8,
  total: 1,
  pages: 1,
  prodList: []
})
const { shopInfo, prodList } = toRefs(Data)

onReachBottom(() => {
  if (Data.pageNum < Data.pages) {
    Data.pageNum++
    getProd()
  }
})

onLoad((options) => {
  Data.shopId = options.shopId
  getShopInfo()
  getProd()
})

const price = (value) => {
  return (value / 100).toFixed(2)
}

// 去商品详情
const detail = (spuId) => {
  uni.navigateTo({
    url: '/pages/detail/detail?spuId=' + spuId
  })
}

/**
     * 获取店铺信息
     */
const getShopInfo = () => {
  const params = {
    url: '/mall4cloud_multishop/ua/shop_detail/head_info',
    method: 'GET',
    data: {
      shopId: Data.shopId
    }
  }
  http.request(params).then(res => {
    Data.shopInfo = res
    uni.setStorageSync('cloudShopInfo', res)
  })
}

/**
     * 获取商品列表
     */
const getProd = () => {
  const params = {
    url: '/mall4cloud_search/ua/search/simple_page',
    method: 'GET',
    data: {
      shopId: Data.shopId,
      pageNum: Data.pageNum,
      pageSize: Data.pageSize
    }
  }
  http.request(params).then(res => {
    if (Data.pageNum !== 1) {
      Data.prodList = Data.prodList.concat(res.list[0].spus)
    } else {
      Data.prodList = res.list[0].spus
    }
    Data.total = res.total
    Data.pages = res.pages
  })
}

// 切换tabbar
const handleTabChange = ({ index }) => {
  console.log('切换到tab:', index)
}
</script>

<style lang="scss" scoped>
@use "shop-index";
</style>
