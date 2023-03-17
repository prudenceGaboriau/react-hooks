// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'


// class ErrorBoundary extends React.Component {
//   state = {
//     error: null
//   }

//   static getDerivedStateFromError(error) {
//     return {error};
//   }

//   render() {
//     const {error} = this.state;

//     if (error) {
//       return <this.props.FallbackComponent error={error}></this.props.FallbackComponent>
//     }

//     return this.props.children; 
//   }
// }


function ErrorFallback({error}) {
  return <div role="alert">There was an error: <pre style={{whiteSpace: 'normal'}}>{error}</pre></div>
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    };
    setState({...state, status: 'pending'})
    fetchPokemon(pokemonName).then(pokemon => {
      setState({...state, pokemon, status: 'resolved'})
    }).catch((err => {
      setState({...state, error: err.message, status: 'rejected'})
    }))
  }, [pokemonName])

  if (status === 'rejected') {
    throw error;
  }
  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[pokemonName]}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
