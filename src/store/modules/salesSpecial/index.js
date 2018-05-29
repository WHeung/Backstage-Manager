import * as types from '../../types'
import callApi from '../../api'

const State = {
  countrySpecial: {
    list: {},
    detail: {}
  },
  ordinarySpecial: {
    list: {},
    detail: {}
  },
  visaSpecial: {
    list: {},
    detail: {}
  }
}

const Mutaitons = {
  [types.SET_SALES_SPECIAL_LIST] (state, { list, type }) {
    switch (type) {
    case 'NORMAL' :
      // SET NORMAL LIST
      state.ordinarySpecial.list = list
      break
    case 'COUNTRY' :
      // SET COUNTRY LIST
      state.countrySpecial.list = list
      break
    case 'VISA' :
      // SET VISA LIST
      state.visaSpecial.list = list
      break
    }
  },
  [types.SET_SALES_SPECIAL_DETAIL] (state, { detail, type }) {
    switch (type) {
    case 'NORMAL' :
      // 'SET NORMAL SPECIAL
      state.ordinarySpecial.detail = detail.data.nationDetail
      break
    case 'COUNTRY' :
      // 'SET COUNTRY SPECIAL
      state.countrySpecial.detail = detail.data.nationDetail
      break
    case 'VISA' :
      // 'SET VISA SPECIAL
      state.visaSpecial.detail = detail
      break
    }
  }
}

const Actions = {
  [types.UPDATE_SPECIAL_LIST] ({ commit, state, dispatch }, searchData) { // 获取专题列表
    const commitData = (list, type) => {
      commit(types.SET_SALES_SPECIAL_LIST, { list, type })
    }
    return new Promise((resolve) => {
      if (searchData.type === 'VISA') { // 签证列表使用的接口不一样
        callApi(types.FETCH_SPECIAL_VISA_LIST, searchData).then(res => {
          commitData(res.data.data.pageInfo, 'VISA')
          resolve()
        })
      } else {
        callApi(types.FETCH_SPECIAL_LIST, searchData).then(res => {
          commitData(res.data.data.pageInfo, searchData.type)
          resolve()
        })
      }
    })
  },
  [types.UPDATE_SPECIAL_ITEM] ({ commit, state, dispatch }, data) { // 列表页上 快速更改
    const postData = {
      nationDetail: [{
        sortNo: data.sortNo || 0,
        visible: data.visible,
        id: data.id
      }]
    }
    return new Promise((resolve) => {
      callApi(types.POST_SALES_SPECIAL_ITEM_EDIT, postData).then(res => {
        resolve(res)
      })
    })
  },
  [types.UPDATE_SPECIAL_DETAIL] ({ commit, state }, data) { // 详情页数据
    return new Promise((resolve) => {
      if (data.type === 'VISA') { // 如果是签证，得到所有签证产品在遍历其id得出详情
        /** 因为专题签证没做详情页接口，所以找出所有签证再遍历出需要的商品
        */
        const searchData = {
          page: {
            page: 1,
            size: 0
          },
          type: 'VISA',
          nationId: 12
        }
        callApi(types.FETCH_SPECIAL_VISA_LIST, searchData).then(res => {
          const detail = res.data.data.pageInfo.data.find(item => {
            return item.id === data.id
          })
          commit(types.SET_SALES_SPECIAL_DETAIL, { detail, type: 'VISA' })
          resolve()
        })
      } else {
        callApi(types.FETCH_SALES_SPECIAL_DETAIL, { id: data.id }).then(res => {
          commit(types.SET_SALES_SPECIAL_DETAIL, { detail: res.data, type: data.type })
          resolve(res)
        })
      }
    })
  },
  [types.INIT_SPECIAL_DETAIL] ({ commit, state }, data) { // 清空详情页数据
    commit(types.SET_SALES_SPECIAL_DETAIL, { detail: {}, type: data.type })
  },
  [types.SUBMIT_SPECIAL_DETAIL] ({ commit, state }, data) {
    return new Promise((resolve) => {
      callApi(types.POST_SALES_SPECIAL_EDIT, data).then(res => {
        resolve(res.data)
      })
    })
  },
  [types.SUBMIT_SPECIAL_VISA] ({ commit, state }, data) { // 专题签证修改接口都换成这个
    const postData = {
      nationItems: [data]
    }
    return new Promise((resolve) => {
      callApi(types.POST_SALES_SPECIAL_VISA_EDIT, postData).then(res => {
        resolve(res)
      })
    })
  },
  [types.DELETE_SPECIAL_ITEM] ({ state }, id) {
    return new Promise((resolve) => {
      callApi(types.POST_SALES_SPECIAL_DELETE, { id: id }).then(res => {
        resolve(res.data)
      })
    })
  },
  [types.DELETE_SPECIAL_VISA] ({ state }, sellId) {
    return new Promise((resolve) => {
      const data = {
        nationId: 12,
        sellId
      }
      callApi(types.POST_SALES_SPECIAL_VISA_DELETE, data).then(res => {
        resolve()
      })
    })
  }
}

export default {
  state: State,
  actions: Actions,
  mutations: Mutaitons
}
