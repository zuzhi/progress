const HowToUse = () => {
  return (
    <div>
      <div className="text-lg font-medium py-4">
        how to use <span className='font-mono font-bold'>progress</span>?
      </div>
      <ul className="pl-4 list-decimal list-outside">
        <li>register</li>
        <li>add a project</li>
        <li>add some topics</li>
        <li>update topic status</li>
      </ul>
      <p className="pt-2">then the project progress will automatically be calculated, yeah, that&apos;s the whole point.</p>
      <div className="text-lg font-medium py-4">
        for example:
      </div>
      <ul className="list-none">
        <li>
          <b>fullstackopen - 75%</b>
          <ul className="pl-4 list-disc list-outside">
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
