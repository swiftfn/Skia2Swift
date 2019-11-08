const {getDataType} = require('../castxml')

const renderValue = ($, value) => {
  const node = $(value)
  const name = node.attr('name')
  const init = node.attr('init')
  return `${name} = ${init}`
}

const renderValues = ($, values) => {
  let acc = []
  values.each((idx, value) => {
    acc.push('  ' + renderValue($, value))
  })
  return acc.join(',\n')
}

const renderEnumHeader = ($, declaration) => {
  const {node, values} = declaration
  const name = getDataType($, node)
  return `enum ${name} {
${renderValues($, values)}
};`
}

const register = (registry) => {
  registry['enum'] = renderEnumHeader
}

module.exports = {
  register
}
