const keywords = [
  'test', // type of var, consist of questions
  'question', // type of var, part of test
  'if', // cond statement
  'else', // cond statement
  'forEach', // loop
  'as', // variable declaration inside forEach
  'true', // bool value
  'false' // bool value
]

const punctuationSymbols = [',', ';', '(', ')', '{', '}', '[', ']']
const operationSymbols = ['+', '-', '*', '/', '%', '=', ':', '&', '|', '<', '>', '!']
const identifierSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const whitespaceSymbols = [' ', '\t', '\n']

const binaryOperatorPrecedence = {
  '=': 1, // assign
  ':': 1, // assign for props inside literals
  '||': 2, // bool or
  '&&': 3, // bool and
  '<': 4, // les
  '>': 4, // more
  '<=': 4, // les or equal
  '>=': 4, // more or equal
  '==': 4, // equal
  '!=': 4, // not equal
  '+': 5, // plus
  '-': 5, // minus
  '*': 6, // multiple
  '/': 6, // divide
  '%': 6, // remaining from dividing
  '->': 7, // access to props
  as: 7 // forEach var identifier
}

module.exports = {
  keywords,
  punctuationSymbols,
  operationSymbols,
  identifierSymbols,
  whitespaceSymbols,
  binaryOperatorPrecedence
}
