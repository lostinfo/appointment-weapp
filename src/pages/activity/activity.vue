<template>
  <view style="position: relative;">
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
            <view class="cu-bar bg-shadeBottom">
              <text>{{activity.name}}</text>
            </view>
          </view>
          <view class="cu-list menu">
            <view class="cu-item">
              <view class="content flex-sub">
                <view class="text-gray text-sm">
                  <text class="cuIcon-locationfill margin-right-sm"></text>
                  <text>{{activity.activity_address}}</text>
                </view>
                <view class="text-gray text-sm flex justify-between">
                  <view clss="flex-sub">
                    <text class="cuIcon-timefill margin-right-sm"></text>
                    <text>{{activity.post_date_range}}</text>
                  </view>
                  <view class="text-gray text-sm">
                    <text class="cuIcon-attentionfill margin-lr-xs"></text>
                    <text>{{activity.view_count}}</text>
                    <text class="cuIcon-peoplefill margin-lr-xs"></text>
                    <text>{{activity.join_count}}</text>
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
      <view class="cu-list menu">
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
            <button class="cu-btn sm bg-wathet shadow" @tap="locationAddress">
              <text class="cuIcon-location"></text>
              导航
            </button>
          </view>
        </view>
      </view>
      <view class="cu-bar bg-white margin-top-sm">
        <view class="action">
          <text class="cuIcon-title text-wathet text-df"></text>
          <text>图文介绍</text>
        </view>
      </view>
      <view class="padding-lr-sm bg-white">
        <rich-text :nodes="activity.content_html"></rich-text>
      </view>
      <view class="cu-bar bg-white margin-top-sm" v-if="join_users.length > 0">
        <view class="action">
          <text class="cuIcon-title text-wathet text-df"></text>
          <text>参与活动用户</text>
        </view>
      </view>
      <view class="bg-white" v-if="join_users.length > 0">
        <view class="grid col-5">
          <view v-for="(join_user, index) in join_users" :key="index">
            <view class="cu-avatar round margin-left"
                  :style="'background-image:url(' + join_user.user_avatar_url + ');'"></view>
            <view class="text-black text-xs padding-lr-xs" style="word-break: break-all">{{join_user.user_nickname}}
            </view>
          </view>
        </view>
        <view class="text-grey text-center padding-tb-sm">总共 {{activity.join_count}} 人参与活动</view>
      </view>
      <view class="cu-bar bg-white margin-top-sm" v-if="scan_user_count > 0">
        <view class="action">
          <text class="cuIcon-title text-wathet text-df"></text>
          <text>我的积攒用户</text>
        </view>
      </view>
      <view class="bg-white" v-if="scan_user_count > 0">
        <view class="grid col-5">
          <view v-for="(scan_user, index) in scan_users" :key="index">
            <view class="cu-avatar round margin-left"
                  :style="'background-image:url(' + scan_user.avatar_url + ');'"></view>
            <view class="text-black text-xs padding-lr-xs" style="word-break: break-all">{{scan_user.nickname}}
            </view>
          </view>
        </view>
        <view class="text-grey text-center padding-tb-sm">总共 {{scan_user_count}} 集赞扫描</view>
      </view>
      <view style="padding-bottom: calc(100upx + env(safe-area-inset-bottom) / 2);"></view>
      <navigator class="cu-bar bg-white tabbar border shop foot bg-white" v-if="!user" hover-class="none"
                 url="/pages/login/login" open-type="navigate">
                <button class="action">
