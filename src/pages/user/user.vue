<template>
  <view>
    <cu-custom bgColor="bg-wathet">
      <block slot="content">个人中心</block>
    </cu-custom>
    <view v-if="user">
      <view class="user-center flex flex-direction align-center" style="background-image: linear-gradient(180deg, #38c1e8, rgba(72,202,255,0.5));color: #ffffff;">
        <image :src="user.avatar" class="cu-avatar xl round margin-tb-xl" mode="widthFix"></image>
        <view class="margin-bottom-sm text-white text-lg">{{user.nickname}}</view>
      </view>
      <view class="cu-list menu sm-border margin-top-sm shadow-lg">
        <navigator class="cu-item arrow" hover-class="none" url="/pages/order/orders" open-type="navigate">
          <view class="content">
            <text class="cuIcon-ticket text-wathet"></text>
            <text class="text-grey">我的票券</text>
          </view>
        </navigator>
        <navigator class="cu-item arrow" hover-class="none" url="/pages/user_coupon/user_coupons" open-type="navigate">
          <view class="content">
            <text class="cuIcon-redpacket text-pink"></text>
            <text class="text-grey">我的优惠券</text>
          </view>
        </navigator>
        <navigator class="cu-item arrow" hover-class="none" url="/pages/instructor/orders" open-type="navigate">
          <view class="content">
            <text class="cuIcon-list text-brown"></text>
            <text class="text-grey">我的教学</text>
          </view>
        </navigator>
        <navigator class="cu-item arrow" hover-class="none" url="/pages/user_card/user_cards" open-type="navigate">
          <view class="content">
            <text class="cuIcon-card text-yellow"></text>
            <text class="text-grey">我的季卡</text>
          </view>
        </navigator>
        <view class="cu-item arrow">
          <view class="content">
            <text class="cuIcon-info text-cyan"></text>
            <text class="text-grey">关于</text>
          </view>
        </view>
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