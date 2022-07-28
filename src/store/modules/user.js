import { login, getInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken (state, token) {
    state.token = token
    setToken(token)
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setTime(Date.now())
    // try {
    //   const res = await login(data)
    //   if (!res.data.success) {
    //     return Promise.reject(new Error(res.data.message))
    //   }
    //   context.commit('setToken', res.data.data)
    // } catch (err) {
    //   // console.log(err)
    //   return Promise.reject(err)
    // }
  },
  async getInfo (context) {
    const res = await getInfo()
    const res1 = await getUserDetailById(res.userId)
    // console.log(res1)
    context.commit('setUserInfo', { ...res, ...res1 })
  },
  async logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

