var test = require('tape')
var processor = require('../src/index.js').processors['.html']

function s() {
  return [].join.call(arguments, '\n')
}

test('should not crash', function(t) {
  processor.preprocess('some random string')
  t.end()
})

test('should not crash on an empty string', function(t) {
  processor.preprocess('')
  t.end()
})

test('should return an array', function(t) {
  t.equal(Object.prototype.toString.call(processor.preprocess('some random string')), '[object Array]')
  t.end()
})

test('should return array with empty string if there is no script', function(t) {
  var blocks = processor.preprocess(
    s('<app>',
      '</app>')
  )
  t.equal(blocks.length, 1)
  t.equal(blocks[0], '')
  t.end()
})

test('should find code in tag', function(t) {
  var blocks = processor.preprocess(
    s('<app>',
      '  <div>hello</div>',
      '  <script type="es6">',
      '  var foo = 1',
      '  </script>',
      '</app>')
  )
  t.equal(blocks.length, 1)
  t.equal(blocks[0],
    s('',
      'var foo = 1',
      '')
  )
  t.end()
})

test('postprocess code', function(t) {
  var code = s(
    '<app>',
    '  <div>riot</div>',
    '  <script type="es6">',
    '  var answer = 6 * 7;',
    '  if (answer === 42) {',
    '    console.log(answer);',
    '  }',
    '  </script>',
    '</app>'
  )
  processor.preprocess(code)
  var messages = [
    [
      { line: 1, column: 0, message: 'Use the global form of "use strict".' },
      { line: 4, column: 3, message: 'Unexpected console statement.' }
    ]
  ]
  var result = processor.postprocess(messages)
  t.equal(result[0].message, 'Use the global form of "use strict".')
  t.equal(result[1].message, 'Unexpected console statement.')

  // line should be adjusted
  t.equal(result[0].line, 3)
  t.equal(result[1].line, 6)

  // column should be adjusted
  t.equal(result[0].column, 2)
  t.equal(result[1].column, 5)
  t.end()
})

test('postprocess tab indented code', function(t) {
  var code = s(
    '<app>',
    '  <div>riot</div>',
    '\t<script type="es6">',
    '\tfunction boolean(arg) {',
    '\t\treturn;',
    '\t\t!!arg;',
    '\t};',
    '\t</script>',
    '</app>'
  )
  processor.preprocess(code)
  var messages = [
    [
      { line: 4, column: 2, message: 'Unreachable code after return.' },
      { line: 5, column: 2, message: 'Unnecessary semicolon.' }
    ]
  ]
  var result = processor.postprocess(messages)
  t.equal(result[0].message, 'Unreachable code after return.')
  t.equal(result[1].message, 'Unnecessary semicolon.')

  // line should be adjusted
  t.equal(result[0].line, 6)
  t.equal(result[1].line, 7)

  // column should be adjusted
  t.equal(result[0].column, 3)
  t.equal(result[1].column, 3)
  t.end()
})
