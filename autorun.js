const Reaction = require('./Reaction')

function autorun(callback) {
  // 在 callback 执行前把它存起来
  Reaction.start(callback)
  // 这里执行 callback 时会触发 proxy 的 get trap
  callback()
  // 重置 callback
  Reaction.end()
}

module.exports = autorun
