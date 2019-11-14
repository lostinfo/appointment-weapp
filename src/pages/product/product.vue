<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">票券详情</block>
    </cu-custom>
    <view v-if="product">
      <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
              :autoplay="true" interval="5000" duration="500" style="height: 750upx">
        <swiper-item>
          <image :src="getPath(product ? product.thumb : '')" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="padding-sm bg-white">
        <text class="text-df text-bold padding-tb-sm">{{product.productName}}</text>
      </view>
      <view class="padding-sm bg-white flex">
        <view class="text-price text-xl text-red text-bold">{{product.shopPriceFormat}}</view>
        <view class="text-sm margin-left text-grey flex-sub">已售 {{product.sold}}</view>
      </view>
      <view class="login-wrap">
        <view class="login-main">
          <view class="cu-form-group margin-top-sm">
            <view class="title">手机号</view>
            <input placeholder="请输入手机号" name="input" :value="buyModel.mobile" data-key="mobile" @change="inputChange">
            <button class="cu-btn bg-green shadow" open-type="getPhoneNumber" @getphonenumber="getMobile">获取手机号</button>
          </view>
          <view class="cu-form-group">
            <view class="title">购买数量</view>
            <stepper :value="buyModel.buy_number" min="1" max="100" @change="buyNumberChange"></stepper>
          </view>
          <view class="cu-form-group">
            <view class="title">优惠券</view>
            <view class="_picker" @tap="showUserCouponModal">
              <view class="picker">
                <text v-if="user_coupon_options.length > 0 && checked_user_coupon_index !== ''" style="color: #555;">
                  <text>{{user_coupon_options[checked_user_coupon_index].coupon_name}}</text>
                  <text class="margin-left-sm">-¥{{user_coupon_options[checked_user_coupon_index].coupon_value}}</text>
                </text>
                <text v-else class="text-grey">{{user_coupon_options.length > 0 ? '点击选择优惠券' : '无可用优惠券'}}</text>
              </view>
            </view>
          </view>
        </view>
        <view v-if="!user" class="login-notice">
          <navigator hover-class="none" url="/pages/login/login" open-type="navigate" class="padding-sm bg-wathet radius">请登陆后再操作</navigator>
        </view>
      </view>
      <view class="margin-top-sm bg-white" style="padding-bottom: calc(100upx + env(safe-area-inset-bottom) / 2);">
        <view class="padding-tb-sm text-df text-bold text-black margin-left-sm">
          滑雪票拍前必看
        </view>
        <view class="padding-lr-sm padding-bottom-sm">
          <Article code="skiing_ticket_notice"></Article>
        </view>
      </view>
      <view class="cu-bar bg-white tabbar border shop foot bg-white">
        <button class="action" open-type="contact">
          <view class="cuIcon-service text-green">
            <!--            <view class="cu-tag"></view>-->
          </view>
          客服
        </button>
        <view class="bg-white submit"><text class="text-price text-xl text-red text-bold">{{total_amount}}</text></view>
        <view class="bg-red submit" @tap="buy">立即购买</view>
      </view>
    </view>
    <view class="cu-modal bottom-modal" :class="show_user_coupon_modal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white">
          <view class="action text-blue" @tap="hideUserCouponModal">取消</view>
          <view class="action flex-sub">选择优惠券</view>
          <view class="action text-green" @tap="checkedUserCoupon">确定</view>
        </view>
        <view class="padding-sm" style="height: 800upx; overflow-y: scroll;-webkit-overflow-scrolling: touch">
          <radio-group class="block" @change="userCouponChange">
            <view class="cu-list menu">
              <view class="cu-item" v-for="(item,index) in user_coupon_options" :key="index">
                <view class="content padding-tb-sm">
                  <view class="flex justify-between">
                    <view class="text-black">{{item.coupon_name}}</view>
                    <view class="text-red text-price">{{item.coupon_value}}</view>
                  </view>
                  <view class="text-grey text-sm text-left">
                    <text class="margin-right-xs">有效期 {{item.true_at}}</text>
                  </view>
                </view>
                <view class="action">
                  <radio class="round" style="transform: scale(0.8)" :class="checked_user_coupon_index === index ? 'checked' : ''" :checked="checked_user_coupon_index === index"
                         :value="index"></radio>
                </view>
              </view>
              <view v-if="user_coupon_options.length < 1" class="padding-sm">
                <text class="text-grey text-center">暂无可用优惠券</text>
              </view>
            </view>
          </radio-group>
        </view>
      </view>
    </view>
    <view class="cu-modal" :class="show_form_errors?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">提示信息</view>
          <view class="action" @tap="hideFormErrors">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          <view v-for="(error, index) in form_errors" :key="index">
            <text class="text-gray align-center">{{error.message}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import mixin from '../../utils/mixin'
  import stepper from '../../components/stepper'
  import AsyncValidator from 'async-validator'
  import Article from '../../components/article'

  export default {
    name: "product",
    mixins: [mixin],
    data() {
      return {
        id: null,
        product: null,
        buyModel: {
          id: '',
          mobile: '',
          buy_number: 1,
          user_coupon_id: '',
          user_coupon_value: 0,
        },
        buyRules: {
          buy_number: [
            {required: true, message: '请选择购买数量'},
            {type: 'number', min: 1, max: 999, message: '购买数量是数字且在1到999之间'},
          ],
          mobile: [
            {required: true, message: '请填写手机号码',},
            {type: 'string', len: 11, message: '手机号无效'},
          ],
        },
        show_form_errors: false,
        form_errors: [],
        user_coupon_options: [],
        checked_user_coupon_index: 0,
        show_user_coupon_modal: false,
      }
    },
    components: {
      stepper,
      Article,
    },
    computed: {
      total_amount() {
        return this.product ? this.product.shopPrice * this.buyModel.buy_number - this.buyModel.user_coupon_value : ''
      },
      user() {
        return this.$store.state.user
      },
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
        this.getProduct()
      }
    },
    onShow() {

    },
    methods: {
      getProduct() {
        let that = this
        uni.showLoading()
        that.$http.get('/products/' + that.id).then(res => {
          uni.hideLoading()
          that.product = res
          that.buyModel.id = that.product.id
          that.$store.dispatch('waitLogin').then(() => {
            that.$http.get('/user-coupons/options/' + res.resourceId).then(res2 => {
              that.user_coupon_options = res2
              if (res2.length > 0) {
                that.buyModel.user_coupon_id = res2[0].id
                that.buyModel.user_coupon_value = res2[0].coupon_value
              }
            })
          })
        })
      },
      inputChange(e) {
        let that = this
        let key = e.currentTarget.dataset.key
        let type = e.currentTarget.dataset.type !== undefined ? e.currentTarget.dataset.type : 'string'
        let value = e.detail.value
        switch (type) {
          case 'string':
            value = value.toString()
            break
          case 'int':
            value = parseInt(value)
            break
          case 'float':
            value = parseFloat(value)
            break
        }
        that.buyModel[key] = value
      },
      getMobile(e) {
        let that = this
        let err_msg = e.detail.errMsg
        let encrypted_data = e.detail.encryptedData
        let iv = e.detail.iv
        if (err_msg != "getPhoneNumber:ok") {
          uni.showToast({
            icon: 'none',
            title: '获取手机号失败',
          })
          return
        }
        that.$http.post('/user/decrypt/mobile', {
          encrypted_data: encrypted_data,
          iv: iv,
        }).then(res => {
          that.buyModel.mobile = res.mobile
          uni.showToast({
            icon: 'none',
            title: '获取手机号成功',
          })
        })
      },
      buyNumberChange(number) {
        this.buyModel.buy_number = number
      },
      showUserCouponModal() {
        let that = this
        that.show_user_coupon_modal = true
      },
      userCouponChange(e) {
        let that = this
        that.checked_user_coupon_index = e.detail.value
        that.buyModel.user_coupon_id = that.user_coupon_options[that.checked_user_coupon_index].id
        that.buyModel.user_coupon_value = that.user_coupon_options[that.checked_user_coupon_index].coupon_value
      },
      hideUserCouponModal() {
        let that = this
        that.show_user_coupon_modal = false
      },
      checkedUserCoupon() {
        let that = this
        if (that.checked_user_coupon_index === '') {
          uni.showToast({
            icon: 'none',
            title: '请选择优惠券'
          })
          return false
        }
        that.show_user_coupon_modal = false
        //  todo to confirm order page

      },
      buy() {
        let that = this
        //  checkLogin
        if (!that.$store.state.user) {
          uni.navigateTo({
            url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/product/product?id=' + that.id),
          })
          return false
        }
        uni.showLoading({
          mask: true
        })
        let validator = new AsyncValidator(that.buyRules)
        validator.validate(that.buyModel, {}, (errors, fields) => {
          if (errors) {
            uni.hideLoading()
            that.form_errors = errors
            that.show_form_errors = true
            return false
          }
          that.$http.post('/orders', that.buyModel).then(res => {
            that.pay('/orders/' + res.id + '/pay').then(() => {
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/order/order?id=' + res.id
                })
              }, 2000)
            }).catch(() => {
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/order/order?id=' + res.id
                })
              }, 2000)
            })
          })
        })
      },
      hideFormErrors() {
        this.show_form_errors = false
        this.form_errors = []
      },
    },
  }
</script>

<style scoped>
  .cu-form-group .title {
    min-width: calc(4em + 15px);
  }
</style>