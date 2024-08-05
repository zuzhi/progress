import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'

const Visible = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
      setVisible
    }
  })

  useEffect(() => {
    if (props.onVisibleChange) {
      props.onVisibleChange(visible)
    }
  }, [visible])

  return (
    <div>
      <div style={hideWhenVisible}>
      </div>
      <div style={showWhenVisible} className='togglableContent'>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
Visible.displayName = 'Visible'

export default Visible
