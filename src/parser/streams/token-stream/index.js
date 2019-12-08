const {
  keywords,
  punctuationSymbols,
  operationSymbols,
  identifierSymbols,
  whitespaceSymbols
} = require('../../../config')

// is functions
const isKeyword = (x) => keywords.includes(x)
const isDigit = (ch) => /[\d]/i.test(ch)
const isIdStart = (ch) => /[\w]/i.test(ch)
const isId = (ch) => (isIdStart(ch) || identifierSymbols.includes(ch))
const isOpChar = (ch) => operationSymbols.includes(ch)
const isPunc = (ch) => punctuationSymbols.includes(ch)
const isWhitespace = (ch) => whitespaceSymbols.includes(ch)

const TokenStream = (input) => {
  let current = null

  // read functions
  const readWhile = (predicate) => {
    let str = ''
    while (!input.eof() && predicate(input.peek())) {
      str += input.next()
    }
    return str
  }

  const readNumber = () => {
    let hasDot = false
    const number = readWhile((ch) => {
      if (ch === '.') {
        if (hasDot) return false
        hasDot = true
        return true
      }
      return isDigit(ch)
    })

    return {
      type: 'num',
      value: parseFloat(number)
    }
  }

  const readIdent = () => {
    const id = readWhile(isId)

    return {
      type: isKeyword(id) ? 'kw' : 'var',
      value: id
    }
  }

  const readEscaped = (end) => {
    let escaped = false; let str = ''
    input.next()
    while (!input.eof()) {
      const ch = input.next()
      if (escaped) {
        str += ch
        escaped = false
      } else if (ch === '\\') {
        escaped = true
      } else if (ch === end) {
        break
      } else {
        str += ch
      }
    }
    return str
  }

  const readString = () => ({
    type: 'str',
    value: readEscaped('"')
  })

  const readPunc = () => ({
    type: 'punc',
    value: input.next()
  })

  const readOp = () => ({
    type: 'op',
    value: readWhile(isOpChar)
  })

  const skipComment = () => {
    readWhile((ch) => ch !== '\n')
    input.next()
  }

  const readNext = () => {
    // read to first char
    readWhile(isWhitespace)
    if (input.eof()) return null
    const ch = input.peek()

    if (ch === '#') { skipComment(); return readNext() }
    if (ch === '"') return readString()
    if (isDigit(ch)) return readNumber()
    if (isIdStart(ch)) return readIdent()
    if (isPunc(ch)) return readPunc()
    if (isOpChar(ch)) return readOp()
    input.croak(`Can't handle character: ${ch}`)
  }

  const peek = () => (current || (current = readNext()))

  const next = () => {
    const tok = current
    current = null
    return tok || readNext()
  }

  const eof = () => (peek() == null)

  const croak = input.croak

  return {
    next,
    peek,
    eof,
    croak
  }
}

module.exports = TokenStream
