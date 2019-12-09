const Environment = require('./environment')
const { expressionTypes: ET } = require('../config')

const varTypes = [
  'testVar',
  'questionVar',
  'var' // member var for objLiteral
]

const evaluate = (exp, env) => {
  switch (exp.type) {
    case 'num':
    case 'str':
    case 'bool': return exp.value
    case 'var': return env.getVarValue(exp.value)
    case 'testVar': return env.getVarValue(exp.name)

    case ET.assign: {
      if (!varTypes.includes(exp.left.type)) {
        throw new Error('Cannot assign to ' + JSON.stringify(exp.left))
      }

      let value = evaluate(exp.right, env)
      const varType = exp.left.type
      const varName = exp.left.name

      value = (varType === 'testVar') ? testFactory(value) : value
      return env.setVarValue(varName, value)
    }

    case ET.objLiteral: {
      const innerValues = {}
      exp.properties.forEach((literalAssignExp) => {
        const [key, value] = evaluate(literalAssignExp, env)
        innerValues[key] = value
      })
      return innerValues
    }

    case ET.literalAssign: {
      if (!exp.left || !varTypes.includes(exp.left.type)) {
        throw new Error('Cannot assign to ' + JSON.stringify(exp.left))
      }

      const key = exp.left.value
      const value = evaluate(exp.right, env)
      return [key, value]
    }

    case ET.member: {
      // create a inner env that includes current scope as parent
      const innerEnv = new Environment(env)
      // get all members values of the literal
      const parent = evaluate(exp.left, env)
      innerEnv.vars = {
        ...parent
      }
      // call child on a inner env
      const child = evaluate(exp.right, innerEnv)
      return child
    }

    case ET.binary: {
      return applyOp(
        exp.operator,
        evaluate(exp.left, env),
        evaluate(exp.right, env)
      )
    }

    case ET.cond: {
      const cond = evaluate(exp.cond, env)
      if (cond) {
        return evaluate(exp.then, env)
      } else if (exp.else) {
        return evaluate(exp.else, env)
      } else {
        return false
      }
    }

    case ET.loop: {
      const [varName, varValues] = evaluate(exp.inner, env)
      varValues.forEach((varValue) => {
        // create a inner env that includes current scope as parent
        const innerEnv = new Environment(env)
        innerEnv.vars = {
          [varName]: varValue
        }
        const result = evaluate(exp.body, innerEnv)
      })
      return
    }

    case ET.loopVar: {
      const value = evaluate(exp.left, env)
      const varName = exp.right.value
      return [varName, value]
    }

    case ET.prog: {
      let val = false
      exp.prog.forEach((exp) => {
        val = evaluate(exp, env)
      })
      return val
    }

    case ET.func: {
      const func = evaluate(exp.func, env)
      return func.apply(null, exp.args.map((arg) => {
        return evaluate(arg, env)
      }))
    }

    default: {
      console.log('env', env)
      throw new Error("I don't know how to evaluate " + exp.type)
    }
  }
}

function applyOp (op, a, b) {
  const num = (x) => {
    if (typeof x !== 'number') {
      throw new Error('Expected number but got ' + x)
    }
    return x
  }

  switch (op) {
    case '+': return num(a) + num(b)
    case '-': return num(a) - num(b)
    case '*': return num(a) * num(b)
    case '/': return num(a) / num(b)
    case '%': return num(a) % num(b)
    case '&&': return a !== false && b
    case '||': return a !== false ? a : b
    case '<': return num(a) < num(b)
    case '>': return num(a) > num(b)
    case '<=': return num(a) <= num(b)
    case '>=': return num(a) >= num(b)
    case '==': return a === b
    case '!=': return a !== b
  }
  throw new Error('Can\'t apply operator ' + op)
}

function testFactory (test) {
  const props = ['questions', 'answers']
  props.forEach((prop) => {
    test[prop] = {
      items: [],
      add: (newItem) => {
        test[prop].items.push(newItem)
      },
      remove: (wasteItem) => {
        test[prop].items = test[prop].items.filter((item) => (
          item.description !== wasteItem.description
        ))
      },
      get amount () {
        return test[prop].items.length
      }
    }
  })
  return test
}

module.exports = evaluate
