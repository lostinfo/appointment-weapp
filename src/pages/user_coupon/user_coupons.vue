<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">我的优惠券</block>
    </cu-custom>
    <view class="margin-lr-sm margin-top-sm" v-for="(user_coupon, index) in user_coupons" :key="index">
      <view class="bg-white radius padding-sm flex text-white">
        <view class="flex-sub flex align-center padding-tb-sm padding-left-sm bg-wathet" style="border-radius: 20upx;border-right: 2px dashed #FFFFFF;">
          <view class="flex-sub">
            <view style="display:table-cell;vertical-align: bottom;">
              <text class="text-price text-xxl" style="width: 200upx;display: inline-block;">{{user_coupon.coupon_value}}</text>
              <text>{{user_coupon.coupon_name}}</text>
            </view>
            <view class="margin-top">{{user_coupon.products.length > 0 ? '限部分票券' : '不限票券'}}</view>
            <view class="text-sm">有效期 {{user_coupon.true_at}}</view>
          </view>
        </view>
        <view class="bg-wathet radius flex align-center justify-center" style="width: 150upx;border-radius: 20upx;">
          <navigator class="cu-item arrow" hover-class="none" url="/pages/product/products" open-type="switchTab" v-if="user_coupon.coupon_status == 0">
            <button class="cu-btn line-white">去使用</button>
          </navigator>
          <view v-if="user_coupon.coupon_status == 1">
            <img src="/static/icon_used.png" style="width: 100upx;height: 100upx;"  alt="">
          </view>
          <view v-if="user_coupon.coupon_status == 2">
            <img src="/static/icon_invalid.png" style="width: 100upx;height: 100upx;" alt="">
          </view>
        </view>
      </view>
    </view>
    <loadMore :loading="loading" :has-more="has_more"></loadMore>
  </view>
</template>

<script>
  import loadMore from '../../components/loadMore'
  import mixin from '../../utils/mixin'

  export default {
    name: "user_coupons",
    mixins: [mixin],
    data() {
      return {
        user_coupons: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        empty: false,
        loading: false,
      }
    },
    components: {
      loadMore
    },
    computed: {
      has_more: function () {
        let that = this
        return that.currentPage * that.pageSize < that.total
      },
    },
    onReachBottom() {
      this.loadMore()
    },
    onPullDownRefresh() {
      let that = this
      that.pageInit()
      that.getUserCoupons()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    mounted() {
      let that = this
      that.getUserCoupons()
    },
    methods: {
      pageInit() {
        let that = this
        that.user_coupons = []
        that.currentPage = 1
        that.pageSize = 15
        that.total = 0
        that.page_empty = false
        that.page_loading = false
      },
      loadMore() {
        let that = this
        if (!that.has_more) return
        that.currentPage++
        that.getUserCoupons()
      },
      getUserCoupons() {
        let that = this
        that.loading = true
        let query = {
          page_size: that.pageSize,
          page: that.currentPage,
        }
        that.$http.get('/user-coupons', query).then(res => {
          that.loading = false
          that.user_coupons = that.user_coupons.concat(res.data)
          that.total = res.total
          that.currentPage = res.current_page
        }).catch(err => {
          that.loading = false
        })
      },
    },
  }
</script>

<style scoped>

</style>