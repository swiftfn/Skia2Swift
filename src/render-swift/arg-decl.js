const {renderArgs: renderArgsUtil} = require('../render-util/arg')
const {getSwiftDataType} = require('./data')

const renderDeclArg = ($, arg) => {
  const node = $(arg)
  const name = node.attr('name')
  const typeId = node.attr('type')
  const type = getSwiftDataType($, typeId)
  return `${name}: ${type}`
}

const renderDeclArgs = ($, args) =>
  renderArgsUtil($, args, renderDeclArg)

module.exports = {
  renderDeclArg,
  renderDeclArgs
}
