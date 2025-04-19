import van from 'vanjs-core'

console.log('Content script loaded')

const { div, input, ul, li } = van.tags

const Overlay = () => {
  const overlayStyle =
    'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 9999; cursor: pointer;'

  const handleMouseEvent = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Mouse event:', {
      type: e.type,
      x: e.clientX,
      y: e.clientY,
      button: e.button,
    })
  }

  const handleKeyEvent = (e: KeyboardEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Key event:', {
      type: e.type,
      key: e.key,
      code: e.code,
    })
  }

  return div(
    {
      class: 'game-overlay',
      style: overlayStyle,
      onclick: handleMouseEvent,
      onmousedown: handleMouseEvent,
      onmouseup: handleMouseEvent,
      onmousemove: handleMouseEvent,
      onkeydown: handleKeyEvent,
      onkeyup: handleKeyEvent,
      onkeypress: handleKeyEvent,
      tabindex: 0, // Makes the div focusable for keyboard events
    },
    div({ class: 'game' }, div({ class: 'game-title' }, 'High Noon'), div({ class: 'game-content' }, 'Game content'))
  )
}

van.add(document.body, Overlay())
