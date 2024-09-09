import { useRef } from "react"
import Editor from "./Editor"
import { useDispatch, useSelector } from "react-redux"
import { initProject } from "../reducers/topicReducer"
import { clearSelectedProject } from "../reducers/projectReducer"

const EditorForm = ({ combinedContent }) => {
  const dispatch = useDispatch()
  const session = useSelector(state => state.session)
  const project = useSelector(state => state.projects.selected)

  const quillRef = useRef(null)

  const extractAttribute = (element, attributeName) => {
    return element.getAttribute(attributeName)
  }

  const parseTopic = (element) => {
    // parse topic text and class(for hierarchy)
    return {
      class: extractAttribute(element, 'class'),
      name: element.innerText.trim()
    }
  }

  const parseTopics = (editorHTML) => {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = editorHTML

    const parsedTopics = Array.from(tempDiv.querySelectorAll('li')).map(li =>
      parseTopic(li)
    )

    return parsedTopics
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (project && window.confirm(`(re)initialize ${project.name}? status will be lost.`)) {
      const quill = quillRef.current?.getQuillInstance()
      if (quill) {
        const parsedTopics = parseTopics(quill.root.innerHTML)
        dispatch(initProject(project, parsedTopics, session?.user?.id))
        dispatch(clearSelectedProject())
        quill.setContents([])
      } else {
        console.error("Quill instance is not available.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-bold">project editor</p>
      <div className='form-group'>
        <label className="font-medium">{project?.name}</label>
        <Editor ref={quillRef} content={combinedContent} />
      </div>
      <button className="pl-1.5 text-xs hover:underline text-[#828282]" type="submit">save</button>
    </form>
  )
}

export default EditorForm
