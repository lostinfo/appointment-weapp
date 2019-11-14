<template>
  <view>
    <cu-custom bgColor="bg-wathet">
      <block slot="content">九鼎山太子岭滑雪场直营店</block>
    </cu-custom>
    <view>
      <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
              :autoplay="true" interval="5000" duration="500" style="background-color: #8799a3;min-height: 420upx;">
        <swiper-item v-for="(item,index) in swipers" :key="index" :data-index="index" @tap="handleSwiperClick">
          <image :src="item.image_url" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="margin-top-sm flex justify-around">
        <view class="cu-btn radius lg bg-wathet">我的票券</view>
        <view class="cu-btn radius lg bg-white" data-url="/pages/article/article?code=scenic_intro" @tap="navigateTo">
          景区介绍
        </view>
        <view class="cu-btn radius lg bg-white" data-url="/pages/article/article?code=hotel_intro" @tap="navigateTo">
          酒店预约
        </view>
      </view>
      <view class="margin-top-sm flex justify-between">
        <button @tap="callPhone" :data-phone="setting.kefu_mobile" class="btn-view radius bg-white flex flex-sub margin-lr-sm padding-sm">
          <view class="flex flex-direction">
            <view class="text-xxl text-center">
              <text class="cuIcon cuIcon-dianhua text-wathet"></text>
            </view>
            <text class="text-wathet text-sm text-center">客服电话</text>
          </view>
          <view class="flex flex-sub align-center justify-center">
            <text class="text-wathet text-sm">0837-8709999</text>
          </view>
        </button>
        <button open-type="contact" class="btn-view radius bg-white flex flex-sub margin-lr-sm padding-sm">
          <view class="flex flex-direction">
            <view class="text-xxl text-center">
              <text class="cuIcon cuIcon-service text-wathet"></text>
            </view>
            <text class="text-wathet text-sm text-center">在线客服</text>
          </view>
          <view class="flex flex-sub align-center justify-center">
            <text class="text-wathet text-sm">咨询猛戳</text>
          </view>
        </button>
      </view>
      <!--      <view class="tickets margin-top-sm">-->
      <!--        <view style="background-image: url('/static/tickets-bg.png');background-size: cover;" class="bg">-->
      <!--          <view class="tickets-wrapper">-->
      <!--            <view class="info">票券信息</view>-->
      <!--            <view class="chiyou">持有票数:</view>-->
      <!--            <view class="amount">{{ticketStat.total}}</view>-->
      <!--            <view class="zhang">张</view>-->
      <!--            <view class="detail-wrapper">-->
      <!--              <button class="cu-btn bg-wathet lg">查看详情</button>-->
      <!--            </view>-->
      <!--            <view class="stat-wrapper">-->
      <!--              <view class='stat-item'>-->
      <!--                <view class='stat-name'>可使用</view>-->
      <!--                <view class='stat-count'>{{ticketStat.canUse}}</view>-->
      <!--              </view>-->
      <!--              <view class='stat-item'>-->
      <!--                <view class='stat-name'>已使用</view>-->
      <!--                <view class='stat-count'>{{ticketStat.hasUse}}</view>-->
      <!--              </view>-->
      <!--              <view class='stat-item'>-->
      <!--                <view class='stat-name'>未支付</view>-->
      <!--                <view class='stat-count'>{{ticketStat.canPay}}</view>-->
      <!--              </view>-->
      <!--            </view>-->
      <!--          </view>-->
      <!--          <view class="tickets-notice" v-if="!user">-->
      <!--            <navigator hover-class="none" url="/pages/login/login" open-type="navigate" class="padding-sm bg-wathet radius">点击登录后查看票券信息</navigator>-->
      <!--          </view>-->
      <!--        </view>-->
      <!--      </view>-->
      <view v-if="useList.length > 0">
        <view class="cu-bar bg-white margin-top-sm">
          <view class="action">
            <text class="cuIcon-title text-wathet"></text>
            <text>待使用 {{useList.length}}</text>
          </view>
        </view>
        <view class="bg-white">
          <view class="padding-tb-sm margin-lr-sm solid-bottom flex" v-for="(useItem, index) in useList" :key="index"
                :data-index="index" @tap="handleUseItemClick">
            <image :src="getPath(useItem.thumb)" mode="aspectFill" class="radius"
                   style="width: 150upx;height: 150upx;background-color: #8799a3;"></image>
            <view class="flex-sub margin-lr-sm">
              <view class="text-black product-name">{{useItem.name}}</view>
              <view class="text-grey text-sm">{{useItem.intro_1}}</view>
              <view class="text-grey text-sm">{{useItem.intro_2}}</view>
            </view>
            <view class="text-right">
              <view class="text-price text-red">{{useItem.price}}</view>
              <view class="text-grey">x{{useItem.buy_number}}</view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="payList.length > 0">
        <view class="cu-bar bg-white margin-top-sm">
          <view class="action">
            <text class="cuIcon-title text-wathet"></text>
            <text>待支付 {{payList.length}}</text>
          </view>
        </view>
        <view class="bg-white">
          <view class="padding-tb-sm margin-lr-sm solid-bottom flex" v-for="(payItem, index) in payList" :key="index"
                :data-index="index" @tap="handlePayItemClick">
            <image :src="getPath(payItem.thumb)" mode="aspectFill" class="radius"
                   style="width: 150upx;height: 150upx;background-color: #8799a3;"></image>
            <view class="flex-sub margin-lr-sm">
              <view class="text-black product-name">{{payItem.name}}</view>
              <view class="text-grey text-sm">{{payItem.intro_1}}</view>
              <view class="text-grey text-sm">{{payItem.intro_2}}</view>
            </view>
            <view class="text-right">
              <view class="text-price text-red">{{payItem.price}}</view>
              <view class="text-grey">x{{payItem.buy_number}}</view>
            </view>
          </view>
        </view>
      </view>
      <view>
        <view class="cu-bar bg-white margin-top-sm">
          <view class="action">
            <text class="cuIcon-title text-wathet"></text>
            <text>猜你喜欢</text>
          </view>
        </view>
        <view class="product-list">
          <view class="product-item" v-for="(product, index) in products" :key="index" :data-type="product.type"
                :data-id="product.id" @tap="toProduct">
            <image :src="getPath(product.picture)" class="product-thumb" mode="aspectFill"></image>
            <view class="product-content">
              <view class="name">{{product.name}}</view>
            </view>
            <view class="product-footer">
              <view class="text-price text-red text-bold">{{product.price}}</view>
              <view class="text-sm margin-left text-grey flex-sub">已售 {{product.sold}}</view>
              <view class="cuIcon-more"></view>
            </view>
          </view>
        </view>
      </view>
      <loadMore :loading="product_loading" :has-more="false"></loadMore>
    </view>
  </view>
