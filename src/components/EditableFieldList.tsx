import type { JSX } from "react"
import type { FieldSchema, Form, FormNode } from "../i_forms"
import { Box } from "@mui/material"
import { EditableFieldItem } from "./EditableFieldItem"

interface EditableFieldListProps {
  formFieldSchema: FieldSchema
  selectedNode: FormNode
  selectedForm: Form
  setters: {
    us_setShowDataMapper: (show: boolean) => void
    us_setShowEditor: (show: boolean) => void
    us_setSelectedField: (value: string) => void
  }
}

export const EditableFieldList = ({...props}: EditableFieldListProps): JSX.Element => {
  // constants

  // hooks

  // methods
  const fieldList = (schema: FieldSchema) => {
    return (
      <>
      {/* display field names, and sort to be consistent */}
        {Object.keys(schema.properties).sort((a: string, b: string) => a.charCodeAt(0) - b.charCodeAt(0)).map((fieldName, _idx) => {
          return (
            <Box key={_idx} sx={{paddingY: 1}}>
              <EditableFieldItem selectedNode={props.selectedNode} selectedForm={props.selectedForm} fieldName={fieldName} setters={props.setters}/>
            </Box>
          )
        })}
      </>
    )
  }

  // JSX
  return (
    <Box>
      {fieldList(props.formFieldSchema)}
    </Box>
  )
}