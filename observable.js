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
