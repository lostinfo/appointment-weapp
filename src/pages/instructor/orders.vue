<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">我的教学</block>
    </cu-custom>
    <scroll-view scroll-x class="bg-white nav fixed" scroll-with-animation :scroll-left="scrollLeft" :style="[{top:CustomBar + 'px'}]">
      <view class="cu-item" :class="index == order_status_index ? 'text-green cur':''" v-for="(order_status, index) in order_status_list" :key="index" @tap="handleOrderStatusChange" :data-index="index">
        {{order_status.label}}
      </view>
    </scroll-view>
    <navigator class="margin-lr-sm margin-top-sm radius" v-for="(order, index) in orders" :key="index"
               :url="'/pages/instructor/order?id=' + order.id"
               hover-class="none">
      <view class="bg-white">
        <view class="cu-bar padding-lr solid-bottom">
          <view class="flex-sub text-bold">{{order.sn}}</view>
          <view class="text-red">{{order.order_status_label}}</view>
        </view>
        <view class="padding-sm flex">
          <image :src="getPath(order.instruction_product_pic)" mode="aspectFill" class="radius"
                 style="width: 150upx;height: 150upx;background-color: #8799a3;"></image>
          <view class="flex-sub margin-lr-sm">
            <view class="text-black product-name">{{order.instruction_product_name}}</view>
            <view class="text-grey text-sm">预约教练：{{order.instructor_realname}}</view>
            <view class="text-grey text-sm">预约日期：{{order.appointment_date}}</view>
          </view>
          <view class="text-right">
            <view class="text-price text-red">{{order.instruction_product_price}}</view>
            <view class="text-grey">x{{order.instruction_product_number}}</view>
          </view>
        </view>
      </view>
    </navigator>
    <loadMore :loading="loading" :has-more="has_more"></loadMore>
  </view>
</template>

<script>
  import loadMore from '../../components/loadMore'
  import mixin from '../../utils/mixin'

  export default {
    name: "orders",
    mixins: [mixin],
    data() {
      return {
        scrollLeft: 0,
        CustomBar: this.CustomBar,
        order_status_list: [
          {
            label: '所有',
            value: ''
          },
          {
            label: '待支付',
            value: 10
          },
          {
            label: '待接单',
            value: 20
          },
          {
            label: '已接单',
            value: 30
          },
          {
            label: '已完成',
            value: 40
          },
          {
            label: '已关闭',
            value: 50,
          },
          {
            label: '售后退款',
            value: 50,
          },
        ],
        order_status_index: 0,
        orders: [],
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
      that.getOrders()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    mounted() {
      let that = this
      that.getOrders()
    },
    methods: {
      pageInit() {
        let that = this
        that.orders = []
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
        that.getOrders()
      },
      handleOrderStatusChange(event) {
        let that = this
        let index = event.currentTarget.dataset.index
        that.order_status_index = index
        this.scrollLeft = index * 60
        that.pageInit()
        that.getOrders()
      },
      getOrders() {
        let that = this
        that.loading = true
        let query = {
          page_size: that.pageSize,
          page: that.currentPage,
          order_status: that.order_status_list[that.order_status_index].value
        }
        that.$http.get('/instruction-orders', query).then(res => {
          that.loading = false
          that.orders = that.orders.concat(res.data)
          that.total = res.total
          that.currentPage = res.current_page
        }).catch(err => {
          that.loading = false
        })
      },
    },
  }
</script>

<style>
  page {
    padding-top: 45px;
  }
</style>

<style scoped>
  .product-name {
    font-size: 28upx;
    font-weight: 600;
    line-height: 40upx;
    height: 80upx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
</style>