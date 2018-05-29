import * as types from '../../types'
import callApi from '../../api'
import { Notification } from 'element-ui'

const Actions = {
  [types.INIT_SALES_FORM] ({ state, dispatch }) {
    state.form = {
      main: {
        status: 'ON_SELL'
      },
      childs: [{
        mainBean: {},
        flightInfoBeans: [],
        adminSellHotelBeans: [],
        storeBeans: [],
        isFlight: true,
        isHotel: true
      }]
    }
  },
  [types.UPDATE_SALESEDIT_SELECTDATA] ({ commit, state, dispatch }, pType) { // 库存页面必须请的通用接口
    return new Promise(resolve => {
      const page = {
        page: 1,
        size: 0
      }
      const promiseList = []
      if (pType === 'TRAVEL') {
        const hotelList = dispatch(types.UPDATE_SALESEDIT_HOTELLIST, { page })
        promiseList.push(hotelList)
      }
      const nationList = dispatch(types.UPDATE_SALESEDIT_NATIONLIST)
      promiseList.push(nationList)
      // const suppliers = dispatch(types.UPDATE_SALESEDIT_PROVIDERS) // 暂无供应商接口
      Promise.all(promiseList).then(res => {
        resolve()
      })
    })
  },
  [types.UPDATE_SALESEDIT_HOTELLIST] ({ commit, state, dispatch }, { page }) { // 查询 可选择的酒店列表
    return new Promise((resolve) => {
      if (state.hotelList && state.hotelList.length) {
        resolve()
      } else {
        callApi(types.FETCH_SALESEDIT_HOTELLIST, { page }).then(res => {
          const hotelList = res.data.data.pageInfo.data.map(item => {
            const hotel = {
              hotelId: item.id,
              name: item.name,
              city: item.city
            }
            return hotel
          })
          commit(types.SET_SALESEDIT_HOTELLIST, hotelList)
          resolve()
        })
      }
    })
  },
  [types.UPDATE_SALESEDIT_NATIONLIST] ({ commit, state, dispatch }) { // 查询 可选择的国家列表
    return new Promise((resolve) => {
      if (state.nationList && state.nationList.length) {
        resolve()
      } else {
        callApi(types.FETCH_SALESEDIT_NATIONLIST).then(res => {
          const nationList = res.data.data.dataList
          commit(types.SET_SALESEDIT_NATIONLIST, nationList)
          resolve()
        })
      }
    })
  },
  [types.UPDATE_SALESEDIT_PROVIDERS] ({ commit, state, dispatch }) { // 查询 可选择的供应商列表
    return new Promise((resolve) => {
      callApi(types.FETCH_SALESEDIT_PROVIDERS).then(res => {
        resolve(res.data.data)
      })
    })
  },
  [types.UPDATE_SALES_TABS] ({ commit, state }, { actTab }) {
    commit(types.SET_SALES_TABS, actTab)
  },
  [types.ADD_SALES_FORM_CHILD] ({ commit, state, dispatch }, { tabMsg }) {
    if (tabMsg.firstTabtip) {
      const main = { tabTip: tabMsg.firstTabtip }
      state.form.childs[0].mainBean = Object.assign({}, state.form.childs[0].mainBean, main)
    }
    const newChild = {
      mainBean: {
        tabTip: tabMsg.newTabtip
      },
      flightInfoBeans: [],
      adminSellHotelBeans: [],
      storeBeans: [],
      isFlight: true,
      isHotel: true
    }
    const childs = state.form.childs
    childs.push(newChild)
    dispatch(types.UPDATE_SALES_TABS, { actTab: childs.length - 1 + '' })
  },
  [types.UPDATE_SALESEDIT_FORM] ({ commit, state, dispatch }, { sellId }) {
    return new Promise((resolve, reject) => {
      callApi(types.FETCH_SALESEDIT_FORM, { sellId }).then(res => {
        const form = res.data.data.detail
        commit(types.SET_SALES_FORM_MAIN, form.mainBean)
        if (form.mainBean.nodeType === 'SINGLE') {
          callApi(types.FETECH_SALES_NODETYPE, { id: sellId }) // 如果是单独产品调用一下转换父子产品接口
          const errMsg = { name: 'SINGLE' }
          reject(errMsg)
        } else {
          /** 刚上线统一父子产品时候，因酒店信息归类到父产品之下导致作出的兼容，现不需要
           const firstChild = form.adminSellChilds[0]
           if (form.adminSellHotelBeans &&
             form.adminSellHotelBeans.length &&
             form.adminSellChilds.length === 1 &&
             (!firstChild.adminSellHotelBeans || !firstChild.adminSellHotelBeans.length)
           ) { // 父产品有酒店信息，子产品没有的时候
             firstChild.adminSellHotelBeans = form.adminSellHotelBeans
             firstChild.adminSellHotelBeans.forEach(item => {
               item.id = ''
               item.sellId = firstChild.mainBean.id
             })
           }
          */
          form.adminSellChilds.forEach((item, index) => {
            if (form.mainBean.productType === 'TRAVEL') {
              item.isFlight = true
              item.isHotel = true
              if (!item.flightInfoBeans || item.flightInfoBeans.length === 0) {
                item.isFlight = false
              }
              if (!item.adminSellHotelBeans || item.adminSellHotelBeans.length === 0) {
                item.isHotel = false
              }
            }
            commit(types.SET_SALES_FORM_CHILD, { child: item, index })
          })
          resolve()
        }
      })
    })
  },
  [types.UPDATE_SALESEDIT_FORM_CHILD] ({ commit, state, dispatch }, { sellId, index }) {
    callApi(types.FETCH_SALESEDIT_FORM, { sellId }).then(res => {
      const form = res.data.data.detail // 请求的直接是子元素的id，所以不需要点出childs
      if (form.mainBean.productType === 'TRAVEL') {
        form.isFlight = true
        form.isHotel = true
        if (!form.flightInfoBeans || form.flightInfoBeans.length === 0) {
          form.isFlight = false
        }
        if (!form.adminSellHotelBeans || form.adminSellHotelBeans.length === 0) {
          form.isHotel = false
        }
      }
      commit(types.SET_SALES_FORM_CHILD, { child: form, index })
    })
  },
  [types.SUBMIT_SALESEDIT_FORM] ({ state, commit, dispatch }, { pType }) {
    return new Promise((resolve, reject) => {
      const form = state.form
      callApi(types.POST_SALESEDIT_MAIN, { data: form.main }).then(res => {
        const result = res.data.data.main
        commit(types.SET_SALES_FORM_MAIN, { id: result.id })
        const allPromise = []
        const parent = Object.assign({}, result)
        delete parent.id
        form.childs.forEach((item, index) => {
          allPromise[index] = dispatch(types.SUBMIT_SALESEDIT_FORM_CHILD, { pType, index, parentId: result.id, parent: parent })
        })
        Promise.all(allPromise).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      }).catch(() => {
        Notification.error({
          title: '保存失败详情',
          message: `产品主要信息保存失败`,
          duration: 0
        })
        reject()
      })
    })
  },
  [types.SUBMIT_SALESEDIT_FORM_CHILD] ({ state, commit, dispatch }, { pType, index, parentId, parent }) {
    return new Promise((resolve, reject) => {
      const child = Object.assign({}, state.form.childs[index])
      commit(types.SET_SALES_FORM_CHILD_MAIN, { main: { parentId }, index })
      const parentData = {
        cover: parent.cover,
        pictures: parent.pictures,
        earlyDay: parent.earlyDay,
        nationName: parent.nationName,
        productType: parent.productType,
        providerId: parent.providerId,
        closeTime: parent.closeTime,
        seckillCloseTime: parent.seckillCloseTime,
        seckillOpenTime: parent.seckillOpenTime,
        soldOutTime: parent.soldOutTime,
        title: parent.title,
        type: parent.type
      }
      Object.assign(child.mainBean, parentData, { parentId }) // 把子产品main不能修改的数据从父产品复制一份
      callApi(types.POST_SALESEDIT_MAIN, { data: child.mainBean }).then(res => {
        const result = res.data.data.main
        const callList = []
        commit(types.SET_SALES_FORM_CHILD_MAIN, { main: { id: result.id, parentId }, index })
        const mergeItem = { sellId: result.id } // mergeItem = { sellId: result.id }
        commit(types.SET_SALES_FORM_CHILD_STORE, { store: mergeItem, index })
        if (pType === 'TRAVEL') {
          commit(types.SET_SALES_FORM_CHILD_FLIGHT, { flight: mergeItem, index })
          commit(types.SET_SALES_FORM_CHILD_HOTEL, { hotel: mergeItem, index })
          if (child.isFlight) {
            if (child.flightInfoBeans && child.flightInfoBeans.length === 2) {
              if (!child.flightInfoBeans[1].companyCode) {
                child.flightInfoBeans[1].companyCode = child.flightInfoBeans[0].companyCode
              }
            }
            const flight = callApi(types.POST_SALESEDIT_FLIGHT, { data: child.flightInfoBeans }).then((res) => {
              const flights = res.data.data.dataList
              for (let i = 0; i < flights.length; i++) {
                child.flightInfoBeans[i].id = flights[i].id
              }
            })
            callList.push(flight)
          } else if (child.flightInfoBeans && child.flightInfoBeans.length && child.flightInfoBeans[0].id) {
            const ids = child.flightInfoBeans.map(item => {
              return item.id
            })
            const delFlight = callApi(types.POST_SALESEDIT_FORM_DEL_FLIGHT, { ids })
            callList.push(delFlight)
          }
          if (child.isHotel) {
            const hotel = callApi(types.POST_SALESEDIT_HOTEL, { data: child.adminSellHotelBeans }).then((res) => {
              const sellHotels = res.data.data.sellHotels
              for (let i = 0; i < sellHotels.length; i++) {
                child.adminSellHotelBeans[i].id = sellHotels[i].id
              }
            })
            callList.push(hotel)
          } else if (child.adminSellHotelBeans && child.adminSellHotelBeans.length && child.adminSellHotelBeans[0].id) {
            const ids = child.adminSellHotelBeans.map(item => {
              return item.id
            })
            const delHotel = callApi(types.POST_SALESEDIT_FORM_DEL_HOTEL, { ids })
            callList.push(delHotel)
          }
        }
        const store = callApi(types.POST_SALESEDIT_STORE, { data: child.storeBeans }).then((res) => {
          const stores = res.data.data.dataList
          for (let i = 0; i < stores.length; i++) {
            child.storeBeans[i].id = stores[i].id
          }
        })
        callList.push(store)
        Promise.all(callList).then((res) => {
          resolve(result.id)
        }).catch((err) => {
          console.error(err)
          if (typeof err === 'object' && err.name === 'TypeError') {
            resolve(result.id)
          }
          if (err && err.postName) {
            switch (err.postName) {
            case types.POST_SALESEDIT_FLIGHT:
              throwError('航班信息')
              break
            case types.POST_SALESEDIT_HOTEL:
              throwError('酒店信息')
              break
            case types.POST_SALESEDIT_STORE:
              throwError('库存信息')
              break
            case types.POST_SALESEDIT_FORM_DEL_FLIGHT:
              throwError('删除航班信息')
              break
            case types.POST_SALESEDIT_FORM_DEL_HOTEL:
              throwError('删除酒店信息')
              break
            }
          }
          reject()
        })
      }).catch(() => {
        throwError('主要信息')
        reject()
      })
    })
    function throwError (msg) {
      Notification.error({
        title: '保存失败详情',
        message: `多规格产品第${parseInt(index + 1)}个产品的${msg}保存失败`,
        duration: 0
      })
    }
  },
  [types.DELETE_SALESEDIT_FORM_HOTEL] ({ state, dispatch }, { ids }) {
    return new Promise((resolve, reject) => {
      callApi(types.POST_SALESEDIT_FORM_DEL_HOTEL, { ids }).then(() => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  [types.DELETE_SALESEDIT_FORM_PRICE] ({ state, dispatch }, { id }) {
    return new Promise((resolve, reject) => {
      callApi(types.POST_SALESEDIT_FORM_DEL_PRICE, { id }).then(() => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  [types.SUBMIT_SALESEDIT_ONLY_STORE] ({ commit, state, dispatch }, { pType, index }) {
    return new Promise((resolve, reject) => {
      commit(types.SET_SALES_FORM_CHILD_STORE, { store: { sellId: state.form.childs[index].mainBean.id }, index })
      callApi(types.POST_SALESEDIT_STORE, { data: state.form.childs[index].storeBeans }).then((res) => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  [types.UPDATE_SALESEDIT_ONLY_STORE] ({ commit, state }, { index }) {
    return new Promise(resolve => {
      callApi(types.FETCH_SALESEDIT_FORM, { sellId: state.form.childs[index].mainBean.id }).then(res => {
        const stores = res.data.data.detail.storeBeans // 请求的直接是子元素的id，所以不需要点出childs
        commit(types.SET_SALES_FORM_CHILD_STORE, { stores, index })
        resolve()
      })
    })
  },
  [types.UPDATE_SALESEDIT_ONLY_HOTEL] ({ commit, state }, { index }) {
    return new Promise(resolve => {
      callApi(types.FETCH_SALESEDIT_FORM, { sellId: state.form.childs[index].mainBean.id }).then(res => {
        const hotels = res.data.data.detail.adminSellHotelBeans // 请求的直接是子元素的id，所以不需要点出childs
        commit(types.SET_SALES_FORM_CHILD_HOTEL, { hotels, index })
        resolve()
      })
    })
  },
  [types.SUBMIT_SALESEDIT_ONLY_ITEM] ({ commit, state }, { index, itemList }) {
    return new Promise((resolve, reject) => {
      const childMain = state.form.childs[index].mainBean
      const data = {}
      data.id = childMain.id
      itemList.forEach(item => {
        data[item] = childMain[item]
      })
      callApi(types.POST_SALESEDIT_ONLY_ITEM, { data }).then(res => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  },
  [types.UPDATE_SALESEDIT_ONLY_ITEM] ({ commit, state }, { index, itemList }) {
    return new Promise((resolve, reject) => {
      callApi(types.FETCH_SALESEDIT_FORM, { sellId: state.form.childs[index].mainBean.id }).then(res => {
        const mainBean = res.data.data.detail.mainBean // 请求的直接是子元素的id，所以不需要点出childs
        const merge = {}
        itemList.forEach(item => {
          merge[item] = mainBean[item]
        })
        const main = Object.assign({}, state.form.childs[index].mainBean, merge)
        commit(types.SET_SALES_FORM_CHILD_MAIN, { main, index })
        resolve()
      })
    })
  },
  [types.COPY_SALESEDIT_PARENT] ({ commit, state }, { sellId }) {
    return new Promise(resolve => {
      callApi(types.FETCH_SALESEDIT_FORM, { sellId }).then(res => {
        const main = res.data.data.detail.mainBean
        const parent = Object.assign({}, main)
        delete parent.id
        resolve(parent)
      })
    })
  },
  [types.DELETE_SALESEDIT_FORM_FLIGHT] ({ commit, state }, { ids }) {
    return new Promise((resolve, reject) => {
      callApi(types.POST_SALESEDIT_FORM_DEL_FLIGHT, { ids }).then(res => {
        resolve()
      }).catch(() => {
        reject()
      })
    })
  }
}

export default Actions
