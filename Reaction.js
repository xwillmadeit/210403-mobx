// 用于保存当前正在执行的 callback
let currentCallback = null
// 唯一值
let id = 0

class Reaction {
  constructor() {
    this.id = ++id
    this.reactionMap = {}
  }
  /**
   * 收集 callback
   */
  collect() {
    if (currentCallback) {
      const callbacks = this.reactionMap[this.id]
      if (callbacks) {
        if (callbacks.indexOf(currentCallback) === -1) {
          this.reactionMap[this.id].push(currentCallback)
        }
      } else {
        this.reactionMap[this.id] = [currentCallback]
      }
    }
  }

  /**
   * 运行 callback
   */
  run() {
    if (this.reactionMap[this.id]) {
      this.reactionMap[this.id].forEach((cb) => {
        cb()
      })
    }
  }

  static start(callback) {
    currentCallback = callback
  }

  static end() {
    currentCallback = null
  }
}

module.exports = Reaction
