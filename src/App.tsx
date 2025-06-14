import { Box } from '@mui/material'
import './App.css'
import { RootFormView } from './components/RootFormView'
import { FORM_CONTEXT, FormContext, GLOBAL_DATA, GlobalContext, type BlueprintContext } from './components/helpers/Context'
import { useState } from 'react'

function App() {
  const [us_formContext, us_setFormContext] = useState<BlueprintContext>(FORM_CONTEXT)
  
  return (
    <GlobalContext value={{GLOBAL_DATA}}>
      <FormContext value={{FORM_CONTEXT: us_formContext, SET_FORM_CONTEXT: us_setFormContext}}>
        <Box data-testid="app-root" sx={{height: '100%', width: '100vw', backgroundColor: 'text.secondary', left: 0, top: 0, position: 'absolute'}}>
          <RootFormView data-testid='root-form-view'/>
        </Box>
      </FormContext>
    </GlobalContext>
  )
}

export default App
