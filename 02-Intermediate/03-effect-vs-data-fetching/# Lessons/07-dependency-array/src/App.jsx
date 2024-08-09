/*
  The useEffect Dependency Array

  Dependency Array
  - C always runs first
  - A run before B, because it place is above B > but A just runs once
  - B runs in every render
  


*/

import { Fragment, useEffect, useState } from 'react'

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0)

const KEY = '2e839089'

export default function App() {
  const [movies, setMovies] = useState([])
  const [watched, setWatched] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState('')
  const [query, setQuery] = useState('') // (2) from Search component > lift up here

  const URL_QUERY = 'interstellar'

  useEffect(() => {
    console.log('A')
  }, []) // *** runs after "browser paint" > After initial render

  useEffect(() => {
    console.log('B')
  }) // *** no dep arr > runs every render

  console.log('C') // *** runs during "render"

  useEffect(() => {
    console.log('D')
  }, [query]) // *** run every time query has changes

  useEffect(function () {
    async function fetchMovies() {
      try {
        setIsLoading(true)
        const res = await fetch(
          `http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${URL_QUERY}`
        )

        if (!res.ok) throw new Error('Something went wrong.')

        const data = await res.json()

        if (data.Response === 'False') throw new Error('Movies not found.')

        setMovies(data?.Search)
      } catch (err) {
        setIsError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <Fragment>
      <Navbar>
        {/* (3) */}
        <Search query={query} setQuery={setQuery} />

        <NumResults movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !isError && <MoviesList movies={movies} />}
          {isError && <ErrorMessage message={isError} />}
        </Box>

        <Box>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>
      </Main>
    </Fragment>
  )
}

function Loader() {
  return <p className='loader'>Loading...</p>
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔</span> {message}
    </p>
  )
}

function Navbar({ children }) {
  return (
    <nav className='nav-bar'>
      <Logo />
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

// (1) move the states from here to App > so we need to extract props from here
function Search({ query, setQuery }) {
  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  )
}

function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
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

function MoviesList({ movies }) {
  return (
    <ul className='list'>
      {movies?.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
              <span>🗓</span>
              <span>{movie.Year}</span>
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating))
  const avgUserRating = average(watched.map((movie) => movie.userRating))
  const avgRuntime = average(watched.map((movie) => movie.runtime))

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  )
}

const WatchedList = ({ watched }) => {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovies key={movie.imdbID} movie={movie} />
      ))}
    </ul>
  )
}

function WatchedMovies({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  )
}
