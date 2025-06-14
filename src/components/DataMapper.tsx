import { useContext, useEffect, useState, type JSX } from "react"
import { Box, Button, Typography } from "@mui/material"
import { Modal } from "./helpers/Modal"
import { FormContext, GlobalContext } from "./helpers/Context"
import type { DataSource, Form, FormNode } from "../i_forms"
import { Dropdown } from "./helpers/Dropdown"
import { updateContext } from "./helpers/Utils"

interface DataMapperProps {
  setters: {
    us_setShowDataMapper: (show: boolean) => void
    us_setShowEditor: (show: boolean) => void
  }
  selectedNode: FormNode
  selectedForm: Form
  nodes: FormNode[]
  forms: Form[]
  selectedField: string
}

export const DataMapper = ({...props}: DataMapperProps): JSX.Element => {
  // constants
  
  // hooks
  const uc_globalData = useContext(GlobalContext)
  // const uc_formContext = useContext(FormContext)
  const [us_dataSources, us_setDataSources] = useState<DataSource[] | null>(null)
  const [us_updateValue, us_setUpdateValue] = useState<string>('')
  const {  FORM_CONTEXT: uc_formContext, SET_FORM_CONTEXT: uc_setFormContext } = useContext(FormContext)


  // aggregate the data into the data sources variable so we can display it
  useEffect(() => {
    if (!uc_globalData) {
      return
    }

    const globalData: DataSource = {title: 'Global Data', options: Object.keys(uc_globalData.GLOBAL_DATA)}
    // const prerequisiteData: DataSource = {}

    us_setDataSources([globalData])
  }, [uc_globalData])

  // methods
  const createDropdownMenuTitle = (rawTitle: string) => {
    return rawTitle.split('_').map((title) => {
      let firstLetter = title.slice(0,1)
      firstLetter = firstLetter.toUpperCase()
      return firstLetter + title.slice(1,title.length)
    }).join(' ')
  }

  const displayDropdownMenus = (selectedNode: FormNode, forms: Form[], nodes: FormNode[], dataSources: DataSource[]): JSX.Element => {
    // get the prerequisite form names/fields and combine with the global data
    for (const node of nodes) {
      if (node.id === selectedNode.id) {
        continue
      }

      if (selectedNode.data.prerequisites.includes(node.id)) {
        const form = forms.find((form) => form.id === node.data.component_id)
        const rawTitle = node.data.name.toLowerCase().replace(' ', '_')
        const title = createDropdownMenuTitle(rawTitle)

        if (form && form !== undefined) {
          const dataSource: DataSource = {title: title, options: Object.keys(form.field_schema.properties)}

          if (!dataSources.find((src) => src.title === title)) {
            dataSources.push(dataSource)
          }
        }
      }
    }

    return (
      <Box>
        <Box sx={{flexDirection: 'column', alignItems: 'center'}}>
          <Dropdown dataSources={dataSources} selectedForm={props.selectedForm} selectedNode={props.selectedNode} selectedField={props.selectedField} setters={{us_setUpdateValue}}/>
        </Box>
      </Box>
    )
  }

  const handleCancelClick = () => {
    props.setters.us_setShowDataMapper(false)
    props.setters.us_setShowEditor(true)
  }

  const handleConfirmClick = () => {
    props.setters.us_setShowDataMapper(false)
    props.setters.us_setShowEditor(true)

    // update the input mapping of the node
    updateNodeInputMapping(us_updateValue)
  }

  const updateNodeInputMapping = (value: string) => {
    const updatedNode: FormNode = {...props.selectedNode}
    updatedNode.data.input_mapping[props.selectedField] = value
    updateContext(props.selectedForm, props.selectedNode, uc_formContext[props.selectedNode.data.name].prefill, props.selectedNode.data.name, uc_setFormContext)
  }

  // JSX
  const modalContent = (): JSX.Element => {
    return (
      <Box sx={{minHeight: 500, width: 500, backgroundColor: '#f1f1f1', padding: 2, borderRadius: 6, flexDirection: 'column'}}>
        <Typography variant='h5' color='text.primary'>
          Select data element to map
        </Typography>
        <Box>
          {/* stack x dropdown menus - global data, any prerequisites */}
          {us_dataSources && us_dataSources.length > 0 && displayDropdownMenus(props.selectedNode, props.forms, props.nodes, us_dataSources)}
        </Box>
        <Box>
          <Button sx={{width: '20%', backgroundColor: '#ffffff', color: 'text.primary', borderRadius: 3, marginRight: '30px'}} onClick={handleCancelClick}>Cancel</Button>
          <Button sx={{width: '20%', backgroundColor: '#007AFF', color: '#ffffff', borderRadius: 3}} onClick={handleConfirmClick}>Confirm</Button>
        </Box>
      </Box>
    )
  }

  return (
    <Modal jsx={modalContent()} setters={{clickOff: props.setters.us_setShowDataMapper}} />
  )
}