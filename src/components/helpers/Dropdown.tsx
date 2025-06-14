import { Autocomplete, Box, ButtonBase, Divider, List, ListItem, TextField, Typography } from "@mui/material"
import { useEffect, useState, type JSX } from "react"
import type { DataSource, Form, FormNode } from "../../i_forms"

interface DropdownProps {
  selectedNode: FormNode
  selectedForm: Form
  selectedField: string
  dataSources: DataSource[]
  setters: {
    us_setUpdateValue: (value: string) => void
  }
}

export const Dropdown = ({...props}: DropdownProps): JSX.Element => {
  // constants
  // hooks
  const [us_selectedItem, us_setSelectedItem] = useState<string>('')
  const [us_selectedDataSources, us_setSelectedDataSources] = useState<string[]>([])
  const [us_query, us_setQuery] = useState<string>('Search')
  const [us_autocompleteOptions, us_setAutocompleteOptions] = useState<string[]>([])

  useEffect(() => {
    const options = props.dataSources.flatMap((src) => src.options.map((opt) => {
      return src.title + '.' + opt
    }))
    us_setAutocompleteOptions(options)
  }, [])

  // methods
  const handleSelectDataSource = (title: string): void => {
    if (us_selectedDataSources && !us_selectedDataSources.includes(title)) {
      us_setSelectedDataSources([...us_selectedDataSources, title])
    } else if (us_selectedDataSources) {
      const adjustedDataSources = us_selectedDataSources.filter((src) => src !== title)
      us_setSelectedDataSources(adjustedDataSources)
    } else {
      return
    }
  }

  const handleSelectItem = (sourceTitle: string, item: string) => {
    const updateValue = sourceTitle + '.' + item
    us_setSelectedItem(updateValue)
    const updatedNode: FormNode = {...props.selectedNode}
    updatedNode.data.input_mapping[props.selectedField] = updateValue
    props.setters.us_setUpdateValue(updateValue)
  }

  const sourceShouldBeExpanded = (title: string): boolean => {
    if (us_selectedDataSources && us_selectedDataSources.includes(title)) {
      return true
    }
    return false
  }

  // @ts-expect-error directive
  const handleQueryChange = (event, value): void => {
    us_setQuery(value)

    if (us_autocompleteOptions && us_autocompleteOptions.includes(value)) {
      us_setSelectedItem(value)
      props.setters.us_setUpdateValue(value)
    }
  }

  // JSX
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      {/* let's make this a list of selects...when one option is selected, put it at the top */}
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Box sx={{flexDirection: 'column'}}>
          <Typography variant='h6'>
            Available Data
          </Typography>
          <Autocomplete sx={{backgroundColor: '#ffffff'}} renderInput={(params) => <TextField {...params} label={us_query}/>} options={us_autocompleteOptions} onChange={handleQueryChange}/>
          <List sx={{width: 250}}>
            {/* these will be the data sources that can be expanded*/}
            {props.dataSources.map((src) => {
              return (
                <Box key={src.title} sx={{width: '100%'}}>
                  <ListItem sx={{flexDirection: 'column', backgroundColor: '#ffffff', width: '100%'}}>
                    <ButtonBase onClick={() => {handleSelectDataSource(src.title)}} sx={{width: '100%', height: '100%'}}>
                      <Box sx={{width: '100%'}}>{src.title}</Box>
                    </ButtonBase>
                    {sourceShouldBeExpanded(src.title) && (
                      // these will be the options for each data source
                      src.options.map((opt) => {
                        return (
                          <List sx={{width: '100%'}} key={opt}>
                            <ButtonBase onClick={() => {handleSelectItem(src.title, opt)}}  sx={{width: '100%'}}>
                              <ListItem  sx={{width: '100%'}}>
                                  <Box sx={{width: '100%'}}>{opt}</Box>
                              </ListItem>
                            </ButtonBase>
                            <Divider/>
                          </List>
                        )
                      })
                    )}
                  </ListItem>
                  <Divider />
                </Box>
              )
            })}
          </List>
        </Box>
        {us_selectedItem ? <Typography variant='h6'>Selected value: {us_selectedItem}</Typography> : <Typography variant='h6' sx={{paddingRight: '20px'}}>No item selected</Typography>}
      </Box>
    </Box>
  )
}