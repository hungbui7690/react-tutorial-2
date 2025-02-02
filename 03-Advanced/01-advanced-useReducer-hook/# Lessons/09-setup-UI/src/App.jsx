/*
  Setup UI
  - status: 
    + loading > ready 
              > error

  - we have the data, now work with UI

  - create StartScreen.jsx

*/

import { useEffect, useReducer } from 'react'
import Header from './Header'

import Loader from './Loader'
import Error from './Error'
import StartScreen from './StartScreen'

const initialState = {
  questions: [],
  status: 'loading',
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' }
    case 'dataFailed':
      return { ...state, status: 'error' }
    default:
      throw new Error('Unknown action!!!')
  }
}

export default function App() {
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState) // (1) destructure

  const numQuestions = questions.length // (3a)

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }))
  }, [])

  // (2) Method 1
  if (status === 'loading') return <Loader />
  if (status === 'error') return <Error />

  return (
    <div className='app'>
      <Header />

      {/* (3b) Method 2 */}
      {status === 'ready' && <StartScreen numQuestions={numQuestions} />}
    </div>
  )
}
