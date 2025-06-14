import type { Form, FormNode } from "../../i_forms"
import type { BlueprintContext } from "./Context"

export const updateContext = (form: Form | null, node: FormNode | null, prefill: boolean | null, key: string | null, setter: React.Dispatch<React.SetStateAction<BlueprintContext>>, fullContextObject: BlueprintContext | null = null) => {
  if (fullContextObject) {
    setter({...fullContextObject})
    return
  }

  if (form && node && prefill !== null && key) {
    setter((prevContext: BlueprintContext) => ({
      ...prevContext,
      [key]: {
        key,
        form,
        node,
        prefill
      }
    }))
  }
}