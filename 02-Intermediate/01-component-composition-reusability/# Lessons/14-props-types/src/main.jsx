import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import StarRating from './StarRating'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

function Test() {
  const [movieRating, setMovieRating] = useState(0)

  return (
    <div>
      <StarRating color={'blue'} maxRating={10} onSetRating={setMovieRating} />
      <p>This movie was rated {movieRating} stars</p>
    </div>
  )
}

root.render(
  <StrictMode>
    <StarRating
      maxRating={5}
      messages={['terrible', 'bad', 'okay', 'good', 'amazing']}
      defaultRating={3}
    />
    <StarRating maxRating='10' color='crimson' size={32} />
    <StarRating />

    <Test />
  </StrictMode>
)
