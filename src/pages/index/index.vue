<template>
  <view>
    <!--    <cu-custom bgColor="bg-wathet">-->
    <!--      <block slot="content">麦卡车活动中心</block>-->
    <!--    </cu-custom>-->
    <view>
      <swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
              :autoplay="true" interval="5000" duration="500" style="background-color: #8799a3;min-height: 420upx;">
        <swiper-item v-for="(item,index) in swipers" :key="index" :data-index="index" @tap="handleSwiperClick">
          <image :src="item.image_url" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <navigator class="cu-card case no-card margin-top-sm" v-for="(activity, index) in activities" :key="index"
                 :url="'/pages/activity/activity?id=' + activity.id"
                 hover-class="none">
        <view class="cu-item shadow">
          <view class="image">
            <image :src="getPath(activity.image_url)"
                   mode="widthFix"></image>
            <view class="cu-tag bg-blue">{{activity.activity_status_label}}</view>
            <view class="cu-bar bg-shadeBottom">
              <text class="text-cut">{{activity.name}}</text>
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
      </navigator>
      <loadMore :loading="loading" :has-more="has_more"></loadMore>
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
        activities: [],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        empty: false,
        loading: false,
      }
    },
    components: {
      loadMore
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      has_more: function () {
        let that = this
        return that.currentPage * that.pageSize < that.total
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
          // todo action
        }
        console.log(action, params)
      }
      this.getSwipers()
      this.getActivities()
    },
    onShow() {
      let that = this
      that.$store.dispatch('waitLogin').then(res => {
        // todo
      })
    },
    onReachBottom() {
      this.loadMore()
    },
    onPullDownRefresh() {
      let that = this
      that.pageInit()
      that.getActivities()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    methods: {
      pageInit() {
        let that = this
        that.activities = []
        that.currentPage = 1
        that.pageSize = 15
        that.total = 0
        that.page_empty = false
        that.page_loading = false
      },
      getSwipers() {
        let that = this
        that.$http.get('/swipers').then(res => {
          that.swipers = res
        })
      },
      loadMore() {
        let that = this
        if (!that.has_more) return
        that.currentPage++
        that.getActivities()
      },
      getActivities() {
        let that = this
        that.loading = true
        let query = {
          page_size: that.pageSize,
          page: that.currentPage,
        }
        that.$http.get('/activities', query).then(res => {
          that.loading = false
          that.activities = that.activities.concat(res.data)
          that.total = res.total
          that.currentPage = res.current_page
        }).catch(err => {
          that.loading = false
        })
      },
      handleSwiperClick(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let swiper = that.swipers[index]
        if (!swiper.navigate_path) {
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
    }
  }
</script>

<style>

</style>
