const {getContextPath} = require('../../castxml')
const {getMethodCReturnType} = require('../data')
const {convertOperatorName} = require('../op')
const {renderArgs} = require('./arg')

const TAGS = {
  CONSTRUCTOR: ['constructor'],
  DESTRUCTOR: ['destructor'],
  METHOD: ['method'],
  OPERATORMETHOD: ['op', 'method']
}

const getOriginalMethodName = (methodType, node) => {
  switch (methodType) {
    case 'CONSTRUCTOR':
    case 'DESTRUCTOR':
      return []

    case 'METHOD':
    case 'OPERATORMETHOD':
      return [node.attr('name')]
  }
}

const getMethodName = ($, declaration) => {
  const {type, node, isStatic} = declaration
  const originalName = getOriginalMethodName(type, node)
  const convertedName = type == 'OPERATORMETHOD'
    ? convertOperatorName(originalName)
    : originalName
  const tag = TAGS[type]
  const suffix = isStatic ? ['static'] : []
  const parts = [getContextPath($, node), convertedName, tag, suffix]
  return parts.flat().join('_')
}

const renderMethodSignature = ($, declaration) => {
  const {type, node, isStatic, args, returns} = declaration
  const self = !isStatic && type !== 'CONSTRUCTOR'
    ? node.attr('context')
    : undefined
  return (
    getMethodCReturnType($, node, type, returns) + ' ' +
    getMethodName($, declaration) +
    renderArgs($, args, self)
  )
}

const renderMethodHeader = ($, declaration) => {
  return renderMethodSignature($, declaration) + ';'
}

const register = (registry) => {
  registry['CONSTRUCTOR'] = renderMethodHeader
  registry['DESTRUCTOR'] = renderMethodHeader
  registry['METHOD'] = renderMethodHeader
  registry['OPERATORMETHOD'] = renderMethodHeader
}

module.exports = {
  getMethodName,
  renderMethodSignature,
  register
}
