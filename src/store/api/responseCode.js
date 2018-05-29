import * as types from '../types'

export function checkResponseCode (state) {
  if (state.code + '' === '0') {
    return { isSuccess: true }
  } else {
    return {
      code: state.code,
      msg: state.msg,
      isSuccess: false,
      type: checkType(state.code)
    }
  }
}

export const HTTP_REPEAT_REQUEST_ERROR = 20304

function checkType (code) {
  code = code + ''
  switch (code) {
  case '60102':
    return types.UNLOGIN_HTTP_ERROR
  case '60103':
    return types.NOPERMISSIONS_HTTP_ERROR
  default:
    return types.UNKOWN_HTTP_ERROR
  }
}
