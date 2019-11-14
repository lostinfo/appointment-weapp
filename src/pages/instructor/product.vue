<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">教学详情</block>
    </cu-custom>
    <view v-if="product">
      <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
              :autoplay="true" interval="5000" duration="500" style="height: 750upx">
        <swiper-item>
          <image :src="getPath(product ? product.picture : '')" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="padding-sm bg-white">
        <text class="text-df text-bold padding-tb-sm">{{product.name}}</text>
      </view>
      <view class="padding-sm bg-white flex">
        <view class="text-price text-xl text-red text-bold">{{product.price}}</view>
        <view class="text-sm margin-left text-grey flex-sub">已售 {{product.sold}}</view>
      </view>
      <view class="cu-form-group margin-top-sm">
        <view class="title">手机号</view>
        <input placeholder="请输入手机号" name="input" :value="buyModel.mobile" data-key="mobile" @change="inputChange">
        <button class="cu-btn bg-green shadow" open-type="getPhoneNumber" @getphonenumber="getMobile">获取手机号</button>
      </view>
      <view class="cu-form-group">
        <view class="title">教学教练</view>
        <view class="_picker" @tap="showInstructorModal">
          <view class="picker">
            <text v-if="checked_instructor_index !== ''" style="color: #555;">{{instructor_options[checked_instructor_index].realname}}</text>
            <text v-else class="text-grey">请选择教学教练</text>
          </view>
        </view>
      </view>
      <view class="cu-form-group">
        <view class="title">预约日期</view>
        <picker mode="date" :value="buyModel.appointment_date" :start="startDate"  @change="appointmentDateChange">
          <view class="picker">
            <text v-if="buyModel.appointment_date" style="color: #555;">{{buyModel.appointment_date}}</text>
            <text v-else class="text-grey">请选择预约日期</text>
          </view>
        </picker>
      </view>
      <view class="cu-form-group">
        <view class="title">购买数量</view>
        <stepper :value="buyModel.buy_number" min="1" max="100" @change="buyNumberChange"></stepper>
      </view>
      <view class="margin-top-sm bg-white" style="padding-bottom: calc(100upx + env(safe-area-inset-bottom) / 2);">
        <view class="padding-tb-sm text-df text-bold text-black margin-left-sm">
          教学预约拍前必看
        </view>
        <view class="padding-lr-sm padding-bottom-sm">
          <rich-text :nodes="product.content_html"></rich-text>
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
    <view class="cu-modal bottom-modal" :class="show_instructor_modal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white">
          <view class="action text-blue" @tap="hideInstructorModal">取消</view>
          <view class="action flex-sub">选择教练</view>
          <view class="action text-green" @tap="checkedInstructor">确定</view>
        </view>
        <view class="padding-sm" style="height: 800upx; overflow-y: scroll;-webkit-overflow-scrolling: touch">
          <radio-group class="block" @change="instructorChange">
            <view class="cu-list menu-avatar">
              <view class="cu-item" v-for="(item,index) in instructor_options" :key="index">
                <view class="cu-avatar lg" :style="'background-image: url(' + getPath(item.id_photos[0]) + ')'"></view>
                <view class="content">
                  <view class="text-grey">
                    <view class="text-black">{{item.realname}}</view>
                    <view class="cu-tag round bg-orange sm">{{item.instructor_level_name}}</view>
                  </view>
                  <view class="text-grey text-sm flex instructor-intro">
                    <text class="text-gray">简介：</text>{{item.intro ? item.intro : ''}}
                  </view>
                </view>
                <view class="action">
                  <radio class="round" style="transform: scale(0.8)" :class="checked_instructor_index === index ? 'checked' : ''" :checked="checked_instructor_index === index"
                         :value="index"></radio>
                </view>
              </view>
              <view v-if="instructor_options.length < 1" class="padding-sm">
                <text class="text-grey text-center">暂无教练可预约</text>
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
  import fecha from 'fecha'
  import AsyncValidator from 'async-validator'

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
          instructor_id: '',
          appointment_date: '',
        },
        buyRules: {
          mobile: [
            {required: true, message: '请填写手机号码',},
            {type: 'string', len: 11, message: '手机号无效'},
          ],
          buy_number: [
            {required: true, message: '请选择购买数量'},
            {type: 'number', min: 1, max: 999, message: '购买数量是数字且在1到999之间'},
          ],
          instructor_id: [
            {required: true, message: '请选择教学教练'},
          ],
          appointment_date: [
            {required: true, message: '请选择预约日期'},
          ],
        },
        instructor_options: [],
        checked_instructor_index: 0,
        show_instructor_modal: false,
        startDate:  fecha.format(new Date(), 'YYYY-MM-DD'),
        show_form_errors: false,
        form_errors: [],
      }
    },
    components: {
      stepper,
    },
    computed: {
      total_amount() {
        return this.product ? this.product.price * this.buyModel.buy_number : ''
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
    methods: {
      getProduct() {
        let that = this
        uni.showLoading()
        that.$http.get('/instruction-products/' + that.id).then(res => {
          uni.hideLoading()
          that.product = res
          that.buyModel.id = that.product.id
          that.getInstructorOptions()
        })
      },
      getInstructorOptions() {
        let that = this
        that.$http.get('/instructor-options', {instruction_product_id: that.product.id}).then(res => {
          that.instructor_options = res
          if (res.length > 0) {
            that.buyModel.instructor_id = res[0].id
          }
        })
      },
      showInstructorModal() {
        let that = this
        that.show_instructor_modal = true
      },
      instructorChange(e) {
        let that = this
        that.checked_instructor_index = e.detail.value
        that.buyModel.instructor_id = that.instructor_options[that.checked_instructor_index].id
      },
      hideInstructorModal() {
        let that = this
        that.show_instructor_modal = false
      },
      checkedInstructor() {
        let that = this
        if (that.checked_instructor_index === '') {
          uni.showToast({
            icon: 'none',
            title: '请选择教练'
          })
          return false
        }
        that.show_instructor_modal = false
        //  todo to confirm order page

      },
      buyNumberChange(number) {
        this.buyModel.buy_number = number
      },
      appointmentDateChange(e) {
        this.buyModel.appointment_date = e.detail.value
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
            title: '获取手机号成功',
          })
        })
      },
      buy() {
        let that = this
        //  checkLogin
        if (!that.$store.state.user) {
          uni.navigateTo({
            url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/instructor/product?id=' + that.id),
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
          that.$http.post('/instruction-orders', that.buyModel).then(res => {
            that.pay('/instruction-orders/' + res.id + '/pay').then(() => {
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/instructor/order?id=' + res.id
                })
              }, 2000)
            }).catch(() => {
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/instructor/order?id=' + res.id
                })
              }, 2000)
            })
          }).catch(err => {
            console.log(err)
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
  .instructor-intro{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .cu-form-group .title {
    min-width: calc(4em + 15px);
  }
</style>