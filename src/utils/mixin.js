import { baseURL } from "./config";

export default {
  methods: {
    navigateTo(e) {
      // 限二级页面
      let url = e.currentTarget.dataset.url
      if (url === undefined) {
        return
      }
      let needLogin = e.currentTarget.dataset.needLogin
      needLogin = needLogin === undefined ? false : needLogin
      if (needLogin && !this.$store.state.user) {
        uni.navigateTo({
          url: '/pages/login/login?redirect=' + encodeURIComponent(url),
        })
      } else {
        uni.navigateTo({
          url: url,
        })
      }
    },
    getPath(url) {
      if (/^http(s)?:\/\/.+/.test(url)) {
        return url
      }
      return baseURL + (/^\//.test(url) ? url : '/' + url)
    },
    pay(url) {
      let that = this
      uni.showLoading({
        mask: true,
      })
      return new Promise((resolve, reject) => {
        that.$http.get(url).then(res => {
          uni.hideLoading()
          uni.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            signType: res.signType,
            paySign: res.paySign,
            success: (res2) => {
              uni.showToast({
                title: '支付成功',
              })
              resolve()
            },
            fail: (err) => {
              console.log(err)
              if (err.errMsg == 'requestPayment:fail cancel') {
                uni.showToast({
                  icon: 'none',
                  title: '取消支付',
                })
                reject()
              } else {
                uni.showToast({
                  icon: 'none',
                  title: '调用支付失败',
                })
                reject(err)
              }
            }
          })
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}