</template>

<script>
  import mixin from '../../utils/mixin'
  import loadMore from '../../components/loadMore'

  export default {
    name: 'index',
    mixins: [mixin],
    data() {
      return {
        title: 'Hello',
        swipers: [],
        setting: {
          kefu_mobile: '0837-8709999',
          kefu_weixin: 'skiing999',
        },
        ticketStat: {
          total: '',
          canUse: '',
          hasUse: '',
          canPay: '',
        },
        products: [],
        product_loading: true,
        //
        useList: [],
        payList: [],
      }
    },
    components: {
      loadMore
    },
    computed: {
      user() {
        return this.$store.state.user
      },
    },
    onLoad(o) {
      let that = this
      if (o.q) {
        // 获取二维码字符串
        let q = decodeURIComponent(o.q)
        q = q.substring(q.lastIndexOf('/') + 1)

        let action = ''
        let params = {}
        // 获取出action
        let index = q.indexOf('?')
        if (-1 == index) {
          action = q
        } else {
          action = q.substr(0, index)
          let paramsStr = q.substr(index + 1)
          let paramsArr = paramsStr.split("&")
          paramsArr.forEach(function (item) {
            let arr = item.split('=')
            let key = arr[0]
            let value = arr[1]
            params[key] = value
          })
        }
        switch (action) {
          case 'channel':
            that.$store.dispatch('waitLogin').then(res => {
              that.$http.post('/channel', {from_code: params.id})
            })
            break
        }
        console.log(action, params)
      }
      this.getSetting()
      this.getProducts()
    }
    ,
    onShow() {
      let that = this
      that.$store.dispatch('waitLogin').then(res => {
        // 待使用
        that.$http.get('/index/use-list').then(res => {
          that.useList = res
        })
        // 待支付
        that.$http.get('/index/pay-list').then(res => {
          that.payList = res
        })
      })
    }
    ,
    methods: {
      getSetting() {
        let that = this
        that.$http.get('/setting').then(res => {
          that.swipers = res.swipers
          that.setting = res.setting
        })
      },
      getProducts() {
        let that = this
        that.$http.get('/index/products').then(res => {
          that.products = res
          that.product_loading = false
        })
      },
      handleSwiperClick(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let swiper = that.swipers[index]
        if (!swiper.navigate_path){
          return
        }
        if (swiper.is_tabbar) {
          uni.switchTab({
            url: swiper.navigate_path
          })
        } else {
          if (swiper.need_login && that.$store.state.user == null) {
            uni.navigateTo({
              url: '/pages/login/login?redirect=' + encodeURIComponent(swiper.navigate_path)
            })
          } else {
            uni.navigateTo({
              url: swiper.navigate_path
            })
          }
        }
      },
      callPhone: function(e){
        uni.makePhoneCall({
          phoneNumber: e.currentTarget.dataset.phone
        })
      },
      toProduct(e) {
        let id = e.currentTarget.dataset.id
        let type = e.currentTarget.dataset.type
        switch (type) {
          case 'skiing':
            uni.navigateTo({
              url: '/pages/product/product?id=' + id
            })
            break
          case 'instructor':
            uni.navigateTo({
              url: '/pages/instructor/product?id=' + id
            })
            break
          case 'card':
            uni.navigateTo({
              url: '/pages/card/card?id=' + id
            })
            break
        }
      },
      handleUseItemClick(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let useItem = that.useList[index]
        let id = useItem.id
        switch (useItem.type) {
          case 'order':
            uni.navigateTo({
              url: '/pages/order/order?id=' + id
            })
            break
          case 'instruction_order':
            uni.navigateTo({
              url: '/pages/instructor/order?id=' + id
            })
            break
          case 'user_card':
            uni.navigateTo({
              url: '/pages/user_card/user_card?id=' + id
            })
            break
        }
      },
      handlePayItemClick(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let payItem = that.payList[index]
        let id = payItem.id
        switch (payItem.type) {
          case 'order':
            uni.navigateTo({
              url: '/pages/order/order?id=' + id
            })
            break
          case 'instruction_order':
            uni.navigateTo({
              url: '/pages/instructor/order?id=' + id
            })
            break
          case 'user_card':
            uni.navigateTo({
              url: '/pages/user_card/user_card?id=' + id
            })
            break
        }
      },
    }
  }
