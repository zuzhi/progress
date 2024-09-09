import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'

const Togglable = forwardRef((props, refs) => {
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
      {props.buttonLabel &&
        <div style={hideWhenVisible}>
          <button className='text-xs hover:underline text-[#828282]' onClick={toggleVisibility}>{props.buttonLabel}</button>
        </div>
      }
      <div style={showWhenVisible} className='togglableContent'>
        {props.children}
        <button className='text-xs hover:underline text-[#828282]' onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})
Togglable.displayName = 'Togglable'

export default Togglable
