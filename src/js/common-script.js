'use strict';

(global => {
  function enumerationBuilder (list) {
    let enumeration = {}
    for (let entry of list) {
      enumeration[entry] = entry
    }
    return enumeration
  }

  let MESSAGETYPE = enumerationBuilder([
    'GETLINKS',
    'OPENLINKS',
    'TABOPENED',
    'SETOPENEDTABCOUNT'
  ])

  let GETMODE = {
    'NONE': 0,
    'FOLLOWING': 1 << 0
  }

  /* explicit export variables */
  global.enumerationBuilder = enumerationBuilder
  global.MESSAGETYPE = MESSAGETYPE
  global.GETMODE = GETMODE
})(this)
