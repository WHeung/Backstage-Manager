import Axios from 'axios'
import * as types from '../types'
import getTimeStampId from '../../tool/getTimeStampId'

const apiMap = {}
const axiosRequest = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiMap[types.FETCH_DREAM_TRIP_ORDER_LIST] = function (data) {
  return axiosRequest.post('/event/presell/ticket/order/list',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

apiMap[types.FETCH_DREAM_TRIP_ORDER_DETAIL] = function (data) { // orderId
  return axiosRequest.post('/event/presell/ticket/order/detail',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

apiMap[types.FETCH_DREAM_TRIP_ORDER_STATUS_UPDATE] = function (data) { // status ， orderId
  return axiosRequest.post('/event/presell/ticket/order/update-status',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

export default apiMap
