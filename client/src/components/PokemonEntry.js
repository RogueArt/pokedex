/* .App {
  text-align: center;
} */

// Material UI components
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

// Material UI icons
import Favorite from '@material-ui/icons/Favorite'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder'

import { useState } from 'react'
import axios from 'axios'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 240,
  },
})

// Helper function to capitalize string
function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function PokemonEntry({ name, abilities, id, weight, height, image }) {
  const [isFavorite, setIsFavorite] = useState(false)
  
  const classes = useStyles()

  // Process props that we receive
  const abilityNames = abilities.map(ability =>
    capitalize(ability.ability.name)
  )

  function showFavoriteIcon() {
    return isFavorite ? <Favorite /> : <FavoriteBorder /> 
  }
  
  function handleFavoriteChange() {
    // Set it to opposite of what it was before
    setIsFavorite(!isFavorite)

    // Make a request to the backend updating favorites
    if (isFavorite) axios.post('/favorites', id)
  }

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} image={image} title={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {capitalize(name)}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
          <Typography variant="body2" color="textPrimary" component="p">
            <b>ID:</b> {id}
          </Typography>
          <Typography variant="body2" color="textPrimary" component="p">
            <b>Abilities:</b> {abilityNames.join(', ')}
          </Typography>
          <Typography variant="body2" color="textPrimary" component="p">
            <b>Height:</b> {height}
          </Typography>
          <Typography variant="body2" color="textPrimary" component="p">
            <b>Weight:</b> {weight}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button startIcon={showFavoriteIcon()} color="secondary" size="small" onClick={() => setIsFavorite(!isFavorite)}>
          Favorite
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default PokemonEntry
