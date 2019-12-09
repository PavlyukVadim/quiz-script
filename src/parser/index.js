const { compose } = require('../../utils')
const {
  binaryOperatorPrecedence,
  expressionTypes: ET,
  binaryExpressionTypesMap,
  strictPuncMode,
} = require('../config')

const parse = (input) => {
  const isPunc = (ch) => {
    const tok = input.peek()
    return (tok && (tok.type === 'punc') && (!ch || tok.value === ch))
  }

  const isKw = (kw) => {
    const tok = input.peek()
    return (tok && (tok.type === 'kw') && (!kw || tok.value === kw))
  }

  const isObjectType = (type) => {
    const objTypes = ['var', 'num', 'str']
    return objTypes.includes(type)
  }

  const skipPunc = (ch) => {
    if (isPunc(ch)) input.next()
    else if (strictPuncMode) input.croak(`Expecting punctuation: "${ch}"`)
  }

  const skipKw = (kw) => {
    if (isKw(kw)) input.next()
    else input.croak(`Expecting keyword: "${kw}'"`)
  }

  const unexpected = () => {
    input.croak(`Unexpected token: ${JSON.stringify(input.peek())}`)
  }

  const maybeBinary = (left, myPrec = 0) => {
    const tok = input.peek()
    if (!tok) return left
    const { value: tokValue } = tok
    const hisPrec = binaryOperatorPrecedence[tokValue]
    if (hisPrec > myPrec) {
      input.next()
      const defaultType = ET.binary
      const type = binaryExpressionTypesMap.get(tokValue) || defaultType

      return maybeBinary({
        type,
        operator: tokValue,
        left,
        right: maybeBinary(parseAtom(), hisPrec)
      }, myPrec)
    }
    return left
  }

  const delimited = (start, stop, separator, parser) => {
    const a = []
    let first = true
    skipPunc(start)
    while (!input.eof()) {
      if (isPunc(stop)) break
      if (first) first = false
      else skipPunc(separator)
      if (isPunc(stop)) break
      a.push(parser())
    }
    skipPunc(stop)
    return a
  }

  const parseCall = (func) => {
    return {
      type: ET.func,
      func,
      args: delimited('(', ')', ',', parseExpression)
    }
  }

  const parseVarTestName = () => {
    skipKw('test')
    const { value } = input.next()
    return { type: 'testVar', name: value }
  }

  const parseVarQuestionName = () => {
    skipKw('question')
    const { value } = input.next()
    return { type: 'questionVar', name: value }
  }

  const parseIf = () => {
    skipKw('if')
    const cond = parseExpression()
    if (!isPunc('{')) skipKw('then')
    const then = parseExpression()
    const ret = {
      type: ET.cond,
      cond,
      then
    }
    if (isKw('else')) {
      input.next()
      ret.else = parseExpression()
    }
    return ret
  }

  const parseForEach = () => {
    skipKw('forEach')
    const inner = parseExpression()
    const body = parseExpression()
    const ret = {
      type: ET.loop,
      inner,
      body
    }
    return ret
  }

  const parseBool = () => {
    const value = (input.next().value === 'true')
    return { type: 'bool', value }
  }

  const parseTopLevel = () => {
    const prog = []
    while (!input.eof()) {
      prog.push(parseExpression())
      if (!input.eof()) skipPunc(';')
    }
    return { type: ET.prog, prog }
  }

  const parseProg = () => {
    const prog = delimited('{', '}', ';', parseExpression)
    if (prog.length === 0) return { type: 'bool', value: false }
    if (prog.length === 1) return prog[0]
    return { type: ET.prog, prog }
  }

  const parseObjLiteral = () => {
    const properties = delimited('[', ']', ',', parseExpression)
    return { type: ET.objLiteral, properties }
  }

  const parseWrappedExpression = () => {
    input.next()
    const exp = parseExpression()
    skipPunc(')')
    return exp
  }

  // check does it a function call
  const maybeCall = (expr) => isPunc('(') ? parseCall(expr) : expr

  const exprGetter = () => {
    if (isPunc('(')) return parseWrappedExpression()
    if (isPunc('{')) return parseProg()
    if (isPunc('[')) return parseObjLiteral()
    if (isKw('if')) return parseIf()
    if (isKw('forEach')) return parseForEach()
    if (isKw('true') || isKw('false')) return parseBool()
    if (isKw('test')) return parseVarTestName()
    if (isKw('question')) return parseVarQuestionName()

    const tok = input.next()
    if (isObjectType(tok.type)) return tok

    unexpected()
    return null
  }

  const parseAtom = compose(maybeCall, exprGetter)
  const parseExpression = compose(maybeCall, maybeBinary, parseAtom)

  return parseTopLevel()
}

module.exports = parse
