const outputAstToConsole = (ast, code) => {
  console.log('Code sample:\n', code)
  console.log('AST:\n', ast)
  console.log('AST:\n', JSON.stringify(ast, null, 2))
}

const testVariableAssignCode = `
  test t = [
    title: "My first test",
  ]
`
// const astOfTestVariableAssignCode = parse(TokenStream(InputStream(testVariableAssignCode)))
// outputAstToConsole(astOfTestVariableAssignCode, testVariableAssignCode)



const questionVariableAssignCode = `
  question q1 = [
    description: "What's your name",
  ]
`
// const astOfQuestionVariableAssignCode = parse(TokenStream(InputStream(questionVariableAssignCode)))
// outputAstToConsole(astOfQuestionVariableAssignCode, questionVariableAssignCode)




const testMembersExprCode = `
  t->questions->add(q1)
`
// const astOfTestMembersExprCode = parse(TokenStream(InputStream(testMembersExprCode)))
// outputAstToConsole(astOfTestMembersExprCode, testMembersExprCode)



const testMembersWithLiteralExprCode = `
  t->answers->add([
    id: 1,
    q1: "Vadim",
    q2: "21",
  ])
`
// const astOfTestMembersWithLiteralExprCode = parse(TokenStream(InputStream(testMembersWithLiteralExprCode)))
// outputAstToConsole(astOfTestMembersWithLiteralExprCode, testMembersWithLiteralExprCode)




const condStatementSampleCode = `
  if (t->questions->amount > 2) {
    print("remove doesn\'t work")
  }
`
// const astOfCondStatementSampleCode = parse(TokenStream(InputStream(condStatementSampleCode)))
// outputAstToConsole(astOfCondStatementSampleCode, condStatementSampleCode)



const forEachSampleCode = `
  forEach(t->questions as q) {
    print(q->description)
  }
`
// const astOfForEachSampleCode = parse(TokenStream(InputStream(forEachSampleCode)))
// outputAstToConsole(astOfForEachSampleCode, forEachSampleCode)



const fullCodeSample = `
  test t = [
    title: "My first test",
  ]

  question q1 = [
    description: "What's your name",
  ]

  question q2 = [
    description: "How old are you",
  ]

  question q3 = []

  t->questions->add(q1)
  t->questions->add(q2)
  t->questions->add(q3)
  t->questions->remove(q3)

  # t->questions->amount 2

  if (t->questions->amount > 2) {
    print("remove doesn\'t work")
  }

  t->answers->add([
    id: 1,
    q1: "Vadim",
    q2: "21",
  ])

  t->answers->add([
    id: 2,
    q1: "Max",
    q2: "25",
  ])

  forEach(t->questions as q) {
    print(q->description)
  }
  
  forEach(t->answers as a) {
    print(a->some)
  }
`
const astOfFullSampleCode = parse(TokenStream(InputStream(fullCodeSample)))
outputAstToConsole(astOfFullSampleCode, fullCodeSample)
