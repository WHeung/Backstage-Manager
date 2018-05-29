import * as types from '../../types'
import Actions from './actions'

const State = {
  form: null,
  originalChilds: [],
  hotelList: [],
  nationList: [],
  actTab: 'addTab'
}

const Mutations = {
  [types.SET_SALES_TABS] (state, actTab) {
    state.actTab = actTab
  },
  [types.SET_SALES_FORM_MAIN] (state, main) {
    state.form.main = Object.assign({}, state.form.main, main)
  },
  [types.SET_SALES_FORM_CHILD] (state, { child, index }) {
    state.form.childs[index] = Object.assign({}, state.form.childs[index], child)
    state.form.childs = [].concat(state.form.childs)
    saveOriginalChilds({ state, index })
  },
  [types.SET_SALES_FORM_CHILD_MAIN] (state, { main, index }) {
    state.form.childs[index].mainBean = Object.assign({}, state.form.childs[index].mainBean, main)
    saveOriginalChilds({ state, index, name: 'mainBean' })
  },
  [types.SET_SALES_FORM_CHILD_FLIGHT] (state, { flights, flight, index }) {
    if (flight) {
      state.form.childs[index].flightInfoBeans.forEach(item => {
        item = Object.assign(item, flight)
      })
    }
    if (flights) {
      state.form.childs[index].flightInfoBeans = flights
      saveOriginalChilds({ state, index, name: 'flightInfoBeans' })
    }
  },
  [types.SET_SALES_FORM_CHILD_HOTEL] (state, { hotels, hotel, index }) {
    if (hotel) {
      state.form.childs[index].adminSellHotelBeans.forEach(item => {
        item = Object.assign(item, hotel)
      })
    }
    if (hotels) {
      state.form.childs[index].adminSellHotelBeans = hotels
      saveOriginalChilds({ state, index, name: 'adminSellHotelBeans' })
    }
  },
  [types.SET_SALES_FORM_CHILD_STORE] (state, { stores, store, index }) {
    if (typeof store === 'object') {
      state.form.childs[index].storeBeans.forEach(item => {
        item = Object.assign(item, store)
      })
    }
    if (stores) {
      state.form.childs[index].storeBeans = stores
      saveOriginalChilds({ state, index, name: 'storeBeans' })
    }
  },
  [types.SET_SALESEDIT_HOTELLIST] (state, hotelList) {
    state.hotelList = hotelList
  },
  [types.SET_SALESEDIT_NATIONLIST] (state, nationList) {
    state.nationList = nationList
  }
}
function saveOriginalChilds ({ state, index, name }) { // 每次从服务器获取多规格数据的时候都有备份一份，用来监控数据更改之后未保存的情况
  const childs = JSON.parse(JSON.stringify(state.form.childs))
  if (name && state.originalChilds[index]) {
    state.originalChilds[index][name] = childs[index][name]
  } else {
    state.originalChilds[index] = childs[index]
  }
}

export default {
  state: State,
  mutations: Mutations,
  actions: Actions
}
