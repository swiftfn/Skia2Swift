const {getDataType} = require('../util')

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

const renderHeader = ($, declaration) => {
  const {node, values} = declaration
  const name = getDataType($, node)
  return `enum ${name} {
${renderValues($, values)}
};`
}

module.exports = {
  renderHeader
}