var path = require('path')
var fs = require('fs')

const targetPath = path.join(__dirname, '../../heung-node-server/views/manager')
const copyPath = path.join(__dirname, '../static')

fs.readdir(targetPath, (err, data) => {
  if (!err) {
    fs.rmdirSync(targetPath)
  }
  fs.mkdir(targetPath, (err) => {
    if (!err) {
      fs.readdir(copyPath, (err, paths) => {
        if (!err) {
          paths.forEach((filepath) => {
            var _copy = path.join(copyPath, filepath)
            var _target = path.join(targetPath, filepath)
            fs.stat(_copy, function (err, stat) {
              if (!err) {
                fs.writeFileSync(_target, fs.readFileSync(_copy))
              }
            })
          })
        }
      })
    }
  })
})

