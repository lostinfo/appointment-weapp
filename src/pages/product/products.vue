<template>
  <view>
    <cu-custom bgColor="bg-wathet">
      <block slot="content">票券相关</block>
    </cu-custom>
    <view>
      <view class="cu-bar bg-white solid-bottom margin-top" v-if="products.length > 0">
        <view class="action">
          <text class="cuIcon-title text-wathet"></text>
          <text>滑雪票</text>
        </view>
        <view class="action">
          <button class="cu-btn bg-wathet shadow-blur" :data-need-login="true" data-url="/pages/order/orders" @tap="navigateTo">我的票券</button>
        </view>
      </view>
      <view v-for="(product, index) in products" :key="index" class="bg-white padding-sm solid-bottom flex">
        <view class="radius product-thumb" :style="'background-image: url(' + getPath(product.thumb) + ');background-size: cover;'"></view>
        <view class="flex-sub margin-left-sm flex flex-direction">
          <view>
            <text class="text-black text-lg product-name">{{product.productName}}</text>
          </view>
          <view class="flex justify-between align-end product-action">
            <view><text class="text-red text-xl text-bold text-price">{{product.shopPriceFormat}}</text></view>
            <view class="text-sm margin-left text-grey flex-sub">已售 {{product.sold}}</view>
            <view><button class="cu-btn line-red" :data-need-login="true" :data-url="'/pages/product/product?id=' + product.id" @tap="navigateTo">购买</button></view>
          </view>
        </view>
      </view>
      <view class="cu-bar bg-white solid-bottom margin-top" v-if="cards.length > 0">
        <view class="action">
          <text class="cuIcon-title text-wathet"></text>
          <text>季卡</text>
        </view>
        <view class="action">
          <button class="cu-btn line-wathet shadow-blur" :data-need-login="true" data-url="/pages/card/query_discount" @tap="navigateTo">查询折扣</button>
          <button class="cu-btn bg-wathet shadow-blur margin-left-sm" :data-need-login="true" data-url="/pages/user_card/user_cards" @tap="navigateTo">我的季卡</button>
        </view>
      </view>
      <view v-for="(card, index) in cards" :key="index" class="bg-white padding-sm solid-bottom flex">
        <view class="radius product-thumb" :style="'background-image: url(' + getPath(card.thumb) + ');background-size: cover;'"></view>
        <view class="flex-sub margin-left-sm flex flex-direction">
          <view>
            <text class="text-black text-lg product-name">{{card.name}}</text>
          </view>
          <view class="flex justify-between align-end product-action">
            <view><text class="text-red text-xl text-bold text-price">{{card.price}}</text></view>
            <view class="text-sm margin-left text-grey flex-sub">已售 {{card.sold}}</view>
            <view><button class="cu-btn line-red" :data-need-login="true" :data-url="'/pages/card/card?id=' + card.id" @tap="navigateTo">购买</button></view>
          </view>
        </view>
      </view>
      <view class="cu-bar bg-white solid-bottom margin-top" v-if="instruction_products.length > 0">
        <view class="action">
          <text class="cuIcon-title text-wathet"></text>
          <text>教学预约</text>
        </view>
        <view class="action">
          <button class="cu-btn bg-wathet shadow-blur" :data-need-login="true" data-url="/pages/instructor/orders" @tap="navigateTo">我的预约</button>
        </view>
      </view>
      <view v-for="(instruction_product, index) in instruction_products" :key="index" class="bg-white padding-sm solid-bottom flex">
        <view class="radius product-thumb" :style="'background-image: url(' + getPath(instruction_product.picture) + ');background-size: cover;'"></view>
        <view class="flex-sub margin-left-sm flex flex-direction">
          <view>
            <text class="text-black text-lg product-name">{{instruction_product.name}}</text>
          </view>
          <view class="flex justify-between align-end product-action">
            <view><text class="text-red text-xl text-bold text-price">{{instruction_product.price}}</text></view>
            <view class="text-sm margin-left text-grey flex-sub">已售 {{instruction_product.sold}}</view>
            <view><button class="cu-btn line-red" :data-need-login="true" :data-url="'/pages/instructor/product?id=' + instruction_product.id" @tap="navigateTo">购买</button></view>
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
    name: "products",
    mixins: [mixin],
    data() {
      return {
        type: 'skiing',
        products: [],
        instruction_products: [],
        cards: [],
        product_loading: true,
      }
    },
    components: {
      loadMore
    },
    onLoad() {
      this.getProducts()
      this.getInstructionProducts()
      this.getCards()
    },
    onPullDownRefresh() {
      let that = this
      that.products = []
      that.instruction_products = []
      that.cards = []
      that.product_loading = true
      that.getProducts()
      that.getInstructionProducts()
      that.getCards()
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 1000)
    },
    methods: {
      getProducts() {
        let that = this
        that.$http.get('/products').then(res => {
          that.products = res
          that.product_loading = false
        })
      },
      getInstructionProducts() {
        let that = this
        that.$http.get('/instruction-products').then(res => {
          that.instruction_products = res
          that.product_loading = false
        })
      },
      getCards() {
        let that = this
        that.$http.get('/cards').then(res => {
          that.cards = res
          that.product_loading = false
        })
      },
    },
  }
</script>

<style scoped>
  .product-thumb {
    width: 200upx;
    height: 200upx;
    background-color: #8799a3;
  }

  .product-name {
    font-size: 32upx;
    font-weight: 400;
    line-height: 40upx;
    height: 120upx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .product-action {
    height: 80upx;
  }
</style>