import Axios from 'axios'
import * as types from '../types'
import getTimeStampId from '../../tool/getTimeStampId'

const apiMap = {}
const axiosRequest = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiMap[types.FETCH_SALES_ORDER_LIST] = function (searchData) {
  return axiosRequest.post('/admin-sell/order/list',
    JSON.stringify({
      id: getTimeStampId(),
      data: searchData
    })
  )
}

// NEW, TICKETING, SUCCESS, WAITPAY, FAIL, CANCELED
apiMap[types.FETCH_SALES_ORDER_CHANGE_STATUS] = function ({ orderId, changeStatus }) {
  return axiosRequest.post('/admin-sell/order/change-status',
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        orderId,
        changeStatus
      }
    })
  )
}

apiMap[types.POST_SALES_ORDER_LIST] = function (orderId) {
  window.open(`/admin-sell/order/export-passengerInfo?ids=${orderId.join(',')}`)
  // return axiosRequest.post('/admin-sell/order/export-passengerInfo',
  //   JSON.stringify({
  //     id: getTimeStampId(),
  //     data: { orderId }
  //   })
  // )
}

apiMap[types.FETCH_SALES_ORDER_DETAIL] = function ({ orderId }) {
  return axiosRequest.post(`/admin-sell/order/detail`,
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        orderId
      }
    })
  )
}

apiMap[types.FETCH_SALES_ORDER_MARK] = function ({ orderId, orderMark }) {
  return axiosRequest.post(`/admin-sell/order/mark`,
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        orderId,
        orderConfig: { orderMark }
      }
    })
  )
}

apiMap[types.FETCH_SALES_TW_ORDER_LIST] = function (searchData) {
  return axiosRequest.post('/tw/order/list',
    JSON.stringify({
      id: getTimeStampId(),
      data: searchData
    })
  )
}

apiMap[types.FETCH_SALES_TW_ORDER_DETAIL] = function (orderId) {
  return axiosRequest.post('/tw/order/detail',
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        orderId
      }
    })
  )
}

apiMap[types.FETCH_SALES_TW_ORDER_UPDATE] = function (data) {
  return axiosRequest.post('/tw/order/update-order',
    JSON.stringify({
      id: getTimeStampId(),
      data: data
    })
  )
}

apiMap[types.FETCH_SALES_TW_ORDER_FILE] = function (orderId) {
  return axiosRequest.post('/tw/order/files/all',
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        orderId
      }
    })
  )
}

export default apiMap
