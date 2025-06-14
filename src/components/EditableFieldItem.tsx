import { Box, ButtonBase, Card, Icon, IconButton } from "@mui/material"
import { useContext, useEffect, useState, type JSX } from "react"
import CancelIcon from '@mui/icons-material/Cancel'
import DatasetIcon from '@mui/icons-material/Dataset'
import type { Form, FormNode } from "../i_forms"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { FormContext } from "./helpers/Context"
import { updateContext } from "./helpers/Utils"

interface EditableFieldItemProps {
  selectedNode: FormNode
  selectedForm: Form
  fieldName: string
  setters: {
    us_setShowDataMapper: (show: boolean) => void
    us_setShowEditor: (show: boolean) => void
    us_setSelectedField: (value: string) => void
  }
}

export const EditableFieldItem = ({...props}: EditableFieldItemProps): JSX.Element => {
  // constants

  // hooks
  const [us_isPopulated, us_setIsPopulated] = useState<boolean>(false)
  const { FORM_CONTEXT: uc_formContext, SET_FORM_CONTEXT: uc_setFormContext } = useContext(FormContext)

  useEffect(() => {
    // debugger
    if (uc_formContext[props.selectedNode.data.name].node.data.input_mapping[props.fieldName]) {
      us_setIsPopulated(true)
    }
  }, [])

  // methods
  const handleFieldClick = () => {
    props.setters.us_setShowEditor(false)
    props.setters.us_setShowDataMapper(true)
    props.setters.us_setSelectedField(props.fieldName)
  }

  const handleClearItem = () => {
    us_setIsPopulated(false)
    const updatedNode: FormNode = {...props.selectedNode}
    updatedNode.data.input_mapping[props.fieldName] = ''
    updateContext(props.selectedForm, updatedNode, uc_formContext[props.selectedNode.data.name].prefill, props.selectedNode.data.name, uc_setFormContext)
  }

  const baseFormField = (): JSX.Element => {
    return (
      <Box>
        <Card sx={{borderRadius: us_isPopulated ? 8 : 0, borderStyle: us_isPopulated ? 'none' : 'dashed', borderColor: us_isPopulated ? 'text.primary' : '#007AFF', padding: '1px', justifyContent: 'space-evenly'}}>
          <ButtonBase disabled={us_isPopulated} onClick={handleFieldClick} sx={{width: '90%', justifyContent: 'left'}}>
            {us_isPopulated ? <Icon><CheckCircleIcon sx={{color: '#008000'}}/></Icon> : <Icon><DatasetIcon sx={{color: '#007AFF'}}/></Icon>}
            {uc_formContext && us_isPopulated ? props.fieldName + ': ' + uc_formContext[props.selectedNode.data.name].node.data.input_mapping[props.fieldName] : props.fieldName}
          </ButtonBase>
          {us_isPopulated && <IconButton onClick={handleClearItem} sx={{marginLeft: 'auto'}}><CancelIcon sx={{color: '#FF0000'}}/></IconButton>}
        </Card>
      </Box>
    )
  }

  // JSX
  return (
  <Box>
    {baseFormField()}
  </Box>
  )
}