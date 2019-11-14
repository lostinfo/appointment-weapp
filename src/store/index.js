import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import http from '../utils/http_weixin'
import api from '../utils/api_weixin'

const AUTHORIZATION_NAME = 'authorization_name'

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		user: null,
		authorization: null,
		systemInfo: null,
	},
	mutations: {
		setUser(state, user) {
			state.user = user
			state.hasLogin = true
		},
		unsetUser(state) {
			state.user = null
			state.hasLogin = false
		},
		setAuthorization(state, authorization) {
			state.authorization = authorization
			uni.setStorageSync(AUTHORIZATION_NAME, authorization)
		},
		unsetAuthorization(state) {
			state.authorization = null
			uni.removeStorageSync(AUTHORIZATION_NAME)
		},
		setSystemInfo(state, systemInfo) {
			state.systemInfo = systemInfo
		},
	},
	actions: {
		// res {user: {}, token: ''}
		login({commit}, res) {
			let user = res.user
			let authorization = res.token
			return new Promise((resolve, reject) => {
				commit('setUser', user)
				commit('setAuthorization', authorization)
				resolve()
			})
		},
		autoLogin({commit}) {
			uni.login({
				success: function (res) {
					console.log('autoLogin', res)
					let code = res.code
					uni.getUserInfo({
						success: function (res) {
							api.login(code, res)
						}
					})
				}
			})
		},
		logout() {

		},
		refreshUser({commit}) {
			http.user().then(res => {
				commit('setUser', res)
			})
		},
		waitLogin({commit}) {
			return new Promise((resolve, reject) => {
				let sleep_count = 0
				let sh = setInterval(() => {
					if (this.state.user !== null) {
						clearInterval(sh)
						resolve()
					}
					if (sleep_count > 100) {
						clearInterval(sh)
						reject()
					}
					sleep_count++
				}, 200)
			})
		},
		checkSession({commit}) {

		}
	},
})

Vue.prototype.$store = store

export default store