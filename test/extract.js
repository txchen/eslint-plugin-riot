var test = require('tape')
var extract = require('../src/extract.js')

function assertExtract(test, html, code, line, indent) {
  var result = extract(html)
  test.equal(result.code, code)
  test.equal(result.line, line)
  test.equal(result.indent, indent)
}

function s() {
  return [].join.call(arguments, '\n')
}

test('extract tag with no script', function(t) {
  assertExtract(t,
    s('<app>',
      '</app>'),
    '',
    0, 0
  )
  t.end()
})

test('extract simple es6 script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script type="es6">var foo = 1</script>',
      '</x-tag>'),
    s('var foo = 1'),
    2, 0
  )
  t.end()
})

test('extract simple javascript script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script type="javascript">var foo = 1</script>',
      '</x-tag>'),
    s('var foo = 1'),
    2, 0
  )
  t.end()
})

test('extract simple babel script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script type="babel">var foo = 1</script>',
      '</x-tag>'),
    s('var foo = 1'),
    2, 0
  )
  t.end()
})

test('ignore script with no type', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script>var foo = 1</script>',
      '</x-tag>'),
    '',
    0, 0
  )
  t.end()
})

test('ignore non-es6 script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '<script type="coffee">var foo = 2</script>',
      '</x-tag>'),
    '',
    0, 0
  )
  t.end()
})

test('process indented script', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '  <script type="es6">',
      '    var foo = 1  ',
      '  </script>',
      '</x-tag>'),
    s('',
      'var foo = 1  ',
      ''),
    2, 4
  )
  t.end()
})

test('process multiple script tag file, should only extract the 1st block', function(t) {
  assertExtract(t,
    s('<x-tag>',
      '  <script type="es6">',
      '    var foo = 1  ',
      '  </script>',
      '',
      '  <script type="es6">',
      '    var foo = 2  ',
      '  </script>',
      '</x-tag>'),
    s('',
      'var foo = 1  ',
      ''),
    2, 4
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
    s('var foo = 1',
      '  var baz = 1',
      ''),
    2, 0
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
      'var foo = 1',
      'var baz = 1'),
    4, 2
  )
  t.end()
})

test('trim last line spaces', function(t) {
  assertExtract(t,
    s('<app>',
      '  <div>test</div>',
      '',
      '  <script type="es6">',
      '    var foo = 1  ',
      '  </script>',
      '</app>'),
    s('',
      'var foo = 1  ',
      ''),
    4, 4
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
      'if (a < b) {',
      '  doit()',
      '}',
      ''),
    2, 2
  )
  t.end()
})

test('extract script with tab', function(t) {
  assertExtract(t,
    s('<app>',
      '\t<script type="es6">',
      '\tvar b = 1',
      '\t</script>',
      '</app>'),
    s('',
      'var b = 1',
      ''),
    2, 1
  )
  t.end()
})
