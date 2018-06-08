const $example = document.getElementById('typed-om')!
const $container = $example.getElementsByTagName('ol')[0]
const template = $example.getElementsByTagName('template')[0].innerHTML
const $demo = document.getElementById('demo')!

const stringifyLog = (val: any, index: number) => {
  console.log(`${index} :`, val)

  return JSON.stringify(val, null, 4)
}

const render = (...expressions: Function[]) => {
  const content = expressions.map((exp, index) => template.replace(
    /(?<expression>\$\{Expression\})|(?<result>\$\{Result\})/g,
    (_, _1, _2, _3, _4, { expression, result }) =>
      expression
        ? exp.toString()
        : result ?
          stringifyLog(exp(), index) :
          'error',
  )).join('')

  $container!.innerHTML = content
}

//  Test Typed OM
render(
  () => {
    const {value, unit} = CSS.number('10')
    // const {value, unit} = CSS.px(42)
    // const {value, unit} = CSS.percent('10')
    // const {value, unit} = CSS.deg(45)

    return { value, unit }
  },
  () => {
    $demo.attributeStyleMap.set('margin-top', CSS.px(10))
    // $demo.attributeStyleMap.set('margin-top', CSS.px(10).to('cm'))
    const { value, unit } = $demo.attributeStyleMap.get('margin-top')

    return { value, unit }
  },
  () => {
    // $demo.style.opacity = '0.30.1'
    $demo.attributeStyleMap.set('opacity', CSS.number(0.3))
    const { value, unit } = $demo.attributeStyleMap.get('opacity')

    return { value, unit }
  },
  () => {
    // $demo.attributeStyleMap.delete('opacity')
    // $demo.attributeStyleMap.clear('opacity')
    // $demo.attributeStyleMap.set('position', 'absolute')
    // $demo.attributeStyleMap.set('display', new CSSKeywordValue('initial'))
    const ret: any[] = []
    for (const [style, val] of $demo.attributeStyleMap) {
      ret.push({ style, value: val })
    }

    return ret
  },
  () => {
    const value = [
      new CSSMathNegate(CSS.px(42)).toString(),
      new CSSMathInvert(CSS.s(10)).toString(),
      new CSSMathProduct(CSS.deg(90), CSS.number(Math.PI / 180)).toString(),
      new CSSMathMin(CSS.percent(80), CSS.px(12)).toString(),
      new CSSMathMax(CSS.percent(80), CSS.px(12)).toString(),
      new CSSMathSum(
        CSS.px(1),
        new CSSMathNegate(
          new CSSMathProduct(2, CSS.em(3)),
        ),
      ).toString(),
    ]

    return value
  },
  () => {
    const value = [
      CSS.deg(45).mul(2),
      CSS.percent(50).max(CSS.vw(50)).toString(),
      CSS.px(1).add(CSS.px(2)),
      CSS.s(1).sub(CSS.ms(200)),
      CSS.s(1).equals(CSS.ms(1000)),
      CSS.deg(180).equals(CSS.deg(180).to('rad').to('deg')),
    ]

    return value
  },
  () => {
    const value = [
      new CSSTransformValue([
        new CSSRotate(CSS.deg(45)),
        new CSSScale(CSS.number(0.5), 0.5),
        new CSSTranslate(CSS.px(10), CSS.px(10), CSS.px(10)),
      ]).toString(),
      new CSSTranslate(CSS.px(10), CSS.px(10)).is2D,
      new CSSTranslate(CSS.px(10), CSS.px(10), CSS.px(10)).is2D,
      new CSSTranslate(CSS.px(10), CSS.px(10)).toMatrix(),
      new CSSPositionValue(CSS.px(5), CSS.px(10)),
    ]

    return value
  },
  () => {
    const foo = new CSSVariableReferenceValue('--foo')

    const padding = new CSSVariableReferenceValue(
      '--default-padding',
      new CSSUnparsedValue(['8px']),
    )

    return [foo.variable, padding.variable, padding.fallback]
  },
  () => {
    try {
      const css = CSSStyleValue.parse(
        'transform',
        'translate4d(10px,10px,0) scale(0.5)',
      )

      return css
    } catch (err) {
      return 'error'
    }
  },
)

const rotate = new CSSRotate<'deg'>(0, 0, 1, CSS.deg(0))
const transform = new CSSTransformValue([rotate])

$demo.attributeStyleMap.set('transform', transform);

(function draw () {
  requestAnimationFrame(draw)
  transform[0].angle.value = transform[0].angle.value as number + 5 // Update the transform's angle.
  // rotate.angle.value += 5; // Or, update the CSSRotate object directly.
  $demo.attributeStyleMap.set('transform', transform) // commit it.
})()
