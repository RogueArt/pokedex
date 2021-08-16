import axios from 'axios'

import { useState, useEffect } from 'react'

import PokemonEntry from './components/PokemonEntry.js'
import Button from '@material-ui/core/Button'

// TO-DO: Figure out what to do with dependency array
// TO-DO: Clean up API call code so that it's more generic
// TO-DO: Don't pass as much data to PokemonEntry
// TO-DO: Refactor use effect code so it's less cursed in using state change

export default function Home() {
  const limit = 20
  const [offset, setOffset] = useState(0)
  const [pokeData, setPokeData] = useState([])
  const [atBottom, setAtBottom] = useState(false)

  // Make requests to get data for first 20 pokemon
  async function requestPokemonData(idx) {
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${idx}`)
  }

  // Get the images for first 20 pokemon as well
  function getPokemonImageLink(idx) {
    // Pad with zeroes to keep as three digit number
    const paddedIdx = `00${idx}`.slice(-3)
    const imageLink = `http://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedIdx}.png`
    return imageLink
  }

  async function fetchPokemonData(limit, offset) {
    // Grab the next `limit` pokemon's data, in our case that's 20 at a time
    const dataPromiseArray = new Array(limit)
      .fill(null)
      .map((_, idx) => requestPokemonData(idx + offset + 1))

    // Send all 20 requests at the same time, wait for it to come back
    const responseData = await Promise.all(dataPromiseArray)
    const pokemonData = responseData.map(res => res.data)

    setPokeData([...pokeData, ...pokemonData])
    setOffset(offset + limit)
  }

  useEffect(() => {
    fetchPokemonData(limit, offset)

    const onScroll = function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setAtBottom(true)
      }
      setAtBottom(false)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [atBottom])

  function renderPokemon() {
    if (pokeData == null) return 'Loading...'

    return pokeData.map(singlePokemon => {
      // Gather data for our props
      const { name, id, abilities, weight, height } = singlePokemon
      const image = getPokemonImageLink(id)

      // Render the component using props
      const props = { name, id, abilities, weight, height, image }

      return <PokemonEntry key={id} {...props} />
    })
  }

  function renderMore() {
    fetchPokemonData(limit, offset)
  }

  return (
    <div className="Home">
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => renderMore()}
      >
        Render More
      </Button>
      <div className="test">{renderPokemon()}</div>
    </div>
  )
}