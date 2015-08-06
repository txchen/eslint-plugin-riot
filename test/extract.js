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

test('extract simple script', function(t) {
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

test('ignore non es6 script', function(t) {
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

test('process indented script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '  <script type="es6">',
      '    var foo = 1',
      '  </script>',
      '</x-tag>'),
    s('',
      '',
      'var foo = 1',
      ''),
    [ { line: 4, column: 4 } ]
  )
  t.end()
})

test('extract script with 1st line next to the script tag', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script type="es6">var foo = 1',
      '  var baz = 1',
      '</script>',
      '</x-tag>'),
    s('',
      'var foo = 1',
      '  var baz = 1',
      ''),
    [ { line: 4, column: 0 } ]
  )
  t.end()
})

test('extract script with last line next to the script tag', function(t) {
  assertExtract(t,
    s('<app>',
      '  <div>test</div>',
      '',
      '  <script type="es6">',
      '  var foo = 1',
      '  var baz = 1</script>',
      '</app>'),
    s('',
      '',
      '',
      '',
      'var foo = 1',
      'var baz = 1'),
    [ { line: 6, column: 2 } ]
  )
  t.end()
})

test('extract multiple script tags', function(t) {
  assertExtract(t,
    s('<my-footer>',
      '  <div>',
      '    <span>{ name }</span>',
      '  </div>',
      '',
      '  <script type="es6">',
      '  var foo = 1',
      '  var baz = 1',
      '  </script>',
      '',
      '  <script type="es6">',
      '    var foo = 2',
      '    var baz = 2',
      '  </script>',
      '  <script>non-es6</script>',
      '</my-footer>'),
    s('',
      '',
      '',
      '',
      '',
      '',
      'var foo = 1',
      'var baz = 1',
      '',
      '',
      '',
      'var foo = 2',
      'var baz = 2',
      ''),
    [ { line: 9, column: 2 },
      { line: 14, column: 4 } ]
  )
  t.end()
})

test('trim last line spaces', function(t) {
  assertExtract(t,
    s('<app>',
      '  <div>test</div>',
      '',
      '  <script type="es6">',
      '    var foo = 1',
      '  </script>',
      '</app>'),
    s('',
      '',
      '',
      '',
      'var foo = 1',
      ''),
    [ { line: 6, column: 4 } ]
  )
  t.end()
})

test('extract script containing "lt" characters', function(t) {
  assertExtract(t,
    s('<app>',
      '  <script type="es6">',
      '  if (a < b) {',
      '    doit()',
      '  }',
      '  </script>',
      '</app>'),
    s('',
      '',
      'if (a < b) {',
      '  doit()',
      '}',
      ''),
    [ { line: 6, column: 2 } ]
  )
  t.end()
})
