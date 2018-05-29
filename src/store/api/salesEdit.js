import Axios from 'axios'
import * as types from '../types'
import getTimeStampId from '../../tool/getTimeStampId'

const apiMap = {}
const axiosRequest = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiMap[types.FETCH_SALESEDIT_HOTELLIST] = function ({ page }) {
  return axiosRequest.post('/admin-sell/hotel/list',
    JSON.stringify({
      id: getTimeStampId(),
      data: { page }
    })
  )
}

apiMap[types.FETCH_SALESEDIT_NATIONLIST] = function () {
  return axiosRequest.post('/admin-sell/nation/getCityNationName',
    JSON.stringify({
      id: getTimeStampId(),
      data: {}
    })
  )
}

apiMap[types.FETCH_SALESEDIT_PROVIDERS] = function () {
  return axiosRequest.post('/provider/select-list',
    JSON.stringify({
      id: getTimeStampId()
    })
  )
}

apiMap[types.POST_SALESEDIT_MAIN] = function ({ data }) {
  const main = Object.assign({}, data)
  if (main.sortNo !== undefined && main.sortNo === '') {
    main.sortNo = undefined
  }
  return axiosRequest.post('/admin-sell/main/modify',
    JSON.stringify({
      id: getTimeStampId(),
      data: { main }
    })
  )
}

apiMap[types.POST_SALESEDIT_FLIGHT] = function ({ data }) {
  return axiosRequest.post('/admin-sell/flight/modify',
    JSON.stringify({
      id: getTimeStampId(),
      data: { flights: data }
    })
  )
}

apiMap[types.POST_SALESEDIT_HOTEL] = function ({ data }) {
  return axiosRequest.post('/admin-sell/redisdence-info/modify',
    JSON.stringify({
      id: getTimeStampId(),
      data: { sellHotel: data }
    })
  )
}

apiMap[types.POST_SALESEDIT_STORE] = function ({ data }) {
  data.forEach(item => {
    if (typeof item.displayRemainStock !== 'number') {
      item.displayRemainStock = 0
    }
    if (typeof item.displayTotalStock !== 'number') {
      item.displayTotalStock = 0
    }
    if (!item.departureDate) {
      item.departureDate = '2028-09-30 00:00:00'
    }
  })
  return axiosRequest.post('/admin-sell/store/add-or-update',
    JSON.stringify({
      id: getTimeStampId(),
      data: { storeList: data }
    })
  )
}

apiMap[types.FETCH_SALESEDIT_FORM] = function ({ sellId }) {
  return axiosRequest.post('/admin-sell/detail',
    JSON.stringify({
      id: getTimeStampId(),
      data: { sellId }
    })
  )
}

apiMap[types.POST_SALESEDIT_FORM_DEL_HOTEL] = function ({ ids }) {
  return axiosRequest.post('/admin-sell/redisdence-info/delete',
    JSON.stringify({
      id: getTimeStampId(),
      data: { redisdenceIds: ids }
    })
  )
}

apiMap[types.POST_SALESEDIT_FORM_DEL_PRICE] = function ({ id }) {
  return axiosRequest.post('/admin-sell/store/delete',
    JSON.stringify({
      id: getTimeStampId(),
      data: { id }
    })
  )
}

apiMap[types.POST_SALESEDIT_ONLY_ITEM] = function ({ data }) {
  return axiosRequest.post('/admin-sell/quick-modify',
    JSON.stringify({
      id: getTimeStampId(),
      data: { sellDetail: data }
    })
  )
}

apiMap[types.FETECH_SALES_NODETYPE] = function ({ id }) {
  return axiosRequest.post('/admin-sell/nodetype/change',
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        sellId: id,
        nodeType: 'PARENT'
      }
    })
  )
}

apiMap[types.POST_SALESEDIT_FORM_DEL_FLIGHT] = function ({ ids }) {
  return axiosRequest.post('/admin-sell/flight/delete',
    JSON.stringify({
      id: getTimeStampId(),
      data: { ids }
    })
  )
}

export default apiMap
