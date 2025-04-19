import van from 'vanjs-core'

const { div } = van.tags

const root = () =>
  div(
    {
      id: 'root',
    },
    `High Noon`
  )

van.add(document.body, root())
