/*
  Section Overview

  Project Setup and Walkthrough
  - look through the project

  Components Instances and Elements
  - pic

  Instances and Elements in Practice

*/

import { useState } from 'react'
import { content } from './data'

console.log(<DifferentContent test={23} />) // (1) contains $$typeof > this is used to prevent hacker > since this is "Symbol", means that only React can generate that
console.log(DifferentContent()) // (2) we also can run this > but the "type" is different (not the f anymore)

export default function App() {
  return (
    <div>
      <Tabbed content={content} />
    </div>
  )
}

function Tabbed({ content }) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div>
      <div className='tabs'>
        <Tab num={0} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={1} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={2} activeTab={activeTab} onClick={setActiveTab} />
        <Tab num={3} activeTab={activeTab} onClick={setActiveTab} />
      </div>

      {activeTab <= 2 ? (
        <TabContent item={content.at(activeTab)} />
      ) : (
        <DifferentContent />
      )}

      {/* (3) when we call this, React does not see it as component instance > so it cannot manage the states of it */}
      {TabContent({ item: content.at(0) })}
    </div>
  )
}

function Tab({ num, activeTab, onClick }) {
  return (
    <button
      className={activeTab === num ? 'tab active' : 'tab'}
      onClick={() => onClick(num)}
    >
      Tab {num + 1}
    </button>
  )
}

function TabContent({ item }) {
  const [showDetails, setShowDetails] = useState(true)
  const [likes, setLikes] = useState(0)

  function handleInc() {
    setLikes(likes + 1)
  }

  return (
    <div className='tab-content'>
      <h4>{item.summary}</h4>
      {showDetails && <p>{item.details}</p>}

      <div className='tab-actions'>
        <button onClick={() => setShowDetails((h) => !h)}>
          {showDetails ? 'Hide' : 'Show'} details
        </button>

        <div className='hearts-counter'>
          <span>{likes} ❤️</span>
          <button onClick={handleInc}>+</button>
          <button>+++</button>
        </div>
      </div>

      <div className='tab-undo'>
        <button>Undo</button>
        <button>Undo in 2s</button>
      </div>
    </div>
  )
}

function DifferentContent() {
  return (
    <div className='tab-content'>
      <h4>I'm a DIFFERENT tab, so I reset state 💣💥</h4>
    </div>
  )
}
