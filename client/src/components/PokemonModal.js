import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'

import '../styles/pokeModal.scss'

const useStyles = makeStyles(theme => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

// Helper function to capitalize string
function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}


export default function PokemonModal({ image, pokeData, open, handleClose }) {
  const classes = useStyles()

  const { name, description, abilities, base_experience, height, held_items, id, is_default, moves, types, weight } = pokeData
  console.log(held_items)

  const abilitiesStr = abilities.map((ability) => capitalize(ability.ability.name)).join(', ')
  const heldItemsStr = held_items.map(item => capitalize(item.item.name)).join(', ')
  const movesStr = moves.slice(0, 8).map(move => capitalize(move.move.name)).join(', ')
  const typesStr = types.map(t => capitalize(t.type.name)).join(', ')

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{ maxWidth: '50%', margin: 'auto' }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Box m={1} textAlign="center">
              <h2 style={{ margin: '0' }} id="server-modal-title">
                {capitalize(name)}
              </h2>
              <img
                src={image}
                width="200px"
                height="200px"
                alt="pokemon-image"
              />
              <p style={{ margin: '4px' }}>
                <b>Description:</b>
              </p>
              <Typography variant="body2" color="textPrimary" component="p" textAlign="justify">
                {description}
              </Typography>
            </Box>

            <div className="pokemonModal__grid">
              {returnTypography('ID', id)}
              {returnTypography('Base Experience', base_experience)}
              {returnTypography('Height', height)}
              {returnTypography('Weight', weight)}
              {returnTypography('Is Default', is_default ? 'True' : 'False')}
              {returnTypography('Abilities', abilitiesStr)}
              {returnTypography('Types', typesStr)}
              {returnTypography('Held Items', heldItemsStr || 'None')}
            </div>
              {returnTypography('Moves', movesStr)}
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

function returnTypography(text, value) {
  return (
    <Typography variant="body2" color="textPrimary" component="p">
      <b>{text}:</b> {value}
    </Typography>
  )
}