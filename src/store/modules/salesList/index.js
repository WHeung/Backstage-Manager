import * as types from '../../types'
import callApi from '../../api'

const State = {
  selectType: 'ON_SELL',
  searchCache: {
    page: {
      page: 1,
      size: 15
    },
    status: 'ON_SELL',
    idorTitle: ''
  }
}

const Mutations = {
  [types.SET_SALES_LIST_TYPE] (state, data) {
    const init = {
      page: {
        page: 1,
        size: 15
      },
      status: 'ON_SELL',
      idorTitle: '',
      type: ''
    }
    state.searchCache = Object.assign(init, data)
  }
}

const Actions = {
  [types.UPDATE_SALES_DATA] ({ commit, state, dispatch }, { info }) {
    return new Promise(resolve => {
      callApi(types.FETCH_SALESLIST_DATA, { info }).then(res => {
        const data = res.data.data.pageInfo
        const pagination = {
          page: data.page,
          size: data.size,
          total: data.total,
          totalPage: data.totalPage
        }
        const info = data.data
        resolve({ info, pagination })
      })
    })
  },
  [types.UPDATE_SALES_STATUS] ({ dispatch }, { data }) {
    return new Promise((resolve, reject) => {
      callApi(types.POST_SALESLIST_STATUS, { data }).then(() => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  [types.UPDATE_SALES_LIST_TYPE] ({ commit }, data) {
    commit(types.SET_SALES_LIST_TYPE, data)
  }
}

export default {
  state: State,
  mutations: Mutations,
  actions: Actions
}
