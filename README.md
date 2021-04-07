## 简单的 mobx 实现（基于 proxy）

实现路径：

1. 对需要观察的对象进行递归 proxy 化，同时为每个 proxy 绑定一个 Reaction 实例，用于收集和运行 autorun 回调。
2. 当 autorun 执行时，会触发对应 proxy 的 get，此处把当前 autorun 的回调和对应 Reaction 实例关联起来。
3. 当触发 proxy 的 set 时，对应 reaction 会运行收集好的回调。

## 运行

```js
node index.js
```

## 源码

`Reaction.js`

```js
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
```

`observable.js`

```js
const Reaction = require('./Reaction')

function observable(data) {
  if (typeof data !== 'object') return data

  for (let key in data) {
    data[key] = observable(data[key])
  }

  const reaction = new Reaction()
  const handler = {
    set(target, key, value) {
      const success = Reflect.set(target, key, value)
      reaction.run()
      return success
    },
    get(target, key) {
      reaction.collect()
      return Reflect.get(target, key)
    },
  }
  return new Proxy(data, handler)
}

module.exports = observable
```

`autorun.js`

```js
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
```
