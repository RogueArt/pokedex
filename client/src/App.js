import axios from 'axios'

import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null)
  const [pokeData, setPokeData] = useState(null)

  // useEffect(() => {
  //   fetch('/api')
  //     .then(res => res.json())
  //     .then(data => setData(data.message))
  // }, [])

  async function fetchPokeData() {
    // Get URLs for first twenty pokemon
    const { data: pokemonURLs } = await axios
      .get('https://pokeapi.co/api/v2/pokemon/') // Make a GET request for first 20 pokemon
      .catch(console.error) // Log any errors to console

    // Make API calls to get data on first twenty pokemon


    console.log(data)
  }

  useEffect(() => {
    axios.get('/api').then(data => setData(data.message))
    fetchPokeData()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{!data ? 'Loading...' : data}</p>
        <p>Pokemon: {pokeData ? pokeData : 'Waiting for Pokedata'}</p>
      </header>
    </div>
  )
}

export default App
