import { Box, Switch, Typography } from "@mui/material"
import { useContext, type JSX } from "react"
import { updateContext } from "./Utils"
import { FormContext } from "./Context"

interface LabeledSwitchProps {
  label: string
  description?: string
  params: {
    [key: string]: any
  }
}

export const LabeledSwitch = ({...props}: LabeledSwitchProps): JSX.Element => {
  // constants

  // hooks
  const { FORM_CONTEXT: uc_formContext, SET_FORM_CONTEXT: uc_setFormContext } = useContext(FormContext)

  // methods
  // @ts-expect-error directive
  const handleSwitchClick = (event, value) => {
    if (props.params.selectedForm && props.params.selectedNode) {
      updateContext(props.params.selectedForm, props.params.selectedNode, value, props.params.selectedNode.data.name, uc_setFormContext)
    }
  }

  // JSX
  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
      <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: 2}}>
        {props.label && <Typography sx={{color: 'text.primary'}} variant={'h6'}>{props.label}</Typography>}
        {props.description && <Typography sx={{color: 'text.secondary'}} variant={'caption'}>{props.description}</Typography>}
      </Box>
      <Switch onChange={handleSwitchClick} checked={uc_formContext[props.params.selectedNode.data.name].prefill}/>
    </Box>
  )
}