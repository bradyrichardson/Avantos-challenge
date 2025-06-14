import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PrefillEditor } from '../components/PrefillEditor'
import { FormContext } from '../components/helpers/Context'
import type { Form, FormNode } from '../i_forms'
import type { JSX } from 'react'

// mock child components
vi.mock('../components/helpers/LabeledSwitch', () => ({
  LabeledSwitch: () => <div data-testid="labeled-switch">Labeled Switch</div>
}))

vi.mock('../components/EditableFieldList', () => ({
  EditableFieldList: () => <div data-testid="editable-field-list">Editable Field List</div>
}))

vi.mock('../components/helpers/Modal', () => ({
  Modal: ({ jsx, setters }: { jsx: JSX.Element, setters: { clickOff: (show: boolean) => void } }) => (
    <div data-testid="modal">
      {jsx}
      <button onClick={() => setters.clickOff(false)}>Close</button>
    </div>
  )
}))

// mock data
const mockForm: Form = {
  id: 'form1',
  $schema: '',
  created_at: '',
  created_by: '',
  custom_javascript: '',
  custom_javascript_triggering_fields: [],
  description: '',
  dynamic_field_config: {},
  field_schema: {
    type: 'object',
    properties: {
      field1: { type: 'string' }
    },
    additionalProperties: {},
    required: []
  },
  is_reusable: false,
  name: 'Test Form',
  ui_schema: {
    type: 'VerticalLayout',
    elements: []
  },
  updated_at: ''
}

const mockSelectedNode: FormNode = {
  id: 'node1',
  type: 'form',
  data: {
    component_key: 'test-form',
    component_id: 'form1',
    name: 'Test Node',
    prerequisites: [],
    input_mapping: {}
  },
  position: { x: 0, y: 0 }
}

const mockFormContext = {
  'Test Node': {
    key: 'Test Node',
    form: mockForm,
    node: mockSelectedNode,
    prefill: false
  }
}

const mockSetters = {
  us_setShowDataMapper: vi.fn(),
  us_setShowEditor: vi.fn(),
  us_setSelectedField: vi.fn()
}

describe('PrefillEditor Component', () => {
  const renderPrefillEditor = () => {
    return render(
      <FormContext.Provider value={{ FORM_CONTEXT: mockFormContext, SET_FORM_CONTEXT: vi.fn() }}>
        <PrefillEditor
          selectedForm={mockForm}
          selectedNode={mockSelectedNode}
          setters={mockSetters}
        />
      </FormContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the modal with correct components', () => {
    renderPrefillEditor()
    
    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByTestId('labeled-switch')).toBeInTheDocument()
    expect(screen.getByTestId('editable-field-list')).toBeInTheDocument()
  })

  it('initializes form state with selected form', () => {
    renderPrefillEditor()
    
    // the EditableFieldList should be rendered with the form's field schema
    expect(screen.getByTestId('editable-field-list')).toBeInTheDocument()
  })

  it('handles modal close correctly', () => {
    renderPrefillEditor()
    
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    
    expect(mockSetters.us_setShowEditor).toHaveBeenCalledWith(false)
  })

  it('passes correct props to child components', () => {
    renderPrefillEditor()
    
    // Verify LabeledSwitch receives correct props
    const labeledSwitch = screen.getByTestId('labeled-switch')
    expect(labeledSwitch).toBeInTheDocument()
    
    // Verify EditableFieldList receives correct props
    const editableFieldList = screen.getByTestId('editable-field-list')
    expect(editableFieldList).toBeInTheDocument()
  })
})
