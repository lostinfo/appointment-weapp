<template>
  <view>
    <cu-custom bgColor="bg-wathet">
      <block slot="content">活动</block>
    </cu-custom>
    <view class="margin-bottom-sm">
      <view v-for="(event, index) in events" :key="index" class="margin-top-sm margin-lr-sm" :data-index="index" @tap="handleClickEvent">
        <view class="radius shadow-blur bg-white bg-img" :style="'background-image: url(' + getPath(event.image_url) + ');width: 100%; height: 400rpx'"></view>
      </view>
      <loadMore :loading="event_loading" :has-more="false"></loadMore>
    </view>
    <view class="cu-modal" :class="show_message?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">提示信息</view>
          <view class="action" @tap="hideMessage">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          <text class="text-gray">{{event_message}}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import mixin from '../../utils/mixin'
  import loadMore from '../../components/loadMore'

  export default {
    name: "events",
    mixins: [mixin],
    data() {
      return {
        events: [],
        event_loading: true,
        event_message: '',
        show_message: false,
      }
    },
    components: {
      loadMore
    },
    onLoad() {
      this.getEvent()
    },
    methods: {
      getEvent() {
        let that = this
        that.$http.get('/events').then(res => {
          that.events = res
          that.event_loading = false
        })
      },
      handleClickEvent(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let event = that.events[index]
        switch (event.type) {
          case 'MESSAGE':
            that.event_message = event.content
            that.show_message = true
            break
          case 'SWITCH':
            uni.switchTab({
              url: event.content,
            })
            break
          case 'NAVIGATE':
            uni.navigateTo({
              url: event.content,
            })
            break
        }
      },
      hideMessage() {
        let that = this
        that.show_message = false
          that.event_message = ''
      },
    },
  }
</script>

<style scoped>

</style>