<template>
  <view>
    <!--    <cu-custom bgColor="bg-wathet" :isBack="true">-->
    <!--      <block slot="backText">返回</block>-->
    <!--      <block slot="content">我的票券</block>-->
    <!--    </cu-custom>-->
    <scroll-view scroll-x class="bg-white nav fixed" scroll-with-animation :scroll-left="scrollLeft"
                 :style="[{top:CustomBar + 'px'}]">
      <view class="cu-item" :class="index == join_status_index ? 'text-green cur':''"
            v-for="(join_status, index) in join_status_list" :key="index" @tap="handleJoinStatusChange"
            :data-index="index">
        {{join_status.label}}
      </view>
    </scroll-view>
    <view class="margin-lr-sm margin-top-sm radius" v-for="(user_activity, index) in user_activities" :key="index">
      <view class="bg-white">
        <view class="cu-bar padding-lr solid-bottom">
          <view class="flex-sub text-bold">{{user_activity.activity_name}}</view>
          <view class="text-red">{{user_activity.join_status_label}}</view>
        </view>
        <view class="padding-sm">
          <view class="flex-sub margin-lr-sm">
            <view class="text-grey text-df padding-tb-sm">预约类型：{{user_activity.appointment_type_label}}</view>
            <view class="text-grey text-df padding-tb-sm" v-if="user_activity.option_label != null">{{user_activity.option_label}}：{{user_activity.option_value}}</view>
            <view class="text-grey text-df padding-tb-sm">报名时间：{{user_activity.activity.post_date_range}}</view>
            <view class="text-grey text-df padding-tb-sm">活动时间：{{user_activity.activity.activity_date_range}}</view>
            <view class="text-grey text-df padding-tb-sm">活动地址：{{user_activity.activity.activity_address}}</view>
          </view>
          <view class="solid-top flex justify-end padding-tb-sm">
            <button class="cu-btn line-gray" v-if="user_activity.join_status == 10" :data-id="user_activity.id" @tap="cancelJoin">取消预约</button>
          </view>
        </view>
      </view>
    </view>
    <loadMore :loading="loading" :has-more="has_more"></loadMore>
  </view>
</template>

<script>
  import loadMore from '../../components/loadMore'
  import mixin from '../../utils/mixin'

  export default {
    name: "user_activities",
    mixins: [mixin],
    data() {
      return {
        scrollLeft: 0,
        CustomBar: this.CustomBar,
        join_status_list: [
          {
            label: '所有',
            value: ''
          },
          {
            label: '待审核',
            value: 10
          },
          {
            label: '审核通过',
            value: 20
          },
          {
            label: '审核拒绝',
            value: 30
          },
          {
            label: '已完成',
            value: 40
          },
          {
            label: '已取消',
            value: 0,
          },
        ],
        join_status_index: 0,
        user_activities: [],
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
      has_more: function () {
        let that = this
        return that.currentPage * that.pageSize < that.total
      },
    },
    onReachBottom() {
      this.loadMore()
    },
    onPullDownRefresh() {
      let that = this
      that.pageInit()
      that.getUserActivities()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    mounted() {
      let that = this
      that.getUserActivities()
    },
    methods: {
      pageInit() {
        let that = this
        that.user_activities = []
        that.currentPage = 1
        that.pageSize = 15
        that.total = 0
        that.page_empty = false
        that.page_loading = false
      },
      handleJoinStatusChange(event) {
        let that = this
        let index = event.currentTarget.dataset.index
        that.join_status_index = index
        this.scrollLeft = index * 60
        that.pageInit()
        that.getUserActivities()
      },
      loadMore() {
        let that = this
        if (!that.has_more) return
        that.currentPage++
        that.getUserActivities()
      },
      getUserActivities() {
        let that = this
        that.loading = true
        let query = {
          page_size: that.pageSize,
          page: that.currentPage,
          join_status: that.join_status_list[that.join_status_index].value
        }
        that.$http.get('/user-activities', query).then(res => {
          that.loading = false
          that.user_activities = that.user_activities.concat(res.data)
          that.total = res.total
          that.currentPage = res.current_page
        }).catch(err => {
          that.loading = false
        })
      },
      cancelJoin(e) {
        let that = this
        let id = e.currentTarget.dataset.id
        uni.showLoading()
        that.$http.post('/user-activities/' + id + '/cancel').then(res => {
          uni.hideLoading()
          uni.showToast({
            title: '取消成功'
          })
          setTimeout(() => {
            that.pageInit()
            that.getUserActivities()
          }, 2000)
        })
      },
    },
  }
</script>

<style>
  page {
    padding-top: 90upx;
  }
</style>

<style scoped>

</style>