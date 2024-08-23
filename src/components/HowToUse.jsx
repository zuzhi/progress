const HowToUse = () => {
  return (
    <div className='howtouse'>
      <h3>
        how to use <span className='product-name'>progress</span>?
      </h3>
      <ul>
        <li>register</li>
        <li>add a project</li>
        <li>add some topics</li>
        <li>update topic status</li>
      </ul>
      <p>then the project progress will automatically be calculated, yeah, that&apos;s the whole point.</p>
      <p>
        for example:
      </p>
      <ul>
        <li>
          <b>fullstackopen - 75%</b>
          <ul>
            <li><s>Part 0: Fundamentals of Web apps</s></li>
            <li><s>Part 1: Introduction to React</s></li>
            <li><s>Part 2: Communicating with server</s></li>
            <li>Part 3: Programming a server with NodeJS and Express</li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default HowToUse
