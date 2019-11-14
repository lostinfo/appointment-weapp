<template>
  <view>
    <!--    <cu-custom bgColor="bg-wathet" :isBack="true">-->
    <!--      <block slot="backText">返回</block>-->
    <!--      <block slot="content">活动详情</block>-->
    <!--    </cu-custom>-->
    <view v-if="activity">
      <view class="cu-card case no-card">
        <view class="cu-item shadow">
          <view class="image">
            <image :src="getPath(activity ? activity.image_url : '')"
                   mode="widthFix"></image>
            <view class="cu-tag bg-blue">{{activity.activity_status_label}}</view>
            <view class="cu-bar bg-shadeBottom"> <text class="text-cut">{{activity.name}}</text></view>
          </view>
          <view class="cu-list menu">
            <view class="cu-item">
              <view class="content flex-sub">
                <view class="text-gray text-sm">
                  <text class="cuIcon-locationfill margin-right-sm"></text>{{activity.activity_address}}
                </view>
                <view class="text-gray text-sm flex justify-between">
                  <view clss="flex-sub">
                    <text class="cuIcon-timefill margin-right-sm"></text>{{activity.post_date_range}}
                  </view>
                  <view class="text-gray text-sm">
                    <text class="cuIcon-attentionfill margin-lr-xs"></text> 99
                    <text class="cuIcon-peoplefill margin-lr-xs"></text> 99
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="cu-bar bg-white margin-top-sm">
        <view class="action">
          <text class="cuIcon-title text-wathet text-df"></text>
          <text>活动详情</text>
        </view>
      </view>
      <view class="cu-list menu margin-top-sm">
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-timefill text-grey text-sm"></text>
            <text class="text-grey text-df">
              <text style="display: inline-block; min-width: 6em;">报名时间</text>
              <text class="text-black">{{activity.post_date_range}}</text>
            </text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-timefill text-grey text-sm"></text>
            <text class="text-grey text-df">
              <text style="display: inline-block; min-width: 6em;">活动时间</text>
              <text class="text-black">{{activity.activity_date_range}}</text>
            </text>
          </view>
        </view>
        <view class="cu-item">
          <view class="content">
            <text class="cuIcon-locationfill text-grey text-sm"></text>
            <text class="text-grey text-df">
              <text style="display: inline-block; min-width: 6em;">活动地点</text>
              <text class="text-black">{{activity.activity_address}}</text>
            </text>
          </view>
          <view class="action">
            <button class="cu-btn sm bg-wathet shadow">
              <text class="cuIcon-location"></text> 导航</button>
          </view>
        </view>
      </view>
      <view class="cu-bar bg-white margin-top-sm">
        <view class="action">
          <text class="cuIcon-title text-wathet text-df"></text>
          <text>图文介绍</text>
        </view>
      </view>
      <view class="padding-sm">
        <rich-text :nodes="activity.content_html"></rich-text>
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
  import AsyncValidator from 'async-validator'

  export default {
    name: "activity",
    mixins: [mixin],
    data() {
      return {
        id: null,
        activity: null,
        postModel: {
          id: '',
          mobile: '',
        },
        postRules: {
          mobile: [
            {required: true, message: '请填写手机号码',},
            {type: 'string', len: 11, message: '手机号无效'},
          ],
        },
        show_form_errors: false,
        form_errors: [],
        appointment_type_options: [],
        appointment_type_index: 0,
      }
    },
    components: {

    },
    computed: {
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
        this.getActivity()
      }
    },
    onShow() {

    },
    methods: {
      getActivity() {
        let that = this
        uni.showLoading()
        that.$http.get('/activities/' + that.id).then(res => {
          uni.hideLoading()
          that.activity = res
          uni.setNavigationBarTitle({
            title: res.name
          })
          that.postModel.id = that.activity.id
          that.$store.dispatch('waitLogin').then(() => {
            // todo get user join status
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
        that.postModel[key] = value
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
      submit() {
        let that = this
        //  checkLogin
        if (!that.$store.state.user) {
          uni.navigateTo({
            url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/activity/activity?id=' + that.id),
          })
          return false
        }
        uni.showLoading({
          mask: true
        })
        let validator = new AsyncValidator(that.postRules)
        validator.validate(that.postModel, {}, (errors, fields) => {
          if (errors) {
            uni.hideLoading()
            that.form_errors = errors
            that.show_form_errors = true
            return false
          }
          that.$http.post('/user-activities', that.postModel).then(res => {
            uni.showToast({
              title: '报名成功，请等待审核'
            })
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/user_activity/user_activity?id=' + res.id
              })
            }, 2000)
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