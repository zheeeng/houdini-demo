// Typed OM
interface Worklet {
  addModule: (pathOrBlobUrl: string) => Promise<any>
}

interface CSSPropertyDescriptor<V> {
  name: string,
  syntax?: string,
  inherits?: boolean,
  initialValue?: V,
}

interface CSS {
  paintWorklet: Worklet,
  layoutWorklet: Worklet,
  registerProperty <V>(descriptor: CSSPropertyDescriptor<V>): void,
  unregisterProperty(name: string): void,
  supports (name: string, value: any): boolean,
  number (v: number | string): CSSUnitValue<'number'>,
  px (v: number | string): CSSUnitValue<'px'>,
  vw (v: number | string): CSSUnitValue<'vw'>,
  vh (v: number | string): CSSUnitValue<'vh'>,
  em (v: number | string): CSSUnitValue<'em'>,
  s (v: number | string): CSSUnitValue<'s'>,
  ms (v: number | string): CSSUnitValue<'ms'>,
  cm (v: number | string): CSSUnitValue<'cm'>,
  deg (v: number | string): CSSUnitValue<'deg'>,
  percent (v: number | string): CSSUnitValue<'percent'>,
}

declare class CSSUnitValue<U extends string = string> {
  value: number | string
  unit: U
  to <U extends string>(unit: U): CSSUnitValue<U>
  equals (value: CSSUnitValue): CSSUnitValue
  mul (value: number): CSSUnitValue
  add (value: CSSUnitValue): CSSUnitValue
  sub (value: CSSUnitValue): CSSUnitValue
  max (value: CSSUnitValue): CSSUnitValue
}

declare class CSSTransformComponent {}
declare class CSSRotate<A extends 'deg'| 'rad'> extends CSSTransformComponent {
  angle: CSSUnitValue<A>
  is2D: boolean
  constructor(angle: CSSUnitValue<A>)
  constructor(
    x: CSSUnitValue | number | string,
    y: CSSUnitValue | number | string,
    z: CSSUnitValue | number | string,
    angle: CSSUnitValue<A>
  )
}
declare class CSSScale extends CSSTransformComponent {
  constructor(
    x: CSSUnitValue<'number'> | number,
    y: CSSUnitValue<'number'> | number,
    z?: CSSUnitValue<'number'> | number,
  )
}
declare class CSSTranslate extends CSSTransformComponent {
  x: CSSUnitValue
  y: CSSUnitValue
  z?: CSSUnitValue
  constructor(x: CSSUnitValue, y: CSSUnitValue, z?: CSSUnitValue)

  is2D: boolean
  toMatrix (): any
}
declare class CSSTransformValue<T extends CSSTransformComponent>  implements ArrayLike<T> {
  length: number
  [n: number]: T
  constructor (transformComponents: T[])
}

declare class CSSVariableReferenceValue {
  variable: string
  fallback?: CSSUnparsedValue
  constructor (variableName: string, unparsedValue?: CSSUnparsedValue)
}

declare class CSSStyleValue {
  static parse (name: string, value: string): any
}

declare class CSSUnparsedValue extends CSSStyleValue implements ArrayLike<string> {
  length: number
  [n: number]: string
  constructor (unparsedValues: string[])
}

declare class CSSKeywordValue<K extends string> extends CSSStyleValue {
  value: K
  constructor (keyword: K)
}

declare class CSSPositionValue extends CSSStyleValue {
  x: CSSUnitValue
  y: CSSUnitValue
  constructor (x: CSSUnitValue, y: CSSUnitValue)
  constructor (position: string)
}

// try {
//   const css = CSSStyleValue.parse('transform', 'translate3d(10px,10px,0) scale(0.5)'));
//   // use css
// } catch (err) {
//   console.error(err);
// }

// CSSMathValue
declare class CSSMathValue {
  operator: string
  value: CSSUnitValue
  values?: CSSUnitValue[]
  constructor (...operands: (CSSUnitValue | CSSMathValue)[])
}
declare class CSSMathSum extends CSSMathValue {
  operator: 'sum'
  values: CSSUnitValue[]
  constructor (...operands: (CSSUnitValue | CSSMathValue)[])
}
declare class CSSMathProduct extends CSSMathValue {
  operator: 'product'
  values: CSSUnitValue[]
  constructor (...operands: (number | CSSUnitValue | CSSMathValue)[])
}
declare class CSSMathMin extends CSSMathValue {
  operator: 'min'
  values: CSSUnitValue[]
  constructor (...operands: (CSSUnitValue | CSSMathValue)[])
}
declare class CSSMathMax extends CSSMathValue {
  operator: 'max'
  values: CSSUnitValue[]
  constructor (...operands: (CSSUnitValue | CSSMathValue)[])
}
declare class CSSMathNegate extends CSSMathValue {
  operator: 'negate'
  value: CSSUnitValue
  constructor (operand: CSSUnitValue | CSSMathValue)
}
declare class CSSMathInvert extends CSSMathValue {
  operator: 'invert'
  value: CSSUnitValue
  constructor (operand: CSSUnitValue | CSSMathValue)
}

interface AttributeStyleMap {
  get (style: string) : CSSUnitValue,
  set (style: string, value: CSSUnitValue) : void,
  set (style: string, value: string | number) : void,
  set (style: string, value: CSSStyleValue) : void,
  delete (style: string) : void,
  clear () : void,
  [Symbol.iterator](): Iterator<[string, any]>
}

interface HTMLElement {
  attributeStyleMap: AttributeStyleMap,
  computedStyleMap (): AttributeStyleMap,
}

interface PaintRenderingContext2DSettings {
  alpha: boolean
}

interface PaintRenderingContext2D extends CanvasRenderingContext2D {}

interface PaintSize {
  width: number
  height: number
}

declare abstract class CSSPainter {
  abstract paint (
    ctx: PaintRenderingContext2D,
    size: PaintSize,
    props: { get: (name: string) => any },
    args: any[]
  ): void
}

declare const registerPaint: (name: string, paintCtor: { new ():CSSPainter } ) => void

declare class LayoutChild {
  styleMap: {
    size: number
  }

  layoutNextFragment (constraints: LayoutConstraints): void
}

declare interface LayoutConstraints {
  fixedInlineSize: number
}

declare interface StylePropertyMapReadOnly {
  readonly size: number
  get (name: string): any
}

declare abstract class CSSLayout {
  intrinsicSizes (): Iterable<undefined>

  abstract layout (
    children: LayoutChild[],
    edges: any, constraints: LayoutConstraints,
    styleMap:StylePropertyMapReadOnly
  ): Iterable<any | {autoBlockSize: number, childFragments: any}>
}

declare class LayoutFragment {
  blockOffset: number
  blockSize: number
  inlineOffset: number
  inlineSize: number
}

type LayoutRequest = void

declare const registerLayout: (name: string, layoutCtor: { new ():CSSLayout } ) => LayoutRequest
