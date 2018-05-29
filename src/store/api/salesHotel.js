import Axios from 'axios'
import * as types from '../types'
import getTimeStampId from '../../tool/getTimeStampId'

const apiMap = {}
const axiosRequest = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiMap[types.FETCH_SALES_HOTEL_LIST] = function (searchData) {
  return axiosRequest.post('/admin-sell/hotel/list',
    JSON.stringify({
      id: getTimeStampId(),
      data: searchData
    })
  )
}

// NEW, TICKETING, SUCCESS, WAITPAY, FAIL, CANCELED
apiMap[types.FETCH_REMOVE_SALES_HOTEL] = function ({ hotelId }) {
  return axiosRequest.post('/admin-sell/hotel/delete',
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        id: hotelId
      }
    })
  )
}

apiMap[types.FETCH_SALES_HOTEL_DETAIL] = function ({ hotel }) {
  return axiosRequest.post(`/admin-sell/hotel/modify`,
    JSON.stringify({
      id: getTimeStampId(),
      data: {
        hotel
      }
    })
  )
}

export default apiMap
