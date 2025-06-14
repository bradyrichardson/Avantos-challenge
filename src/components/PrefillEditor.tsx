import { useEffect, useState, type JSX } from "react"
import type { Form, FormNode } from "../i_forms"
import { LabeledSwitch } from "./helpers/LabeledSwitch"
import { Box } from "@mui/material"
import { EditableFieldList } from "./EditableFieldList"
import { Modal } from "./helpers/Modal"

interface EditorProps {
  selectedForm: Form
  selectedNode: FormNode
  setters: {
    us_setShowDataMapper: (show: boolean) => void
    us_setShowEditor: (show: boolean) => void
    us_setSelectedField: (value: string) => void
  }
}

export const PrefillEditor = ({...props}: EditorProps): JSX.Element => {
  // constants
  const [us_form, us_setForm] = useState<Form | null>(null)

  // hooks
  useEffect(() => {
    if (props.selectedForm) {
      us_setForm(props.selectedForm)
    }
  }, [])

  // methods

  // JSX
  const modalContent = (): JSX.Element => {
    return (
      <Box sx={{width: 500, backgroundColor: '#f1f1f1', padding: 2, borderRadius: 6}}>
        <LabeledSwitch label={`Prefill: ${props.selectedNode.data.name}`} params={{selectedForm: props.selectedForm, selectedNode: props.selectedNode}} description='Prefill fields for this form'/>
        {us_form && <EditableFieldList selectedNode={props.selectedNode} selectedForm={props.selectedForm} formFieldSchema={us_form.field_schema} setters={props.setters}/>}
      </Box>
    )
  }
  return (
    <Modal jsx={modalContent()} setters={{clickOff: props.setters.us_setShowEditor}} />
  )
}