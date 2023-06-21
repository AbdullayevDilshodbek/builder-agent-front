import Vue from 'vue'
import Vuex from 'vuex'
import login from './login/index'
import user from './user/index'
import location from './location/index'
import costType from './costType/index'
import cashbox from './cashbox/index'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    login,
    user,
    location,
    costType,
    cashbox
  }
})
