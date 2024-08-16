import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

const Editor = forwardRef(({ content, setContent }, ref) => {
  const theme = 'snow'
  const modules = {
    toolbar: false
  }
  const placeholder = ''
  const formats = ['list', 'indent']

  const { quill, quillRef, Quill } = useQuill({ theme, modules, formats, placeholder })

  if (Quill && !quill) {
    console.log(Quill.imports)

    const ListContainer = Quill.import('formats/list-container')
    const Block = Quill.import('blots/block')
    class ListItem extends Block {
      static create(value) {
        const node = super.create()
        node.setAttribute('data-list', value['data-list'] || 'bullet')

        if (value && value['data-id']) {
          node.setAttribute('data-id', value['data-id'])
        }
        if (value && value['data-project_id']) {
          node.setAttribute('data-project_id', value['data-project_id'])
        }
        if (value && value['data-parent_topic_id']) {
          node.setAttribute('data-parent_topic_id', value['data-parent_topic_id'])
        }
        if (value && value['data-status']) {
          node.setAttribute('data-status', value['data-status'])
        }

        return node
      }

      static formats(domNode) {
        return {
          'data-list': domNode.getAttribute('data-list') || undefined,
          'data-id': domNode.getAttribute('data-id') || undefined,
          'data-project_id': domNode.getAttribute('data-project_id') || undefined,
          'data-parent_topic_id': domNode.getAttribute('data-parent_topic_id') || undefined,
          'data-status': domNode.getAttribute('data-status') || undefined
        }
      }

      static register() {
        Quill.register(ListContainer)
      }

      constructor(scroll, domNode) {
        super(scroll, domNode)
        const ui = domNode.ownerDocument.createElement('span')
        const listEventHandler = (e) => {
          if (!scroll.isEnabled()) return
          const format = this.statics.formats(domNode, scroll)
          if (format === 'checked') {
            this.format('list', 'unchecked')
            e.preventDefault()
          } else if (format === 'unchecked') {
            this.format('list', 'checked')
            e.preventDefault()
          }
        }
        ui.addEventListener('mousedown', listEventHandler)
        ui.addEventListener('touchstart', listEventHandler)
        this.attachUI(ui)
      }

      format(name, value) {
        if (name === this.statics.blotName && value) {
          this.domNode.setAttribute('data-list', value)
        } else {
          super.format(name, value)
        }
      }
    }
    ListItem.blotName = 'list'
    ListItem.tagName = 'LI'

    Quill.register('formats/list', ListItem)
  }

  useImperativeHandle(ref, () => ({
    getQuillInstance: () => quill
  }), [quill])

  useEffect(() => {
    if (quill) {
      quill.on('text-change', (delta, oldDelta, source) => {
        const text = quill.getText()
        setContent(text)
      })

      if (content) {
        quill.clipboard.dangerouslyPasteHTML(content)
      }
    }
  }, [quill, setContent, content])

  return (
    <div style={{ width: 500, height: 200 }}>
      <div ref={quillRef} />
    </div>
  )
})

export default Editor
