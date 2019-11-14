<template>
  <view class="padding-sm">
    <rich-text :nodes="content" class="margin-tb-xl" v-if="content != ''"></rich-text>
    <view v-if="loading">
      <view class="cu-load bg-white loading"></view>
    </view>
    <view v-if="has_error">
      <view class="cu-load bg-red erro"></view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "Article",
    props: {
      id: {
        required: false,
        type: Number,
        default: null,
      },
      code: {
        required: false,
        type: String,
        default: null,
      },
    },
    data() {
      return {
        loading: true,
        has_error: false,
        title: '',
        content: '',
      }
    },
    mounted() {
      console.log('mounted', this.id, this.code)
      this.getArticle()
    },
    methods: {
      getArticle() {
        let that = this, url
        if (that.id) {
          url = '/article/' + that.id
        } else {
          url = '/article/code/' + that.code
        }
        that.$http.get(url).then(res => {
          that.loading = false
          that.title = res.title
          that.content = res.content
        }).catch(err => {
          that.loading = false
          that.has_error = true
        })
      },
    },
  }
</script>

<style scoped>

</style>