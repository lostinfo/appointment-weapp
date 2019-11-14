<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">季卡详情</block>
    </cu-custom>
    <view v-if="card">
      <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
              :autoplay="true" interval="5000" duration="500" style="height: 750upx">
        <swiper-item>
          <image :src="getPath(card ? card.thumb : '')" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="padding-sm bg-white">
        <text class="text-df text-bold padding-tb-sm">{{card.name}}</text>
      </view>
      <view class="padding-sm bg-white flex">
        <view class="text-price text-xl text-red text-bold">{{card.price}}</view>
        <view class="text-sm margin-left text-grey flex-sub">已售 {{card.sold}}</view>
      </view>
      <view class="login-wrap">
        <view class="login-main">
          <view class="cu-form-group margin-top-sm">
            <view class="title">手机号</view>
            <input placeholder="请输入手机号" name="input" :value="buyModel.mobile" data-key="mobile" @change="inputChange">
            <button class="cu-btn bg-green shadow" open-type="getPhoneNumber" @getphonenumber="getMobile">获取手机号</button>
          </view>
          <view v-for="(people, index) in buyModel.peoples" :key="index">
            <view class="cu-bar bg-white solid-bottom margin-top-sm">
              <view class="action">
                <text class="cuIcon-title text-wathet"></text>
                <text>{{people_titles[index]}}</text>
              </view>
            </view>
            <view class="margin-lr-sm margin-top-sm">
              <view class="cu-form-group">
                <view class="title">姓名</view>
                <input placeholder="请输入姓名" name="input" :value="people.realname" data-key="realname" :data-index="index"
                       @change="peopleInputChange">
              </view>
              <view class="cu-form-group">
                <view class="title">身份证</view>
                <input placeholder="请输入身份证" name="input" :value="people.idcard" data-key="idcard" :data-index="index"
                       @change="peopleInputChange">
              </view>
              <view class="cu-bar bg-white margin-top-sm">
                <view class="action">
                  个人照片
                </view>
              </view>
              <view class="cu-form-group">
                <view class="grid col-2 grid-square flex-sub">
                  <view class="bg-img">
                    <image src="/static/idphoto_example.png" mode="aspectFit"></image>
                  </view>
                  <view class="bg-img" @tap="viewPeopleIdphoto" :data-url="people.idphoto" v-if="people.idphoto != ''">
                    <image :src="getPath(people.idphoto ? people.idphoto : '')" mode="aspectFill"></image>
                    <view class="cu-tag bg-red" @tap.stop="delPeopleIdphoto" :data-index="index">
                      <text class='cuIcon-close'></text>
                    </view>
                  </view>
                  <view class="solids" @tap="choosePeopleIdphoto" :data-index="index" v-if="people.idphoto == ''">
                    <text class='cuIcon-cameraadd'></text>
                  </view>
                </view>
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
          季卡拍前必看
        </view>
        <view class="padding-lr-sm padding-bottom-sm">
          <Article code="card_notice"></Article>
        </view>
      </view>
      <view class="cu-bar bg-white tabbar border shop foot bg-white">
        <button class="action" open-type="contact">
          <view class="cuIcon-service text-green">
            <!--            <view class="cu-tag"></view>-->
          </view>
          客服
        </button>
        <view class="bg-white submit">
          <text class="text-price text-xl text-red text-bold">{{total_amount}}</text>
        </view>
        <view class="bg-red submit" @tap="buy">立即购买</view>
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
    name: "card",
    mixins: [mixin],
    data() {
      return {
        id: null,
        card: null,
        buyModel: {
          id: '',
          mobile: '',
          peoples: [],
        },
        buyRules: {
          mobile: [
            {required: true, message: '请填写手机号码',},
            {type: 'string', len: 11, message: '手机号无效'},
          ],
          peoples: {
            type: 'array', required: true, message: '请填写成员信息',
            fields: []
          }
        },
        show_form_errors: false,
        form_errors: [],
        people_titles: ['成员A', '成员B', '成员C', '成员D', '成员E'],
      }
    },
    components: {
      stepper,
      Article,
    },
    computed: {
      total_amount() {
        return this.card ? this.card.price : ''
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
        this.getCard()
      }
    },
    methods: {
      getCard() {
        let that = this
        uni.showLoading()
        that.$http.get('/cards/' + that.id).then(res => {
          uni.hideLoading()
          for (let i = 1; i <= res.people_number; i++) {
            that.buyModel.peoples.push({
              realname: '',
              idcard: '',
              idphoto: '',
            })
            that.buyRules.peoples.fields.push({
              type: 'object', required: true, message: that.people_titles[i - 1]+'信息未填写完整',
              fields: {
                realname: {required: true, message: '请填写'+that.people_titles[i - 1]+'姓名'},
                idcard: {required: true, message: '请填写'+that.people_titles[i - 1]+'身份证'},
                idphoto: {required: true, message: '请上传'+that.people_titles[i - 1]+'个人照片'},
              }
            })
          }
          that.card = res
          that.buyModel.id = that.card.id
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
      peopleInputChange(e) {
        let that = this
        let key = e.currentTarget.dataset.key
        let type = e.currentTarget.dataset.type !== undefined ? e.currentTarget.dataset.type : 'string'
        let value = e.detail.value
        let index = e.currentTarget.dataset.index
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
        that.buyModel.peoples[index][key] = value
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
      viewPeopleIdphoto(e) {
        uni.previewImage({
          urls: [e.currentTarget.dataset.url],
          current: e.currentTarget.dataset.url
        })
      },
      delPeopleIdphoto(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        uni.showModal({
          title: '提示信息',
          content: '确定要删除吗？',
          cancelText: '取消',
          confirmText: '确定',
          success: res => {
            if (res.confirm) {
              that.buyModel.peoples.idphoto = ''
            }
          }
        })
      },
      choosePeopleIdphoto(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        uni.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], //从相册选择
          success: (res) => {
            if (res.tempFilePaths.length < 1) {
              return
            }
            uni.showLoading({
              title: '文件上传中',
              mask: true,
            })
            that.$http.uploadFile('/files/user', res.tempFilePaths[0]).then(res_2 => {
              that.buyModel.peoples[index].idphoto = res_2.url
              uni.hideLoading()
            }).catch(err => {
              uni.hideLoading()
              uni.showToast({
                icon: 'none',
                title: '文件上传失败',
                duration: 2000
              })
            })
          }
        })
      },
      buy() {
        let that = this
        //  checkLogin
        if (!that.$store.state.user) {
          uni.navigateTo({
            url: '/pages/login/login?redirect=' + encodeURIComponent('/pages/card/card?id=' + that.id),
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
          that.$http.post('/user-cards', that.buyModel).then(res => {
            that.pay('/user-cards/' + res.id + '/pay').then(() => {
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/user_card/user_card?id=' + res.id
                })
              }, 2000)
            }).catch(err => {
              setTimeout(() => {
                uni.redirectTo({
                  url: '/pages/user_card/user_card?id=' + res.id
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