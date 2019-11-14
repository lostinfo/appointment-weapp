<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">我的教学详情</block>
    </cu-custom>
    <view v-if="order" class="padding-bottom-sm">
      <view class="bg-white radius margin-lr-sm margin-top-sm">
        <view class="cu-bar padding-lr solid-bottom">
          <view class="flex-sub text-bold">{{order.sn}}</view>
          <view class="text-red">{{order.order_status_label}}</view>
        </view>
        <view class="padding-sm flex">
          <image :src="order.instruction_product_pic" mode="aspectFill" class="radius"
                 style="width: 150upx;height: 150upx"></image>
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
      <view class="bg-white radius margin-lr-sm margin-top-sm" v-if="order.order_status == 30">
        <view class="padding-lr flex flex-direction align-center">
          <view class="text-sl text-bold text-green text-center margin-tb" style="letter-spacing: 5px;">{{order.teaching_code}}</view>
          <view class="text-sm text-grey text-center margin-bottom-sm">教学验证码</view>
        </view>
      </view>
      <view class="bg-white radius margin-lr-sm margin-top-sm">
        <view class="cu-bar solid-bottom">
          <view class="action text-bold">订单信息</view>
        </view>
        <view class="padding-sm">
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">下单日期</view>
            <view class="flex flex-sub text-black text-content">{{order.created_at}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">订单状态</view>
            <view class="flex flex-sub text-black text-content">{{order.order_status_label}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">订单金额</view>
            <view class="flex flex-sub text-black text-content">{{order.order_amount}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">优惠金额</view>
            <view class="flex flex-sub text-black text-content">{{order.discount}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">支付金额</view>
            <view class="flex flex-sub text-black text-content">{{order.pay_amount}}</view>
          </view>
          <view class="flex" v-if="order.canceled_at">
            <view class="text-grey text-content" style="width: 200upx;">取消时间</view>
            <view class="flex flex-sub text-black text-content">{{order.canceled_at}}</view>
          </view>
          <view class="flex" v-if="order.payed_at">
            <view class="text-grey text-content" style="width: 200upx;">支付时间</view>
            <view class="flex flex-sub text-black text-content">{{order.payed_at}}</view>
          </view>
          <view class="flex" v-if="order.confirmed_at">
            <view class="text-grey text-content" style="width: 200upx;">确认接单时间</view>
            <view class="flex flex-sub text-black text-content">{{order.confirmed_at}}</view>
          </view>
          <view class="flex" v-if="order.successed_at">
            <view class="text-grey text-content" style="width: 200upx;">订单完成时间</view>
            <view class="flex flex-sub text-black text-content">{{order.successed_at}}</view>
          </view>
        </view>
      </view>
      <view class="bg-white radius margin-lr-sm margin-top-sm" v-if="order.instruction_order_refunds.length > 0">
        <view class="cu-bar solid-bottom">
          <view class="action text-bold">退款信息</view>
        </view>
        <view class="padding-sm">
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">退款金额</view>
            <view class="flex flex-sub text-black text-content">{{order.instruction_order_refunds[0].refund_amount}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">退款状态</view>
            <view class="flex flex-sub text-black text-content">{{order.instruction_order_refunds[0].refund_status_label}}</view>
          </view>
        </view>
      </view>
      <view class="margin-top-sm margin-lr-sm">
        <button class="cu-btn block lg bg-wathet" v-if="order.order_status == 10" @tap="payOrder">
          支付订单
        </button>
        <button class="cu-btn block lg line-green text-green margin-top" v-if="order.order_status == 10" @tap="cancelOrder">
          取消订单
        </button>
        <button class="cu-btn block lg bg-grey margin-top" v-if="(order.order_status == 20 || order.order_status == 30) && order.new_refund_count < 1" @tap="refundOrder">
          申请退款
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "order",
    data() {
      return {
        id: null,
        order: null
      }
    },
    created() {

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
        this.getOrder()
      }
    },
    onPullDownRefresh() {
      let that = this
      that.getOrder()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    mounted() {

    },
    methods: {
      getOrder() {
        let that = this
        uni.showLoading()
        that.$http.get('/instruction-orders/' + that.id).then(res => {
          uni.hideLoading()
          that.order = res
        })
      },
      payOrder() {
        let that = this
        that.pay('/instruction-orders/'+that.id+'/pay').then(res => {
          setTimeout(() => {
            that.getOrder()
          }, 1000)
        }).catch(err => {
          console.log(err)
        })
      },
      cancelOrder() {
        let that = this
        uni.showLoading()
        that.$http.post('/instruction-orders/' + that.id + '/cancel').then(res => {
          uni.hideLoading()
          uni.showToast({
            title: '取消成功'
          })
          setTimeout(() => {
            that.getOrder()
          }, 2000)
        })
      },
      refundOrder() {
        let that = this
        uni.showLoading()
        that.$http.post('/instruction-orders/' + that.id + '/refund').then(res => {
          uni.hideLoading()
          uni.showToast({
            title: '申请退款成功'
          })
          setTimeout(() => {
            that.getOrder()
          }, 2000)
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