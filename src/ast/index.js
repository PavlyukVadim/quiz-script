const { InputStream, TokenStream } = require('../parser/streams')
const { parse } = require('../parser')
const { compose } = require('../../utils')

const astBuilder = compose(parse, TokenStream, InputStream)

module.exports = astBuilder
