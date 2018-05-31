import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'
import callApi from './api'
import salesListModule from './modules/salesList'
import salesEditModule from './modules/salesEdit'
import salesOrderModule from './modules/salesOrder'
import salesHotelModule from './modules/salesHotel'
import salesSpecialModule from './modules/salesSpecial'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    menu: [],
    breadNavList: []
  },
  mutations: {
    [types.SET_MENU] (state, menu) {
      state.menu = menu
    },
    [types.SET_BREAD_NAV] (state, list) {
      state.breadNavList = list
    }
  },
  actions: {
    [types.UPDATE_MENU] ({ state, commit }) {
      return new Promise((resolve, reject) => {
        callApi(types.FETCH_MENU).then(res => {
          commit(types.SET_MENU, res.data.data.dataList)
          resolve()
        })
      })
    }
  },
  modules: {
    sales: salesListModule,
    salesEdit: salesEditModule,
    salesOrder: salesOrderModule,
    salesHotel: salesHotelModule,
    salesSpecial: salesSpecialModule
  }
})

export default store
