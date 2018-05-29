/**
 @param: 对比两个对象是否完全相同
 @param: 1、将两个对象深拷贝出来不影响原来元素
 @param: 2、对象字段排列顺序不一定相等，讲子元素递归排序
 @param: 3、JSON.stringify得出的结果对比字符串
*/
export default function compareObj (obj1, obj2) {
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    obj1 = JSON.parse(JSON.stringify(obj1))
    obj2 = JSON.parse(JSON.stringify(obj2))
    const sortObj1 = sortObj(obj1)
    const sortObj2 = sortObj(obj2)
    return JSON.stringify(sortObj1) === JSON.stringify(sortObj2)
  } else {
    throw Error('all params must be Object')
  }
}

function sortObj (obj) {
  // const keys = obj.keys()
  const keys = Object.keys(obj)
  keys.sort()
  const newObj = {}
  keys.forEach(item => {
    if (typeof obj[item] === 'object') {
      obj[item] = sortObj(obj[item])
    }
    newObj[item] = obj[item]
    /**
     @param： 因为表单会初始化空字段，造成对比空字段加入对比
     @param： 因该原因直接使用_.Equal()会得出错误结果
     @param： 因此要delete 空字段再对比
     */
    if (!newObj[item]) {
      delete newObj[item]
    }
  })
  return newObj
}
