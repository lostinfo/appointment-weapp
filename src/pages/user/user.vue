<template>
  <view>
<!--    <cu-custom bgColor="bg-wathet">-->
<!--      <block slot="content">个人中心</block>-->
<!--    </cu-custom>-->
    <view v-if="user">
      <view class="user-center flex flex-direction align-center" style="background-image: linear-gradient(180deg, #539de6, rgba(72,202,255,0.5));color: #ffffff;">
        <image :src="user.avatar_url" class="cu-avatar xl round margin-tb-xl" mode="widthFix"></image>
        <view class="margin-bottom-sm text-white text-lg">{{user.nickname}}</view>
      </view>
      <view class="cu-list menu sm-border margin-top-sm shadow-lg">
        <navigator class="cu-item arrow" hover-class="none" url="/pages/user_activity/user_activities" open-type="navigate">
          <view class="content">
            <text class="cuIcon-formfill text-wathet"></text>
            <text class="text-grey">我的活动预约</text>
          </view>
        </navigator>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "user",
    data() {
      return {}
    },
    computed: {
      user() {
        return this.$store.state.user
      }
    },
    onLoad() {
      if (this.$store.state.user == null) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {},
  }
</script>

<style scoped>

</style>