<!--        <button class="action" open-type="share">-->
          <view class="cuIcon-share text-green">
            <!--            <view class="cu-tag"></view>-->
          </view>
          分享
        </button>
        <view class="bg-wathet submit">点击登录参与活动</view>
      </navigator>
      <view class="cu-bar bg-white tabbar border shop foot bg-white" v-else>
        <button class="action" @tap="shareActivity">
          <!--        <button class="action" open-type="share">-->
          <view class="cuIcon-share text-green">
            <!--            <view class="cu-tag"></view>-->
          </view>
          分享
        </button>
        <!--        todo join status-->
        <view class="bg-grey submit" v-if="activity.activity_status == 0">活动未开始</view>
        <view class="bg-wathet submit" v-if="activity.activity_status == 10" @tap="showJoinModal">立即报名</view>
        <view class="bg-grey submit" v-if="activity.activity_status == 20">活动已结束</view>
      </view>
    </view>
    <view class="cu-modal bottom-modal" :class="show_join?'show':''">
      <form report-submit="true" @submit="submit" class="cu-dialog">
        <view class="cu-bar bg-white">
          <view class="action text-blue"></view>
          <view class="action flex-sub">参加活动</view>
          <view class="action text-grey" @tap="hideJoinModal">取消</view>
        </view>
        <view class="padding-sm">
          <view class="cu-form-group margin-top-sm">
            <view class="title">手机号</view>
            <input placeholder="请输入手机号" name="input" :value="joinModel.mobile" data-key="mobile" @change="inputChange">
            <button class="cu-btn bg-green shadow" open-type="getPhoneNumber" @getphonenumber="getMobile">获取手机号</button>
          </view>
          <radio-group class="block" @change="appointmentTypeChange">
            <view class="cu-form-group margin-top">
              <view class="title">预约类型</view>
            </view>
            <view class="cu-form-group" v-for="(type, index) in appointment_type_options" :key="index">
              <view class="title">{{type.label}}</view>
              <radio class='wathet radio' :class="joinModel.appointment_type == type.value ? 'checked' : ''"
                     :checked="joinModel.appointment_type == type.value ? 'checked' : ''" :value="type.value"></radio>
            </view>
          </radio-group>
          <view class="cu-form-group margin-top" v-if="activity.options.length > 0">
            <view class="title">{{activity.option_label}}</view>
            <picker @change="activityOptionChange" :value="joinModel.option_index" :range="activity.options">
              <view class="picker">
                {{joinModel.option_index > -1 ? activity.options[joinModel.option_index]:''}}
              </view>
            </picker>
          </view>
          <view class="padding-top flex flex-direction">
            <button class="cu-btn bg-wathet lg" formType="submit">提交</button>
          </view>
        </view>
      </form>
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
    <canvas class="share-canvas" id="share-canvas" canvas-id="share-canvas"
            :style="{width:canvas_width+'px;',height: canvas_height+'px', top: '-'+canvas_height+'px'}"></canvas>
  </view>
</template>

