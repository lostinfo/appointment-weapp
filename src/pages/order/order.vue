<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">我的票券详情</block>
    </cu-custom>
    <view v-if="order" class="padding-bottom-sm">
      <view class="bg-white radius margin-lr-sm margin-top-sm">
        <view class="cu-bar padding-lr solid-bottom">
          <view class="flex-sub text-bold">{{order.orderId}}</view>
          <view class="text-red">{{order.orderStatusTxt}}</view>
        </view>
        <view class="padding-sm flex">
          <image :src="getPath(order ? order.product_thumb : '')" mode="aspectFill" class="radius"
                 style="width: 150upx;height: 150upx;background-color: #8799a3;"></image>
          <view class="flex-sub margin-lr-sm">
            <view class="text-black product-name">{{order.productName}}</view>
            <view class="text-grey text-sm">下单时间：{{order.created_at}}</view>
            <view class="text-grey text-sm" v-if="order.payed_at">支付时间：{{order.payed_at}}</view>
            <view class="text-red text-sm" v-if="order.orderStatus == 10">请支付订单，超时将自动取消</view>
          </view>
          <view class="text-right">
            <view class="text-price text-red">{{order.shopPrice}}</view>
            <view class="text-grey">x{{order.orderQuantity}}</view>
          </view>
        </view>
      </view>
      <view class="bg-white radius margin-lr-sm margin-top-sm" v-if="order.orderStatus == 20">
        <view class="cu-bar solid-bottom">
          <view class="action text-bold">票券二维码</view>
        </view>
        <view class="padding-sm flex flex-direction align-center">
          <view class="ticket-load">
            <image src="/static/logo-simple.png" mode="aspectFit"></image>
          </view>
          <text class="text-grey">正在出票中...</text>
        </view>
      </view>
      <view class="bg-white radius margin-lr-sm margin-top-sm" v-if="order.orderStatus == 30">
        <view class="cu-bar solid-bottom">
          <view class="action text-bold">票券二维码</view>
        </view>
        <view class="padding-sm flex flex-direction align-center">
          <view style="height: 300px">
            <canvas class='qrcode' style='width: 300px; height: 300px;' canvas-id="qrcode"/>
          </view>
          <text class="text-grey text-df">扫描二维码入场</text>
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
            <view class="flex flex-sub text-black text-content">{{order.orderStatusTxt}}</view>
          </view>
          <view class="flex" v-if="order.refundStatus != null">
            <view class="text-grey text-content" style="width: 200upx;">退款状态</view>
            <view class="flex flex-sub text-black text-content">{{order.refundStatusTxt}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">订单金额</view>
            <view class="flex flex-sub text-black text-content">{{order.orderPrice}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">优惠金额</view>
            <view class="flex flex-sub text-black text-content">{{order.discount}}</view>
          </view>
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">支付金额</view>
            <view class="flex flex-sub text-black text-content">{{order.payPrice}}</view>
          </view>
          <view class="flex" v-if="order.canceled_at">
            <view class="text-grey text-content" style="width: 200upx;">取消时间</view>
            <view class="flex flex-sub text-black text-content">{{order.canceled_at}}</view>
          </view>
          <view class="flex" v-if="order.payed_at">
            <view class="text-grey text-content" style="width: 200upx;">支付时间</view>
            <view class="flex flex-sub text-black text-content">{{order.payed_at}}</view>
          </view>
          <view class="flex" v-if="order.used_at">
            <view class="text-grey text-content" style="width: 200upx;">使用时间</view>
            <view class="flex flex-sub text-black text-content">{{order.used_at}}</view>
          </view>
        </view>
      </view>
      <view class="bg-white radius margin-lr-sm margin-top-sm" v-if="order.is_deposit">
        <view class="cu-bar solid-bottom">
          <view class="action text-bold">押金信息</view>
        </view>
        <view class="padding-sm">
          <view class="flex">
            <view class="text-grey text-content" style="width: 200upx;">押金金额</view>
            <view class="flex flex-sub text-black text-content">{{order.deposit_price}}</view>
          </view>
          <view class="flex" v-if="order.orderStatus == 40">
            <view class="text-grey text-content" style="width: 200upx;">退还状态</view>
            <view class="flex flex-sub text-black text-content">{{order.deposit_status ? '已退还' : '待退还'}}</view>
          </view>
        </view>
      </view>
      <view class="margin-top-sm margin-lr-sm">
        <button class="cu-btn block lg bg-wathet" v-if="order.orderStatus == 10" @tap="payOrder" >
          支付订单
        </button>
        <button class="cu-btn block lg line-green text-green margin-top" v-if="order.orderStatus == 10" @tap="cancelOrder">
          取消订单
        </button>
        <button class="cu-btn block lg bg-grey margin-top" v-if="order.orderStatus == 30 && order.refundStatus == null" @tap="refundOrder">
          申请退款
        </button>
      </view>
    </view>
  </view>
</template>

<script>
  import mixin from '../../utils/mixin'
  import QR from '../../utils/qrcode'

  export default {
    name: "order",
    mixins: [mixin],
    data() {
      return {
        order: null,
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
    created() {

    },
    mounted() {

    },
    methods: {
      getOrder() {
        let that = this
        uni.showLoading()
        that.protectedGetOrder().then(res => {
          uni.hideLoading()
          that.order = res
          if (that.order.orderStatus == 30) {
            QR.qrApi.draw(that.order.orderCode, "qrcode", 300, 300)
          }
          if (that.order.orderStatus == 20) {
            that.syncOrderCode()
          }
        })
      },
      syncOrderCode() {
        let that = this
        let timeout = 0
        let sh = setInterval(() => {
          timeout++
          that.protectedGetOrder().then(res => {
            if (res.orderStatus != 20) {
              that.order = res
              clearInterval(sh)
            }
            if (timeout > 30) {
              uni.showToast({
                icon: 'none',
                title: '请稍后再试'
              })
              clearInterval(sh)
            }
          }).catch(() => {
            clearInterval(sh)
          })
        }, 2000)
      },
      protectedGetOrder() {
        let that = this
        return new Promise((resolve, reject) => {
          that.$http.get('/orders/' + that.id).then(res => {
            resolve(res)
          }).catch(err => {
            reject(err)
          })
        })
      },
      payOrder() {
        let that = this
        that.pay('/orders/'+that.id+'/pay').then(res => {
          setTimeout(() => {
            that.getOrder()
          }, 2000)
        }).catch(err => {
          console.log(err)
        })
      },
      cancelOrder() {
        let that = this
        uni.showLoading()
        that.$http.post('/orders/' + that.id + '/cancel').then(res => {
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
        that.$http.post('/orders/' + that.id + '/refund').then(res => {
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
  .ticket-load {
    position: relative;
    width: 260upx;
    height: 260upx;
    background-color: #ffffff;
    border-radius: 10upx;
    /*box-shadow: 0 0 0upx 2000upx rgba(0, 0, 0, 0.5);*/
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    font-size: 28upx;
    z-index: 9999;
    line-height: 2.4em;
  }
  .ticket-load image {
    width: 150upx;
    height: 150upx;
  }
  .ticket-load::after {
    content: "";
    position: absolute;
    background-color: #ffffff;
    border-radius: 50%;
    width: 200upx;
    height: 200upx;
    font-size: 10px;
    border-top: 6upx solid rgba(0, 0, 0, 0.05);
    border-right: 6upx solid rgba(0, 0, 0, 0.05);
    border-bottom: 6upx solid rgba(0, 0, 0, 0.05);
    border-left: 6upx solid #f37b1d;
    animation: cuIcon-spin 1s infinite linear;
    z-index: -1;
  }
</style>