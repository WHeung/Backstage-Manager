export function addZero (num) {
  return ('0' + num).slice(-2)
}

export function reduceZero (num) {
  return ('' + num).replace(/^0/, '')
}

export function parseDate (value, isUTC) {
  const parsedDate = {
    year: null,
    month: null,
    dayOfMonth: null,
    dayOfWeek: null,
    hours: null,
    minutes: null,
    seconds: null,
    time: null
  }

  if (typeof value === 'number') {
    return parseDate(new Date(value), isUTC)
  } else if (typeof value.getFullYear === 'function') {
    parsedDate.year = String(value.getFullYear())
    parsedDate.month = String(value.getMonth() + 1)
    parsedDate.dayOfMonth = String(value.getDate())
    parsedDate.dayOfWeek = String(value.getDay())
    parsedDate.hours = String(value.getHours())
    parsedDate.minutes = String(value.getMinutes())
    parsedDate.seconds = String(value.getSeconds())
    parsedDate.time = parseTime(getTime(value.toString()) + '.' + value.getMilliseconds())
    if (isUTC) {
      parsedDate.year = String(value.getUTCFullYear())
      parsedDate.month = String(value.getUTCMonth() + 1)
      parsedDate.dayOfMonth = String(value.getUTCDate())
      parsedDate.dayOfWeek = String(value.getUTCDay())
      parseDate.hours = String(value.getUTCHours())
      parseDate.minutes = String(value.getUTCMinutes())
      parseDate.seconds = String(value.getUTCSeconds())
      parsedDate.time = parseTime(getTime(value.toUTCString()) + '.' + value.getMilliseconds())
    }
  }
  return parsedDate
}

function getTime (value) {
  return value.match(/\d{2}:\d{2}:\d{2}/)[0]
}

function parseTime (value) {
  // 10:54:50.546
  // => hour: 10, minute: 54, second: 50, millis: 546
  let time = value
  let hour
  let minute
  let second
  let millis = ''
  let delimited

  if (time.indexOf('.') !== -1) {
    delimited = time.split('.')
    // split time and milliseconds
    time = delimited[0]
    millis = delimited[delimited.length - 1]
  }

  const timeArray = time.split(':')

  if (timeArray.length === 3) {
    hour = timeArray[0]
    minute = timeArray[1]
    // '20 GMT-0200 (BRST)'.replace(/\s.+/, '').replace(/[a-z]/gi, '');
    // => 20
    // '20Z'.replace(/\s.+/, '').replace(/[a-z]/gi, '');
    // => 20
    second = timeArray[2].replace(/\s.+/, '').replace(/[a-z]/gi, '')
    // '01:10:20 GMT-0200 (BRST)'.replace(/\s.+/, '').replace(/[a-z]/gi, '');
    // => 01:10:20
    // '01:10:20Z'.replace(/\s.+/, '').replace(/[a-z]/gi, '');
    // => 01:10:20
    time = time.replace(/\s.+/, '').replace(/[a-z]/gi, '')
    return {
      time: time,
      hour: hour,
      minute: minute,
      second: second,
      millis: millis
    }
  }

  return { time: '', hour: '', minute: '', second: '', millis: '' }
}
