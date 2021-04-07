const observable = require('./observable')
const autorun = require('./autorun')

const data = observable({
  name: 'jack',
  address: { street: 'wenyi road' },
})

autorun(() => {
  console.log('autorun1', data.name)
  console.log('autorun1', data.address.street)
})

autorun(() => {
  console.log('autorun2', data.name)
})

// data.name = 'bob'
// data.address.street = 'wener road'
