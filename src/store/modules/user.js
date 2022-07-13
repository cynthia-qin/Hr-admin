import { login } from '@/api/user'
const state = {
  token: ''
}
const mutations = {
  setToken (state, token) {
    state.token = token
  }
}
const actions = {
  async login (context, data) {
    try {
      const res = await login(data)
      context.commit('setToken', res.data.data)
    } catch (err) {
      console.log(err)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

