function stringlengthFix (str) {
  while (str.length < 4) str = '0' + str
  return str
}

exports.utf8ToEntities = function utf8ToEntities (source) {
  var result = ''

  for (let i = 0; i < source.length; i++) {
    let charCode = source.charCodeAt(i)
    if (charCode <= 127) {
      result += source.charAt(i)
    } else {
      result += '\\u' + stringlengthFix(charCode.toString(16).toUpperCase())
    }
  }
  return result
}
