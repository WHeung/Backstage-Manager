import { parseDate, addZero, reduceZero } from './dataParse.js'

const daysInWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
// example: 2017-06-09 周一
export function dateFormat (time) {
  const parsedDate = parseDate(time)
  return parsedDate.year + '-' +
    addZero(parsedDate.month) + '-' +
    addZero(parsedDate.dayOfMonth) + ' ' +
    numberToDay(parsedDate.dayOfWeek)
}

// example: date => 2017-06-05 15:14:15
export function dateToString (time) {
  const parsedDate = parseDate(time)
  return parsedDate.year + '-' +
    addZero(parsedDate.month) + '-' +
    addZero(parsedDate.dayOfMonth) + ' ' +
    addZero(parsedDate.hours) + ':' +
    addZero(parsedDate.minutes) + ':' +
    addZero(parsedDate.seconds)
}

// example: [1, Sat Jan 01 2000 16:30:00 GMT+0800 (中国标准时间)] => 2550
export function DayDateToString (array) {
  if (!array[0] && !array[1]) {
    return ''
  }
  const dayHours = array[0] > 0 ? array[0] * 24 : ''
  // const remainMinutes = typeof array[1] === 'object' ? array[1].toTimeString() : 0
  var str
  if (typeof array[1] === 'object') {
    const arr = array[1].toTimeString().split(' ')[0].split(':')
    arr[0] = dayHours + parseInt(arr[0])
    str = arr.join(':')
  } else {
    str = dayHours + ':00:00'
  }
  return str
}

// example: 2550 => [1, Sat Jan 01 2000 16:30:00 GMT+0800 (中国标准时间)]
export function StringToDayDate (str) {
  const arr = str.split(':')
  const day = parseInt(arr[0] / 24) > 0 ? parseInt(arr[0] / 24) : ''
  arr[0] %= 24
  const remainTimeStr = arr.join(':')
  return [day, StringHHmmToDate(remainTimeStr)]
}

// example: 500 => 8h 20m
export function minutesToHHmm (minutes) {
  if (minutes < 0) {
    return `0h 0m`
  }
  return `${parseInt(minutes / 60)}h ${minutes % 60}m`
}

// example: Sat Jan 01 2000 16:30:00 GMT+0800 (中国标准时间) => 990
export function DateToNumberMinutes (date) {
  const arr = (date + '').match(/\d\d(?=:)/g)
  return parseInt(arr[0]) * 60 + parseInt(arr[1])
}

// example: Sat Jan 01 2000 16:30:00 GMT+0800 (中国标准时间) => 16:30
export function DateToStringHHmm (date) {
  const str = (/\d\d:\d\d(?=:)/).exec(date + '')
  return str ? str[0] : ''
}

// example: 16:30 || 16:30:20 => Sat Jan 01 2000 16:30:00 GMT+0800 (中国标准时间)
export function StringHHmmToDate (str) {
  return new Date('2000-1-1 ' + str)
}

// example: 16:30 => Sat Jan 01 2000 16:30:00 GMT+0800 (中国标准时间)
export function NumberMinutesToDate (num) {
  if (num < 0) {
    return new Date('2000-1-1 00:00')
  }
  let str = parseInt(num / 60) + ':' + num % 60
  num > 1439 && (str = '23:59')
  return new Date('2000-1-1 ' + str)
}

// example: 一
export function numberToWordFormat (n) {
  const arr = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  return arr[n]
}
// example: 周三 22
export function weekhoursFormat (time) {
  if (typeof time !== 'number') {
    time = 0
  }
  const parsedDate = parseDate(time)
  return numberToDay(parsedDate.dayOfWeek) + ' ' + parsedDate.hours
}

// example: 09-30 14 mm-dd hh
export function monthdayhoursFormat (time) {
  const parsedDate = parseDate(time)
  return addZero(parsedDate.month) + '-' + addZero(parsedDate.dayOfMonth) + ' ' + addZero(parsedDate.hours)
}
// example: 09-30
export function monthdayFormat (time) {
  const parsedDate = parseDate(time)
  return addZero(parsedDate.month) + '-' + addZero(parsedDate.dayOfMonth)
}
// example: 21:45
export function timeFormat (time) {
  const parsedDate = parseDate(time)
  return addZero(parsedDate.time.hour) + '：' + addZero(parsedDate.time.minute)
}

export function durationFormatCN (time) {
  const parsedDate = parseDate(time, true)
  return reduceZero(parsedDate.time.hour) + '小时' + parsedDate.time.minute + '分钟'
}

export function dateFormatYMD (time) {
  const parsedDate = parseDate(time)
  return parsedDate.year + '-' +
    addZero(parsedDate.month) + '-' +
    addZero(parsedDate.dayOfMonth)
}

export function htmlSecurity (html) {
  html = cleanScript(html)
  html = cleanLink(html)
  html = cleanStyle(html)
  return html
}

export function pHtmltopStr (html) {
  html = html.match(/<[^>]+>[^<]*<\/[^>]+>/ig) // 全局match下不能 只匹配但不捕获，需要先提取所有匹配想再 替换跳掉需要捕获的
  html = html.map(item => {
    item = item.replace(/<\/?[^>]+>/ig, '')
    return item
  })
  html = html.join('\n')
  return html
}

export function pStrtopHtml (str) {
  let html = str.split('\n')
  html = html.map(item => {
    return '<p>' + item + '</p>'
  })
  html = html.join('')
  return html
}

export function imgHtmltoimgStr (html) {
  html = html.match(/<img.*?>/ig)
  html = html.map(item => {
    item = item.match(/src=["'](.*)?["']/i)[1]
    return item
  })
  html = html.join('\n')
  return html
}

export function imgStrtoimgHtml (str) {
  let html = str.split('\n')
  html = html.map(item => {
    return '<img class="visa_img" style="display:block;width:100%;" src="' + item + '">'
  })
  html = html.join('')
  html = '<div style="padding: 10px 10px 0 10px;">' + html + '</div>'
  return html
}

function cleanEndsHtml (str) {
  return str.replace(/^\s*<[^>]+>\s*/i, '').replace(/\s*<\/[^>]+>\s*$/i, '')
}
function splitHtml (str) {
  return str.split(/<\/[^>]+>[\s^<]*<[^>]+>/ig)
}

function cleanScript (str) {
  return str.replace(/<\/?script[^>]*>/i, '')
}

function cleanLink (str) {
  return str.replace(/<\/?a[^>]*>/i, '')
}

function cleanStyle (str) {
  return str.replace(/style="[^"]+"/i, '')
}

function numberToDay (value) {
  return daysInWeek[parseInt(value, 10)] || value
}
