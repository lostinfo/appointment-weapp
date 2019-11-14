<template>
  <view>
    <cu-custom bgColor="bg-wathet" :isBack="true">
      <block slot="backText">返回</block>
      <block slot="content">季卡折扣查询</block>
    </cu-custom>
    <view class="bg-white">
      <Article :code="'card_query_discount_notice'"></Article>
    </view>
    <view class="cu-form-group margin-top-sm">
      <view class="title">身份证</view>
      <input placeholder="请输入身份证" name="input" :value="queryModel.idcard" data-key="idcard" @change="inputChange">
    </view>
    <view class="padding flex flex-direction">
      <button class="cu-btn bg-green lg" @tap="queryDiscount">查询</button>
    </view>
    <view class="cu-modal" :class="show_form_errors?'show':''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">提示信息</view>
          <view class="action" @tap="hideFormErrors">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl">
          <view v-for="(error, index) in form_errors" :key="index">
            <text class="text-gray align-center">{{error.message}}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import Article from '../../components/article'
  import AsyncValidator from 'async-validator'

  export default {
    name: "query_discount",
    data() {
      return {
        queryModel: {
          idcard: '',
        },
        queryRules: {
          idcard: [
            {required: true, message: '请输入身份证'},
          ]
        },
        show_form_errors: false,
        form_errors: [],
      }
    },
    components: {
      Article
    },
    created() {

    },
    mounted() {

    },
    methods: {
      inputChange(e) {
        let that = this
        let key = e.currentTarget.dataset.key
        let type = e.currentTarget.dataset.type !== undefined ? e.currentTarget.dataset.type : 'string'
        let value = e.detail.value
        switch (type) {
          case 'string':
            value = value.toString()
            break
          case 'int':
            value = parseInt(value)
            break
          case 'float':
            value = parseFloat(value)
            break
        }
        that.queryModel[key] = value
      },
      queryDiscount() {
        let that = this
        uni.showLoading({
          mask: true
        })
        let validator = new AsyncValidator(that.queryRules)
        validator.validate(that.queryModel, {}, (errors, fields) => {
          if (errors) {
            uni.hideLoading()
            that.form_errors = errors
            that.show_form_errors = true
            return false
          }
          that.$http.post('/idcard-discounts/query', that.queryModel).then(res => {
            uni.hideLoading()
            uni.showModal({
              title: '查询结果',
              content: res.msg,
              showCancel: false,
              confirmText: '确定',
            })
          })
        })
      },
      hideFormErrors() {
        this.show_form_errors = false
        this.form_errors = []
      },
    },
  }
</script>

<style scoped>

</style>