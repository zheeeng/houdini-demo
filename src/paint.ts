if (typeof registerPaint === 'function') {
  class PlaceholderBoxPainter implements CSSPainter {

    static get inputArguments () {
      return ['<length>', '<color>']
    }

    static get inputProperties () {
      return ['--line-width', '--line-color']
    }

    paint (
      ctx: PaintRenderingContext2D,
      size: PaintSize,
      props: { get: (name: string) => any },
      args: [number, string],
    ) {
      ctx.lineWidth = props.get('--line-width') || 2
      ctx.strokeStyle = props.get('--line-color') || '#666'

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(size.width, size.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(size.width, 0)
      ctx.lineTo(0, size.height)
      ctx.stroke()

      ctx.lineWidth = args[0] || 2
      ctx.strokeStyle = args[1] || '#666'

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(size.width, 0)
      ctx.lineTo(size.width, size.height)
      ctx.lineTo(0, size.height)
      ctx.lineTo(0, 0)
      ctx.stroke()
    }
  }

  registerPaint('placeholder-box', PlaceholderBoxPainter)
}
