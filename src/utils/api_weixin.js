import http from './http_weixin'
import store from '../store'

let api = {
  login(code, detail) {
    return new Promise((resolve, reject) => {
      http.post('/login', {...detail, code: code}).then(res => {
        store.dispatch('login', res).then(res => {
          resolve()
        }).catch(err => {
          reject()
        })
      }).catch(err => {
        reject()
      })
    })
  },
  user() {
    return new Promise((resolve, reject) => {
      http.get('/user').then(res => {
        store.dispatch('refreshUser', res)
      })
    })
  }
}

export default api