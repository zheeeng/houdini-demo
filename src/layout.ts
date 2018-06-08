if (typeof registerLayout === 'function') {
  class MasonryLayout implements CSSLayout {
    static get inputProperties () {
      return [ '--gap', '--columns', '--column-default-width', '--border' ]
    }

    * intrinsicSizes () {

      return undefined
    }

    * layout (
      children: LayoutChild[],
      _edges: any,
      constraints: LayoutConstraints,
      styleMap: StylePropertyMapReadOnly,
    ) {
      const borderWidth = parseInt(styleMap.get('--border').toString()) // 边框宽度
      const inlineSize = constraints.fixedInlineSize - borderWidth * 2 //父元素宽度，6 去掉边框宽度
      let gap = parseInt(styleMap.get('--gap').toString())
      if (gap < 0) { gap = 0}
      const columnValue = styleMap.get('--columns').toString()

      const columnDefaultWidth = parseInt(styleMap.get('--column-default-width').toString())

      let columns = parseInt(columnValue)
      //  '--columns' 支持 auto 取值，根据 '--column-default-width' 的值来自动计算
      if (columnValue === 'auto' || !columns) {
        columns = Math.ceil(inlineSize / columnDefaultWidth)
      }

      // 先确定每列子元素的宽度
      const childInlineSize = (inlineSize - ((columns - 1) * gap)) / columns // 计算子元素宽度
      const childFragments: LayoutFragment[] = yield children.map(
        child => child.layoutNextFragment({ fixedInlineSize: childInlineSize }),
      )

      let autoBlockSize = 0
      const columnOffsets: number[] = Array(columns).fill(0)

      for (const childFragment of childFragments) {
        // Select the column with the least amount of stuff in it.
        const min = columnOffsets.reduce(
          (acc, val, idx) => (!acc || val < acc.val) ? { idx, val } : acc,
          { val: +Infinity, idx: -1 },
        )

        // 水平方向
        childFragment.inlineOffset = (childInlineSize + gap) * min.idx + borderWidth

        // 垂直方向
        childFragment.blockOffset = min.val === 0 ? (min.val + borderWidth) : (min.val + gap)

        // 计算外层容器高度
        columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize
        autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + borderWidth)
      }

      return { autoBlockSize, childFragments }
    }
  }

  registerLayout('masonry', MasonryLayout)
}
