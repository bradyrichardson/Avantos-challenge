import { createContext } from "react"
import type { Form, FormNode } from "../../i_forms"

interface GlobalData {
  [key: string]: string
}

export interface BlueprintContext {
  [key: string]: {
    key: string
    form: Form
    node: FormNode
    prefill: boolean
  }
}

export const GLOBAL_DATA: GlobalData = {
  dataA: 'Data A',
  dataB: 'Data B',
  dataC: 'Data C'
}

export const GlobalContext = createContext({
  GLOBAL_DATA
})

export const FORM_CONTEXT: BlueprintContext = {}
export const SET_FORM_CONTEXT: React.Dispatch<React.SetStateAction<BlueprintContext>> = () => {}

export const FormContext = createContext({FORM_CONTEXT, SET_FORM_CONTEXT})