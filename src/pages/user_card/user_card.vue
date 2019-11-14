<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">我的季卡详情</block>
    </cu-custom>
    <view v-if="user_card" class="padding-bottom-sm">
      <view class="bg-white radius margin-lr-sm margin-top-sm">
        <view class="cu-bar padding-lr solid-bottom">
          <view class="flex-sub text-bold">{{user_card.pay_sn}}</view>
          <view class="text-red">{{user_card.pay_status_label}}</view>
        </view>
        <view class="padding-sm flex">
          <image :src="getPath(user_card ? user_card.card_thumb : '')" mode="aspectFill" class="radius"
                 style="width: 150upx;height: 150upx;background-color: #8799a3;"></image>
          <view class="flex-sub margin-lr-sm">
            <view class="text-black product-name">{{user_card.card_name}}</view>
            <view class="text-grey text-sm">下单时间：{{user_card.created_at}}</view>
            <view class="text-grey text-sm" v-if="user_card.payed_at">支付时间：{{user_card.payed_at}}</view>
            <view class="text-red text-sm" v-if="user_card.pay_status == 10">请支付订单，超时将自动取消</view>
          </view>
          <view class="text-right">
            <view class="text-price text-red">{{user_card.pay_price}}</view>
          </view>
        </view>
      </view>
      <view class="bg-white radius margin-lr-sm margin-top-sm">
        <view class="cu-bar solid-bottom">
          <view class="action text-bold">成员信息</view>
        </view>
        <view class="cu-list menu-avatar">
          <view class="cu-item" v-for="(people, index) in user_card.user_card_peoples" :index="index">
            <view class="cu-avatar radius lg" :style="'background-image:url(' + getPath(people.idphoto) + ');'" :data-url="getPath(people.idphoto)" @tap="viewIdphoto"></view>
            <view class="content">
              <view class="text-grey"><view class="text-cut">{{people.realname}}</view></view>
              <view class="text-gray text-sm flex"> <view class="text-cut">{{people.idcard}}</view></view>
            </view>
          </view>
        </view>
      </view>
      <view class="margin-top-sm margin-lr-sm">
        <button class="cu-btn block lg bg-wathet" v-if="user_card.pay_status == 10" @tap="payUserCard" >
          支付订单
        </button>
        <button class="cu-btn block lg line-green text-green margin-top" v-if="user_card.pay_status == 10" @tap="cancelUserCard">
          取消订单
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  import mixin from '../../utils/mixin'
  
  export default {
    name: "user_card",
    mixins: [mixin],
    data() {
      return {
        user_card: null,
      }
    },
    onLoad(options) {
      if (options.id == undefined) {
        uni.showToast({
          icon: 'none',
          title: '参数错误'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      } else {
        this.id = options.id
        this.getUserCard()
      }
    },
    onPullDownRefresh() {
      let that = this
      that.getUserCard()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    created() {

    },
    mounted() {

    },
    methods: {
      getUserCard() {
        let that = this
        uni.showLoading()
        that.$http.get('/user-cards/' + that.id).then(res => {
          uni.hideLoading()
          that.user_card = res
        })
      },
      payUserCard() {
        let that = this
        that.pay('/user-cards/'+that.id+'/pay').then(res => {
          setTimeout(() => {
            that.getUserCard()
          }, 1000)
        }).catch(err => {
          console.log(err)
        })
      },
      cancelUserCard() {
        let that = this
        uni.showLoading()
        that.$http.post('/user-cards/' + that.id + '/cancel').then(res => {
          uni.hideLoading()
          uni.showToast({
            title: '取消成功'
          })
          setTimeout(() => {
            that.getUserCard()
          }, 2000)
        })
      },
      viewIdphoto(e) {
        let that = this
        uni.previewImage({
          urls: [e.currentTarget.dataset.url],
          current: e.currentTarget.dataset.url
        })
      },
    },
  }
</script>

<style scoped>

</style>