<script>
  import mixin from '../../utils/mixin'
  import AsyncValidator from 'async-validator'
  import {baseURL} from "../../utils/config"

  export default {
    name: "activity",
    mixins: [mixin],
    data() {
      return {
        id: null,
        activity: null,
        show_join: false,
        joinModel: {
          id: '',
          mobile: '',
          appointment_type: '',
          option_index: 0,
          option_value: ''
        },
        joinRules: {
          mobile: [
            {required: true, message: '请填写手机号码',},
            {type: 'string', len: 11, message: '手机号无效'},
          ],
          appointment_type: [
            {required: true, message: '请选择预约类型',},
          ],
        },
        show_form_errors: false,
        form_errors: [],
        appointment_type_options: [],
        join_users: [],
        // 扫码进入
        share_user_id: '',
        // 我的扫码用户
        scan_user_count: 0,
        scan_users: 0,
        // share
        canvas_width: '',
        canvas_height: '',
        qrcode_url: '',
        has_qrcode: false,
        qrcode_path: '',
        has_bg: false,
        bg_path: '',
        show_share_image: false,
        share_image: '',
      }
    },
    components: {},
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
        this.getAppointmentTypeOptions()
        this.getJoinUsers()
      }
      // 500 1726
      // this.canvas_width = 500 * this.$store.state.systemInfo.pixelRatio
      // this.canvas_height = 1726 * this.$store.state.systemInfo.pixelRatio
      this.canvas_width = 500 * 2
      this.canvas_height = 1726 * 2
      if (options.u_id) {
        this.share_user_id = options.u_id
      }
      // todo create qrcode
      this.has_qrcode = false
      this.qrcode_path = ''
    },
    onShow() {

    },
    onShareAppMessage() {
      return {
        title: this.activity.name,
        path: '/pages/activity/activity?id=' + this.id,
        imageUrl: baseURL + this.activity.image_url
      }
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
          if (res.options.length > 0) {
            that.joinModel.option_index = 0
            that.joinModel.option_value = res.options[0]
          }
          that.joinModel.id = that.activity.id
          that.$store.dispatch('waitLogin').then(() => {
            if (that.share_user_id != '') {
              // 记录扫码
              that.$http.post('/user-share-activity-logs', {share_user_id: that.share_user_id, activity_id: that.id})
            }
            // 推荐扫描
            that.$http.get('/user-share-activity-logs/' + that.id).then(res => {
              that.scan_user_count = res.count
              that.scan_users = res.join_users
            })
          })
        })
      },
      getAppointmentTypeOptions() {
        let that = this
        that.$http.get('/appointment-types/options').then(res => {
          that.appointment_type_options = res
          if (res.length > 0) {
            that.joinModel.appointment_type = res[0].value
          }
        })
      },
      getJoinUsers() {
        let that = this
        that.$http.get('/activities/' + that.id + '/join-users').then(res => {
          that.join_users = res
        })
      },
      locationAddress() {
        uni.openLocation({
          latitude: this.activity.latitude,
          longitude: this.activity.longitude,
          scale: 5,
          name: this.activity.activity_address,
        })
      },
      showJoinModal() {
        this.show_join = true
      },
      hideJoinModal() {
        this.show_join = false
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
        that.joinModel[key] = value
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
          that.joinModel.mobile = res.mobile
          uni.showToast({
            icon: 'none',
            title: '获取手机号成功',
          })
        })
      },
      appointmentTypeChange(e) {
        this.joinModel.appointment_type = e.detail.value
      },
      activityOptionChange(e) {
        this.joinModel.option_index = e.detail.value
        this.joinModel.option_value = this.activity.options[e.detail.value]
      },
      submit(e) {
        let that = this
        that.joinModel.form_id = e.detail.formId
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
        let validator = new AsyncValidator(that.joinRules)
        validator.validate(that.joinModel, {}, (errors, fields) => {
          if (errors) {
            uni.hideLoading()
            that.form_errors = errors
            that.show_form_errors = true
            return false
          }
          that.$http.post('/user-activities', that.joinModel).then(res => {
            uni.showToast({
              icon: 'none',
              title: '报名成功，请等待审核'
            })
            setTimeout(() => {
              uni.redirectTo({
                url: '/pages/user_activity/user_activities'
              })
            }, 2000)
          })
        })
      },
      hideFormErrors() {
        this.show_form_errors = false
        this.form_errors = []
      },
      getQrcode() {
        let that = this
        return new Promise((resolve, reject) => {
          that.$http.get('/activities/' + this.id + '/qrcode').then(res => {
            resolve(res.url)
          }).catch(() => {
            reject()
          })
        })
      },
      async shareActivity() {
        let that = this
        if (!that.$store.state.user) {
          return false
        }
        if (that.share_image != '') {
          // that.showShareImage()
          that.saveShareImage()
          return false
        }
        uni.showLoading({
          title: '生成海报中',
          mask: true
        })
        try {
          if (that.qrcode_url == '') {
            // 获取二维码链接
            const qrcode_url = await that.getQrcode()
            that.qrcode_url = qrcode_url
          }
          if (!that.has_qrcode) {
            // 下载二维码
            const qrcode_path = await this.downloadFile(baseURL + that.qrcode_url)
            that.has_qrcode = true
            that.qrcode_path = qrcode_path
          }
          if (!that.has_bg) {
            // 下载背景
            const bg_path = await this.downloadFile(baseURL + '/storage/share-bg.jpeg')
            that.has_bg = true
            that.bg_path = bg_path
          }
          that.createShareCanvas()
        } catch (e) {
          console.log(e)
          uni.hideLoading()
          uni.showToast({
            icon: 'none',
            title: e
          })
        }
      },
      createShareCanvas() {
        let that = this
        let query = uni.createSelectorQuery()
        query.select('#share-canvas').boundingClientRect((res) => {
          // 返回值包括画布的实际宽高
          console.log(res)
          that.drawImage(res)
        }).exec()
      },
      downloadFile(url) {
        return new Promise((resolve, reject) => {
          uni.downloadFile({
            url: url,
            header: {
              'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br',
              'Connection': 'keep-alive',
            },
            success: (res) => {
              if (res.statusCode == 200) {
                console.log('downloadFile', url)
                resolve(res.tempFilePath)
              } else {
                reject('文件下载失败')
              }
            }
          })
        })
      },
      drawImage(canvasAttrs) {
        console.log('drawImage', canvasAttrs)
        let that = this
        uni.showLoading({
          title: '生成海报中',
          mask: true
        })
        try {
          let bg_path = that.bg_path
          let qrcode_path = that.qrcode_path
          const ctx = uni.createCanvasContext('share-canvas')
          let canvasW = canvasAttrs.width // 画布的真实宽度
          let canvasH = canvasAttrs.height //画布的真实高度
          // let pixelRatio = this.$store.state.systemInfo.pixelRatio
          let pixelRatio = 2
          // 500 1726
          let qrcodeW = 180 * pixelRatio
          let qrcodeH = 180 * pixelRatio
          // 500/2 - 180/2
          let qrcodeX = 160 * pixelRatio
          let qrcodeY = 650 * pixelRatio
          console.log(bg_path, qrcode_path, canvasAttrs, canvasW, canvasH, qrcodeW, qrcodeH, qrcodeX, qrcodeY)
          ctx.drawImage(bg_path, 0, 0, canvasW, canvasH)
          ctx.save()
          ctx.drawImage(qrcode_path, qrcodeX, qrcodeY, qrcodeW, qrcodeH)
          ctx.save()
          let str = that.$store.state.user.nickname
          let font_size = 24 * pixelRatio
          let strX = 145 * pixelRatio
          let strY = 854 * pixelRatio
          //绘制名字
          ctx.setFontSize(font_size)
          ctx.setFillStyle('#F9DF77')
          ctx.setTextAlign('left')
          ctx.fillText(str, strX, strY)
          ctx.stroke()
          ctx.draw()
          setTimeout(() => {
            uni.canvasToTempFilePath({
              canvasId: 'share-canvas',
              x: 0,
              y: 0,
              width: canvasW,
              height: canvasH,
              destWidth: canvasW,
              destHeight: canvasH,
              success: (res) => {
                uni.hideLoading()
                that.share_image = res.tempFilePath
                // that.showShareImage()
                that.saveShareImage()
              },
              fail: (res) => {
                uni.hideLoading()
                uni.showToast({
                  icon: 'none',
                  title: '生成海报失败'
                })
                console.log(res)
              }
            })
          }, 2000)
        } catch (e) {
          uni.hideLoading()
          console.log(e)
        }
      },
      showShareImage() {
        let that = this
        if (that.share_image == '') {
          return false
        }
        that.show_share_image = true
      },
      hideShareImage() {
        let that = this
        that.show_share_image = false
      },
      saveShareImage() {
        let that = this
        uni.saveImageToPhotosAlbum({
          filePath: that.share_image,
          success(res) {
            uni.showToast({
              icon: 'none',
              title: '保存成功'
            })
          },
          fail(res) {
            console.log(res)
          }
        })
      },
    },
  }
</script>

<style scoped>
  .cu-form-group .title {
    min-width: calc(4em + 15px);
  }

  .share-canvas {
    background-color: #ffffff;
    zoom: 20%;
    position: absolute;
    left: -10000px;
  }
</style>