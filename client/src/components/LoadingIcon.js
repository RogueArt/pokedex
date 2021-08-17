import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'

export default function LoadingIcon() {
  return (
    <Box m={4} textAlign="center">
      <CircularProgress className="loading" color="secondary" />
    </Box>
  )
}
