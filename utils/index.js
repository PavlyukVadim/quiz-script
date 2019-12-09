const { ...output } = require('./output')

const compose = (...fns) => (x) => fns.reduceRight((x, fn) => fn(x), x)

module.exports = {
  compose,
  ...output
}
