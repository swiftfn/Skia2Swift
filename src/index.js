// https://github.com/Leonidas-from-XIV/node-xml2js

const fs = require('fs')
const cheerio = require('cheerio')

const {Enum} = require('./enum')
const {Class} = require('./class')
const {Struct} = require('./struct')
const {isTopScope} = require('./util')

const CAST_XML = 'input/SkSize.xml'
const CPP_HEADER = 'SkSize.h'

// const CAST_XML = 'input/SkCanvas.xml'
// const CPP_HEADER = 'SkCanvas.h'

const loadXml = (fileName) => {
  const xml = fs.readFileSync(fileName)
  return cheerio.load(xml, {xmlMode: true})
}

const getHeaderFileId = ($, fileName) => {
  const elem = $(`File[name$="/${fileName}"]`)
  // console.log(elem)
  return elem.attr('id')
}

// Select top nodes of the header file
const getTopNodes = ($, fileId) => {
  const topNodes = $(`:root > [file="${fileId}"]`)
  // console.log(topNodes.length)
  // console.log(topNodes)
  return topNodes
}

const collectStructures = ($, topNodes) => {
  const structures = []

  topNodes.each((idx, node) => {
    node = $(node)

    if (!isTopScope(node)) {
      return
    }

    const type = node.prop('nodeName')
    switch (type) {
      case 'CLASS': {
        structures.push(new Class($, node))
        break
      }

      case 'STRUCT': {
        structures.push(new Struct($, node))
        break
      }

      case 'OPERATORFUNCTION': {
        // TODO
        break
      }

      case 'ENUMERATION': {
        structures.push(new Enum($, node))
        break
      }

      default: {
        console.log(`Unhandled node type "${type}"`, node)
      }
    }
  })

  return structures
}

const renderCHeader = (structures) => {
  let ret = `#ifdef __cplusplus
extern "C" {
#endif

`
  for (const s of structures) {
    ret += s.renderCHeader()
  }

  ret += `
#ifdef __cplusplus
}
#endif
`
  return ret
}

const renderCImpl = (structures) => {
  let ret = `#include "${CPP_HEADER}"
#include "c_${CPP_HEADER}"\n`

  for (const s of structures) {
    ret += s.renderCImpl()
  }

  return ret
}

const renderSwift = (structures) => {
  let ret = 'import CSkia\n\n'

  for (const s of structures) {
    ret += s.renderSwift()
  }

  return ret
}

async function main() {
  const $ = await loadXml(CAST_XML)
  const fileId = getHeaderFileId($, CPP_HEADER)
  const topNodes = getTopNodes($, fileId)
  const structures = collectStructures($, topNodes)

  console.log(renderCHeader(structures))
  console.log(renderCImpl(structures))
  console.log(renderSwift(structures))
}

main()