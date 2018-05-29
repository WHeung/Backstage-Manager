import Axios from 'axios'
import * as types from '../types'
import getTimeStampId from '../../tool/getTimeStampId'

const apiMap = {}
const axiosRequest = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiMap[types.FETCH_SALESLIST_DATA] = function ({ info }) {
  return axiosRequest.post('/admin-sell/list',
    JSON.stringify({
      id: getTimeStampId(),
      data: info
    })
  )
}

apiMap[types.POST_SALESLIST_STATUS] = function ({ data }) {
  return axiosRequest.post('/admin-sell/change-status',
    JSON.stringify({
      id: getTimeStampId(),
      data
    })
  )
}

export default apiMap
