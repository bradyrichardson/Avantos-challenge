import { type JSX } from "react"
import { Box, ClickAwayListener } from "@mui/material"

interface ModalProps {
  jsx: JSX.Element
  setters: {
    clickOff: (show: boolean) => void
  }
}

export const Modal = ({...props}: ModalProps): JSX.Element => {
  // constants

  // hooks

  // methods

  // JSX
  return (
    <ClickAwayListener onClickAway={() => props.setters.clickOff(false)}>
      <Box sx={{zIndex: 1000}}>
        {props.jsx}
      </Box>
    </ClickAwayListener>
  )
}