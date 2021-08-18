import axios from 'axios'

import React, { useState, useEffect } from 'react'

import PokemonEntry from './components/PokemonEntry.js'
import PrimarySearchAppBar from './components/AppBar.js'
import LoadingIcon from './components/LoadingIcon.js'

import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const PokemonEntryMemo = React.memo(PokemonEntry)

// TO-DO: Figure out what to do with dependency array
// TO-DO: Clean up API call code so that it's more generic
// TO-DO: Don't pass as much data to PokemonEntry
// TO-DO: Refactor use effect code so it's less cursed in using state change
export default function Home() {
  const limit = 20

  const [offset, setOffset] = useState(0)
  const [pokeData, setPokeData] = useState([])
  const [favorites, setFavorites] = useState({})
  

  const [searchTerm, setSearchTerm] = useState('')
  // const [searchTermValue] = useDebounce(searchTerm, 500)
  
  // Needed for
  const [atBottom, setAtBottom] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isShowingFavorites, setIsShowingFavorites] = useState(false)

  // Make requests to get data for first 20 pokemon
  let cancel
  async function requestPokemonData(idx) {
    const links = [
      `https://pokeapi.co/api/v2/pokemon/${idx}`,
      `https://pokeapi.co/api/v2/pokemon-species/${idx}/`,
    ]
    return Promise.all(links.map(link => axios.get(link, { cancelToken: new axios.CancelToken(c => cancel = c)})))
  }

  // Get the images for first 20 pokemon as well
  function getPokemonImageLink(idx) {
    // Pad with zeroes to keep as three digit number
    const paddedIdx = `00${idx}`.slice(-3)
    const imageLink = `http://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedIdx}.png`
    return imageLink
  }

  // Toggle back and forth
  function handleShowingFavorites() {
    setIsShowingFavorites(!isShowingFavorites)
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
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
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
      if (!singlePokemon.name.includes(searchTerm)) return ''

      // If we are showing favorites, then only return pokemon we've favorited
      if (isShowingFavorites && !favorites[singlePokemon.id]) return ''
      
      // Gather data for our props
      const { name, id, abilities, weight, height, description } = singlePokemon
      const image = getPokemonImageLink(id)
      const savedFavorite = favorites[id]
      
      // Render the component using props
      const props = { name, id, abilities, weight, height, image, description, savedFavorite }

      return <PokemonEntryMemo key={id} {...props} singlePokemon={singlePokemon} />
    })
  }

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="Home">
      {/* TO-DO: Optimize this so it doesn't shred re-renders */}
      <PrimarySearchAppBar
        searchTerm={searchTerm}
        onHandleSearchChange={handleSearchChange}
        isShowingFavorites={isShowingFavorites}
        handleShowingFavorites={handleShowingFavorites}
      />

      {/* Title and subtitle */}
      <Box m={1}>
        <Typography
          className="app__title"
          variant="h2"
          align="center"
          component="h1"
        >
          Pokédex
        </Typography>
        <Typography variant="body2" align="center" component="p">
          Scroll down to see data on all 1,118 Pokémon.
        </Typography>
      </Box>

      {/* App */}
      <div className="app">{renderPokemon()}</div>
      {isLoading ? <LoadingIcon /> : ''}
    </div>
  )
}
/*
      Search filter
      <Box textAlign="center">
        <TextField
          label="Filter Pokemon"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        ></TextField>
      </Box>
      */

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
