import * as types from '../../types'
import callApi from '../../api'

const State = {
  detail: {},
  productType: 'TRAVEL',
  searchCache: {
    productType: 'TRAVEL',
    orderId: '',
    sellId: '',
    title: '',
    contactMobile: '',
    status: '',
    page: {
      page: 1,
      size: 20
    }
  }
}

const Mutations = {
  [types.SET_SALES_ORDER_LIST_PTYPE] (state, data) {
    const init = {
      productType: 'TRAVEL',
      orderId: '',
      sellId: '',
      title: '',
      contactMobile: '',
      status: '',
      page: {
        page: 1,
        size: 20
      }
    }
    state.searchCache = Object.assign(init, data)
  },
  [types.SET_SALES_ORDER_DETAIL] (state, data) {
    state.detail = Object.assign({}, state.detail, data)
  }
}

const Actions = {
  [types.UPDATE_SALES_ORDER_LIST_PTYPE] ({ commit }, data) {
    commit(types.SET_SALES_ORDER_LIST_PTYPE, data)
  },
  [types.UPDATE_SALES_ORDER_LIST] ({ commit, state, dispatch }, searchData) {
    return new Promise((resolve) => {
      callApi(types.FETCH_SALES_ORDER_LIST, searchData).then(res => {
        const pageInfo = res.data.data.pageInfo
        resolve({ list: pageInfo.data, total: pageInfo.total })
      })
    })
  },
  [types.EXPORT_SALES_ORDER_LIST] ({ commit, state, dispatch }, orderId) {
    callApi(types.POST_SALES_ORDER_LIST, orderId)
    // return new Promise((resolve) => {
      // callApi(types.POST_SALES_ORDER_LIST, orderId).then(res => {
      //   resolve()
      // })
    // })
  },
  [types.UPDATE_SALES_ORDER_DETAIL] ({ commit, state, dispatch }, { orderId }) {
    return new Promise((resolve) => {
      callApi(types.FETCH_SALES_ORDER_DETAIL, { orderId }).then(res => {
        commit(types.SET_SALES_ORDER_DETAIL, res.data.data.detail)
        resolve()
      })
    })
  },
  [types.UPDATE_SALES_ORDER_CHANGE_STATUS] ({ commit, state, dispatch }, { orderId, changeStatus }) {
    return new Promise((resolve) => {
      callApi(types.FETCH_SALES_ORDER_CHANGE_STATUS, { orderId, changeStatus }).then(res => {
        commit(types.SET_SALES_ORDER_DETAIL, {
          status: changeStatus
        })
        resolve()
      })
    })
  },
  [types.UPDATE_SALES_ORDER_MARK] ({ commit, state, dispatch }, { orderId, orderMark }) {
    return new Promise((resolve, reject) => {
      callApi(types.FETCH_SALES_ORDER_MARK, { orderId, orderMark }).then(res => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  }
}

export default {
  state: State,
  mutations: Mutations,
  actions: Actions
}
