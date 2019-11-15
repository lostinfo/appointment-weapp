<template>
  <view>
<!--    <cu-custom bgColor="bg-wathet" :isBack="true">-->
<!--      <block slot="backText">返回</block>-->
<!--      <block slot="content">{{title}}</block>-->
<!--    </cu-custom>-->
    <view class="padding-sm" v-if="article">
      <view class="text-lg text-bold text-black padding-tb-sm">{{article.title}}</view>
      <rich-text :nodes="article.content"></rich-text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "article",
    data() {
      return {
        id: '',
        code: '',
        type: 'id',
        title: '新闻资讯',
        article: null,
      }
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
        this.getArticle()
      }
    },
    methods: {
      getArticle() {
        let that = this
        that.$http.get('/article/' + that.id).then(res => {
          that.article = res
          uni.setNavigationBarTitle({
            title: res.title
          })
        })
      },
    },
  }
</script>

<style scoped>

</style>