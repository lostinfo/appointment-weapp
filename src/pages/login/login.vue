<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">登录</block>
    </cu-custom>
    <view class="logo-wrap">
      <view class="logo">
        <image src="/static/logo.png"></image>
      </view>
    </view>
    <view class="login-btn-wrap">
      <view class="login-desc">点击登录按钮即可购票、查看票券</view>
      <button open-type="getUserInfo" @getuserinfo="onGetUserInfo" class="login-btn">登 录</button>
    </view>
  </view>
</template>

<script>
  import api from '../../utils/api_weixin'

  export default {
    name: "login",
    data() {
      return {
        redirect: '',
      }
    },
    onLoad(options) {
      if (options.redirect !== undefined) {
        this.redirect = options.redirect
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      onGetUserInfo(event) {
        console.log(event)
        if (event.mp.detail.userInfo === undefined) {
          uni.showToast({
            icon: 'none',
            title: '未授权 登录失败',
            duration: 2000
          })
          return false
        }
        let that = this
        uni.login({
          provider: 'weixin',
          success: function (loginRes) {
            let code = loginRes.code
            uni.showLoading({
              title: '加载中...',
              mask: 'true'
            })
            api.login(code, event.mp.detail)
              .then(res => {
                uni.hideLoading()
                uni.showToast({
                  title: '登录成功',
                  duration: 2000
                })
                setTimeout(() => {
                  if (that.redirect !== '') {
                    uni.redirectTo({url: decodeURIComponent(that.redirect)});
                  } else {
                    uni.navigateBack({delta: 1})
                  }
                }, 2000)
              }).catch(err => {
            })
          }
        })
      }
    },
  }
</script>

<style scoped>
  .logo-wrap{
    margin-top: 300upx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .login-btn-wrap{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .login-desc{
    font-size: 14px;
    color: #8a8a8a;
    text-align: center;
    height: 100px;
    line-height: 100px;
  }
  .login-btn{
    width: 70%;
    border-radius: 2.5em;
    height: 2.5em;
    line-height: 2.5em;
    background: linear-gradient(to bottom right, #63BDE2 , #6FDAE4);
    border: unset;
    color: #FFFFFF;
    font-weight: 400;
  }
  .login-btn::after{
    border: transparent;
  }
</style>