</script>

<style>
  .tickets {
    background-color: #ffffff;
    padding: 10px;
  }

  .tickets .bg {
    /* 10 730 10 */
    /* 670 * 352 */
    /* 730 / 670 * 352 */
    width: 100%;
    height: 383upx;
    position: relative;
  }

  .tickets .tickets-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: block;
    color: #ffffff;
  }

  .tickets .tickets-notice {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1001;
    opacity: 0.8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
  }

  .tickets .tickets-wrapper .info {
    position: absolute;
    width: 18px;
    line-height: 22px;
    font-size: 18px;
    display: inline-block;
    left: 12%;
    top: 35%;
  }

  .tickets .tickets-wrapper .chiyou {
    position: absolute;
    top: 10%;
    left: 30%;
    font-size: 16px;
  }

  .tickets .tickets-wrapper .amount {
    position: absolute;
    top: 25%;
    left: 29%;
    font-size: 40px;
    font-weight: 300;
  }

  .tickets .tickets-wrapper .zhang {
    position: absolute;
    top: 35%;
    left: 47%;
    font-size: 18px;
  }

  .tickets .tickets-wrapper .detail-wrapper {
    position: absolute;
    top: 25%;
    left: 60%;
    background-color: #ffffff;
    border-radius: 3px;
    padding: 2px;
  }

  .tickets .tickets-wrapper .detail-wrapper .detail {
    padding: 10px;
    border-radius: 3px;
    border: 1px solid #38c1e8;
    color: #38c1e8;
    font-size: 16px;
  }

  .detail::after {
    border: none;
  }

  .tickets .tickets-wrapper .stat-wrapper {
    position: absolute;
    top: 63%;
    left: 30%;
    width: 60%;
    height: 45px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .tickets .tickets-wrapper .stat-wrapper .stat-item {
    text-align: center;
    flex: 1;
  }

  .tickets .tickets-wrapper .stat-wrapper .stat-item .stat-name {
    font-size: 14px;
  }

  .tickets .tickets-wrapper .stat-wrapper .stat-item .stat-count {
    font-size: 24px;
  }

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
