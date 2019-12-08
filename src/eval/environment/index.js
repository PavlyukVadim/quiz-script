const globalVars = {
  print: console.log
}

class Environment {
  constructor (parent) {
    this.vars = Object.create(parent ? parent.vars : null)
    if (parent) {
      this.parent = parent
    }
  }

  lookup (name) {
    let scope = this
    while (scope) {
      if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
        return scope
      }
      scope = scope.parent
    }
  }

  getVarValue (name) {
    if (name in this.vars) {
      return this.vars[name]
      // TODO: refactor
    } else if (this.parent && name in this.parent.vars) {
      return this.parent.vars[name]
    } else if (name in globalVars) {
      return globalVars[name]
    }
    throw new Error('Undefined variable ' + name)
  }

  setVarValue (name, value) {
    const scope = this.lookup(name)
    if (!scope && this.parent) {
      throw new Error('Undefined variable ' + name)
    }
    return (scope || this).vars[name] = value
  }
}

module.exports = Environment
