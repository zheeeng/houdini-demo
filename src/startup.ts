if ('paintWorklet' in CSS) {
  // const blob = new Blob([code], { type: 'text/javascript' })
  // const workletUrl = URL.createObjectURL(blob)

  CSS.paintWorklet.addModule('script/paint.js').then(console.log)
} else {
  document.querySelector('html')!.classList.add('no-support-paint-api')
}

if ('layoutWorklet' in CSS) {
  // const blob = new Blob([code], { type: 'text/javascript' })
  // const workletUrl = URL.createObjectURL(blob)

  CSS.layoutWorklet.addModule('script/layout.js').then(console.log)
} else {
  document.querySelector('html')!.classList.add('no-support-layout-api')
}

if ('registerProperty' in CSS) {
  CSS.registerProperty({
    name: '--gap',
    syntax: '<length>',
    initialValue: '0px',
    // inherits: true, // 默认为 false 不继承
  })

  CSS.registerProperty({
    name: '--column-default-width',
    syntax: '<length>',
    initialValue: '0px',
  })

  CSS.registerProperty({
    name: '--columns',
    syntax: '*',
    initialValue: 'auto',
  })
}
