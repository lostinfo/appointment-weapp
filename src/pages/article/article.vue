<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">{{title}}</block>
    </cu-custom>
    <view class="padding-sm">
      <rich-text :nodes="article.content" v-if="article"></rich-text>
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
      if (options.id == undefined && options.code == undefined) {
        uni.showToast({
          icon: 'none',
          title: '参数错误'
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
      } else {
        let id = options.id
        let code = options.code
        if (id) {
          this.id = id
          this.type = 'id'
        }
        if (code) {
          this.code = code
          this.type = 'code'
        }
        this.getArticle()
      }
    },
    methods: {
      getArticle() {
        let that = this, url
        if (that.type == 'id') {
          url = '/article/' + that.id
        } else {
          url = '/article/code/' + that.code
        }
        that.$http.get(url).then(res => {
          that.title = res.title
          that.article = res
        })
      },
    },
  }
</script>

<style scoped>

</style>