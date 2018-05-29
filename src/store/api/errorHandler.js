import * as types from '../types'
import { Message } from 'element-ui'

export default function errorHandler (err, dispatch) {
  if (err.type === types.UNLOGIN_HTTP_ERROR) {
    window.location.href = '/'
  }
  if (err.type === types.NOPERMISSIONS_HTTP_ERROR) {
    Message({
      showClose: true,
      message: err.msg,
      type: 'error'
    })
  }
  if (err.type === types.UNKOWN_HTTP_ERROR) {
    if (err.msg) {
      Message({
        showClose: true,
        message: err.code + ':' + err.msg,
        type: 'error'
      })
    } else {
      Message({
        showClose: true,
        message: '未知服务器错误:' + err.code,
        type: 'error'
      })
    }
  }
}
