var test = require('tape')
var extract = require('../src/extract.js')

function assertExtract(test, html, code, map) {
  var result = extract(html)
  test.equal(result.code, code)
  test.deepEqual(result.map, map)
}

function s() {
  return [].join.call(arguments, '\n')
}

test('should extract simple script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script type="es6">var foo = 1</script>',
      '</x-tag>'),
    s('',
      'var foo = 1'),
    [ { line: 2, column: 0 } ]
  )
  t.end()
})

test('should ignore non es6 script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script>var foo = 1</script>',
      '<script type="coffee">var foo = 2</script>',
      '</x-tag>'),
    '',
    []
  )
  t.end()
})
