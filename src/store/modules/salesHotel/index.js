import * as types from '../../types'
import callApi from '../../api'

const State = {
  list: [],
  hotel: {},
  total: 0
}

const Mutations = {
  [types.SET_SALES_HOTEL_LIST] (state, { list, total }) {
    state.list = list
    state.total = total
  },
  [types.SET_SALES_HOTEL_DETAIL] (state, data) {
    state.hotel = Object.assign({}, state.hotel, data)
  }
}

const Actions = {
  [types.UPDATE_SALES_HOTEL_LIST] ({ commit, state, dispatch }, searchData) {
    return new Promise((resolve) => {
      callApi(types.FETCH_SALES_HOTEL_LIST, searchData).then(res => {
        commit(types.SET_SALES_HOTEL_LIST, {
          list: res.data.data.pageInfo.data || [],
          total: res.data.data.pageInfo.total || 0
        })
        resolve()
      })
    })
  },
  [types.UPDATE_SALES_HOTEL_DETAIL] ({ commit, state, dispatch }, { hotelId = null, updateHotel = null }) {
    if (!updateHotel) {
      let currentHotel = {
        name: '',
        engName: '',
        city: '',
        address: '',
        cover: '',
        stars: '',
        introduction: '',
        id: '',
        createTime: '',
        modifyTime: ''
      }
      if (hotelId) {
        currentHotel = state.list.find((h) => {
          return h.id === hotelId
        })
      }
      commit(types.SET_SALES_HOTEL_DETAIL, currentHotel)
    } else {
      return new Promise((resolve) => {
        callApi(types.FETCH_SALES_HOTEL_DETAIL, { hotel: updateHotel }).then(res => {
          commit(types.SET_SALES_HOTEL_DETAIL, res.data.data.hotel)
          resolve()
        })
      })
    }
  },
  [types.UPDATE_REMOVE_SALES_HOTEL] ({ commit, state, dispatch }, { hotelId }) {
    return new Promise((resolve) => {
      callApi(types.FETCH_REMOVE_SALES_HOTEL, { hotelId }).then(res => {
        resolve()
      })
    })
  }
}

export default {
  state: State,
  mutations: Mutations,
  actions: Actions
}
