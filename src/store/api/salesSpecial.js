import Axios from 'axios'
import * as types from '../types'
import getTimeStampId from '../../tool/getTimeStampId'

const apiMap = {}
const axiosRequest = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiMap[types.FETCH_SPECIAL_LIST] = function (searchData) {
  return axiosRequest.post('/admin-sell/nation/list',
    JSON.stringify({
      id: getTimeStampId(),
      data: searchData
    })
  )
}

apiMap[types.FETCH_SPECIAL_VISA_LIST] = function (searchData) {
  return axiosRequest.post('/admin-sell/nation/item-list',
    JSON.stringify({
      id: getTimeStampId(),
      data: searchData
    })
  )
}

apiMap[types.FETCH_SALES_SPECIAL_DETAIL] = function (data) {
  return axiosRequest.post('/admin-sell/nation/detail',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

apiMap[types.POST_SALES_SPECIAL_EDIT] = function (data) {
  return axiosRequest.post('/admin-sell/nation/modify',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

apiMap[types.POST_SALES_SPECIAL_ITEM_EDIT] = function (data) {
  return axiosRequest.post('/admin-sell/nation/quick-modify',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

apiMap[types.POST_SALES_SPECIAL_VISA_EDIT] = function (data) {
  return axiosRequest.post('/admin-sell/nation/item-modify',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

apiMap[types.POST_SALES_SPECIAL_DELETE] = function (data) {
  return axiosRequest.post('/admin-sell/nation/delete',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

apiMap[types.POST_SALES_SPECIAL_VISA_DELETE] = function (data) {
  return axiosRequest.post('/admin-sell/nation/item-delete',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}
export default apiMap
