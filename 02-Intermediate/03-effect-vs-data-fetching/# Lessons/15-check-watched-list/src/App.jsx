/*
  Check Watched List
  - requirement: if a movie has userRating > rating + add to list button will be removed
    
  (1) MovieDetails

*/

import { Fragment, useEffect, useState } from 'react'
import { Navbar, NumResults, Search } from './components/Navbar'
import { MoviesList } from './components/MovieList'
import { MovieDetails } from './components/MovieDetails'
import WatchedSummary from './components/WatchedSummary'
import { WatchedList } from './components/WatchedList'
import { Loader } from './components/Loader'

const KEY = '2e839089'

export default function App() {
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')
  const [query, setQuery] = useState('hero')

  const [selectedID, setSelectedID] = useState()

  function handleSelectMovie(id) {
    setSelectedID(id === selectedID ? null : id)
  }

  function handleCloseMovie() {
    setSelectedID(null)
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  useEffect(
    function () {
      async function fetchMovies() {
        try {
          setIsError('')
          setIsLoading(true)

          const URL = `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`

          const res = await fetch(URL)

          if (!res.ok) throw new Error('Something went wrong.')

          const data = await res.json()

          if (data.Response === 'False' || !data.Search)
            throw new Error('Movies not found.')

          setMovies(data?.Search)
        } catch (err) {
          setIsError(err.message)
        } finally {
          setIsLoading(false)
        }
      }

      if (!query.length) {
        setMovies([])
        setIsError('')
        return
      }

      fetchMovies()
    },
    [query]
  )

  return (
    <Fragment>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && (
            <MoviesList movies={movies} onSelectedMovie={handleSelectMovie} />
          )}
          {isError && <ErrorMessage message={isError} />}
        </Box>

        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched} // (1)
            />
          ) : (
            <Fragment>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} />
            </Fragment>
          )}
        </Box>
      </Main>
    </Fragment>
  )
}

function Main({ children }) {
  return <main className='main'>{children}</main>
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>

      {isOpen && children}
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔</span> {message}
    </p>
  )
}
