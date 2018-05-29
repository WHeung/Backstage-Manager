import { checkResponseCode } from './responseCode'
import ErrorHandler from './errorHandler'
import { Message } from 'element-ui'
import menuApi from './menu'
import salesListApi from './salesList'
import salesEditApi from './salesEdit'
import salesOrderApi from './salesOrder'
import salesHotelApi from './salesHotel'
import salesSpecial from './salesSpecial'
import dreamTrip from './dreamTrip'

const apiMap = {
  ...menuApi,
  ...salesListApi,
  ...salesEditApi,
  ...salesOrderApi,
  ...salesHotelApi,
  ...salesSpecial,
  ...dreamTrip
}

export default function callApi (apiName, params) {
  return new Promise((resolve, reject) => {
    apiMap[apiName](params).then(res => {
      console.log(res.data)
      const codeResult = checkResponseCode(res.data.state)
      if (codeResult.isSuccess) {
        resolve(res)
      } else {
        ErrorHandler(codeResult)
        codeResult.postName = apiName
        reject(codeResult)
      }
    }).catch(() => {
      Message.error({
        showClose: true,
        message: '服务器繁忙:'
      })
      reject()
    })
  })
}
