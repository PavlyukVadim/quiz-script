const keywords = [
  'test',     // type of var, consist of questions
  'question', // type of var, part of test
  'if',       // cond statement
  'else',     // cond statement
  'forEach',  // loof
  'as',       // variable declaration inside forEach
  'true',     // bool value
  'false'     // bool value
]

const punctuationSymbols = [',', ';', '(', ')', '{', '}', '[', ']']
const operationSymbols = ['+', '-', '*', '/', '%', '=', ':', '&', '|', '<', '>', '!']
const identifierSymbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const whitespaceSymbols = [' ', '\t', '\n']

module.exports = {
  keywords,
  punctuationSymbols,
  operationSymbols,
  identifierSymbols,
  whitespaceSymbols,
}
