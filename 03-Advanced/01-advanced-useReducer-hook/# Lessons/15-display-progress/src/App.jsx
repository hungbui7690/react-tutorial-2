/*
  Displaying Progress
  - create Progress.jsx

  *** <progress max={numQuestions} value={index + Number(answer !== null)} />

*/

import { useEffect, useReducer } from 'react'
import Header from './components/Header'
import Loader from './components/Loader'
import Error from './components/Error'
import StartScreen from './components/StartScreen'
import Question from './components/Question'
import NextButton from './components/NextButton'
import Progress from './components/Progress'

const initialState = {
  questions: [],
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' }
    case 'dataFailed':
      return { ...state, status: 'error' }
    case 'start':
      return { ...state, status: 'active' }
    case 'newAnswer': {
      const question = state.questions.at(state.index)
      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      }
    }
    case 'nextQuestion':
      return { ...state, index: state.index++, answer: null }
    default:
      throw new Error('Unknown action!!!')
  }
}

export default function App() {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialState
  )
  const numQuestions = questions.length

  // (1a)
  const maxPoints = questions.reduce((acc, cur) => {
    return (acc += cur.points)
  }, 0)

  useEffect(() => {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => {
        dispatch({ type: 'dataFailed' })
        console.log(err.message)
      })
  }, [])

  if (status === 'loading') return <Loader />
  if (status === 'error') return <Error />

  return (
    <div className='app'>
      <Header />
      {status === 'ready' && (
        <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
      )}

      {status === 'active' && (
        <>
          {/* (1b) */}
          <Progress
            numQuestions={numQuestions}
            index={index}
            points={points}
            maxPoints={maxPoints}
            answer={answer}
          />
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        </>
      )}
      <NextButton dispatch={dispatch} answer={answer} />
    </div>
  )
}
