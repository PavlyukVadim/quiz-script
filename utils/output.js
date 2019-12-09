const outputAstToConsole = (ast, code) => {
  console.log('Code sample:\n', code)
  console.log('AST:\n', ast)
  console.log('AST:\n', JSON.stringify(ast, null, 2))
}

const outputEnv = (env) => {
  console.log('env:\n', JSON.stringify(env, null, 2))
}

module.exports = {
  outputAstToConsole,
  outputEnv
}
