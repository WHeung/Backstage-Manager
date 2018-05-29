import Axios from 'axios'
import * as types from '../types'
import getTimeStampId from '../../tool/getTimeStampId'

const apiMap = {}
const axiosRequest = Axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
})

apiMap[types.FETCH_MENU] = function () {
  return axiosRequest.post('/sys-base/menu/list',
    JSON.stringify({
      id: getTimeStampId(),
      data: {}
    })
  )
}

export default apiMap
