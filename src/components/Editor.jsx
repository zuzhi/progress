import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { useQuill } from 'react-quilljs'
import 'quill/dist/quill.snow.css'

const Editor = forwardRef(({ content }, ref) => {
  const theme = 'snow'
  const modules = {
    toolbar: false
  }
  const placeholder = ''
  const formats = ['list', 'indent']

  const { quill, quillRef } = useQuill({ theme, modules, formats, placeholder })

  useImperativeHandle(ref, () => ({
    getQuillInstance: () => quill
  }), [quill])

  useEffect(() => {
    if (quill) {
      if (content) {
        quill.clipboard.dangerouslyPasteHTML(content)
      }
    }
  }, [quill, content])

  return (
    <div style={{ maxWidth: 500, height: 300 }}>
      <div ref={quillRef} />
    </div>
  )
})
Editor.displayName = 'Editor'

export default Editor
