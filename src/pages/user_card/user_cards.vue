<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">我的季卡</block>
    </cu-custom>
    <navigator class="margin-lr-sm margin-top-sm radius" v-for="(user_card, index) in user_cards" :key="index"
               :url="'/pages/user_card/user_card?id=' + user_card.id"
               hover-class="none">
      <view class="bg-white">
        <view class="cu-bar padding-lr solid-bottom">
          <view class="flex-sub text-bold">{{user_card.pay_sn}}</view>
          <view class="text-red">{{user_card.pay_status_label}}</view>
        </view>
        <view class="padding-sm flex">
          <image :src="getPath(user_card.card_thumb)" mode="aspectFill" class="radius"
                 style="width: 150upx;height: 150upx;background-color: #8799a3;"></image>
          <view class="flex-sub margin-lr-sm">
            <view class="text-black product-name">{{user_card.card_name}}</view>
            <view class="text-grey text-sm">下单时间：{{user_card.created_at}}</view>
            <view class="text-grey text-sm" v-if="user_card.payed_at">支付时间：{{order.payed_at}}</view>
            <view class="text-red text-sm" v-if="user_card.pay_status == 10">请支付订单，超时将自动取消</view>
          </view>
          <view class="text-right">
            <view class="text-price text-red">{{user_card.pay_price}}</view>
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
    name: "user_cards",
    mixins: [mixin],
    data() {
      return {
        user_cards: [],
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
      that.getUserCards()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    mounted() {
      let that = this
      that.getUserCards()
    },
    methods: {
      pageInit() {
        let that = this
        that.user_cards = []
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
        that.getUserCards()
      },
      getUserCards() {
        let that = this
        that.loading = true
        let query = {
          page_size: that.pageSize,
          page: that.currentPage,
        }
        that.$http.get('/user-cards', query).then(res => {
          that.loading = false
          that.user_cards = that.user_cards.concat(res.data)
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