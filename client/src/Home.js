import axios from 'axios'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

import PokemonEntry from './components/PokemonEntry.js'
import PrimarySearchAppBar from './components/AppBar.js'
import LoadingIcon from './components/LoadingIcon.js'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'

// TO-DO: Figure out what to do with dependency array
// TO-DO: Clean up API call code so that it's more generic
// TO-DO: Don't pass as much data to PokemonEntry
// TO-DO: Refactor use effect code so it's less cursed in using state change

function Filter() {
  const [filterTerm, setFilterTerm] = useState('')

  return (
    <Box textAlign="center">
      <TextField
        label="Filter Pokemon"
        value={filterTerm}
        onChange={e => setFilterTerm(e.target.value)}
      ></TextField>
    </Box>
  )
}

export default function Home() {
  const limit = 20

  const [offset, setOffset] = useState(0)
  const [pokeData, setPokeData] = useState([])
  const [favorites, setFavorites] = useState({})

  const [filterTerm, setFilterTerm] = useState('')
  const [filterTermValue] = useDebounce(filterTerm, 500)
  
  // Needed for
  const [atBottom, setAtBottom] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Make requests to get data for first 20 pokemon
  async function requestPokemonData(idx) {
    const links = [
      `https://pokeapi.co/api/v2/pokemon/${idx}`,
      `https://pokeapi.co/api/v2/pokemon-species/${idx}/`,
    ]
    return Promise.all(links.map(link => axios.get(link)))
  }

  // Get the images for first 20 pokemon as well
  function getPokemonImageLink(idx) {
    // Pad with zeroes to keep as three digit number
    const paddedIdx = `00${idx}`.slice(-3)
    const imageLink = `http://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedIdx}.png`
    return imageLink
  }

  async function fetchPokemonData(limit, offset) {
    setIsLoading(true)
    // Grab the next `limit` pokemon's data, in our case that's 20 at a time
    const dataPromiseArray = new Array(limit)
      .fill(null)
      .map((_, idx) => requestPokemonData(idx + offset + 1))

    // Send all 20 requests at the same time, wait for it to come back
    const responseData = await Promise.all(dataPromiseArray)

    // Get pokemon data back as an array here
    const pokemonData = responseData.map(res => res[0].data)

    // TO-DO: Clean up this code here
    // We attach the description we need to each pokemon
    for (const [idx, responses] of responseData.entries()) {
      // Find first English pokemon description, set it to our object
      const pokemonDesc = responses[1].data
      const entry = pokemonDesc.flavor_text_entries.find(
        entry => entry.language.name === 'en'
      )
      pokemonData[idx].description = entry.flavor_text
        .replaceAll('\n', ' ')
        .replaceAll('\u000c', ' ')
    }

    // Set favorites
    const { data: favorites } = await axios.get('/favorites').catch(console.error)
    setFavorites(favorites)

    setPokeData([...pokeData, ...pokemonData])
    setOffset(offset + limit)
    setIsLoading(false)
  }

  // Fetch more pokemon when it's at the bottom of the page
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
    return pokeData.map(singlePokemon => {
      // Return nothing if the filter term doesn't match our poekmon
      if (!singlePokemon.name.includes(filterTermValue)) return ''

      // Gather data for our props
      const { name, id, abilities, weight, height, description } = singlePokemon
      const image = getPokemonImageLink(id)
      const savedFavorite = favorites[id]

      // Render the component using props
      const props = { name, id, abilities, weight, height, image, description, savedFavorite }

      return <PokemonEntry key={id} {...props} />
    })
  }


  return (
    <div className="Home">
      <PrimarySearchAppBar />
      {/* Title and subtitle */}
      <Typography
        className="app__title"
        variant="h2"
        align="center"
        component="h1"
      >
        Pokédex
      </Typography>
      <Typography variant="body" align="center" component="p">
        Scroll down to see data on all 1,112 Pokémon.
      </Typography>

      {/* Search filter */}
      <Box textAlign="center">
        <TextField
          label="Filter Pokemon"
          value={filterTerm}
          onChange={e => setFilterTerm(e.target.value)}
        ></TextField>
      </Box>

      {/* App */}
      <div className="app">{renderPokemon()}</div>
      {isLoading ? <LoadingIcon /> : ''}
    </div>
  )
}

/*
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => renderMore()}
      >
        Render More
      </Button>
      */
