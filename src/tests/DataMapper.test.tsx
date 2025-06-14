import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DataMapper } from '../components/DataMapper'
import { FormContext, GlobalContext } from '../components/helpers/Context'
import type { Form, FormNode, FieldSchema } from '../i_forms'

// mock data
const mockGlobalData = {
  GLOBAL_DATA: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com'
  }
}

const mockFormContext = {
  'Test Form': {
    key: 'test-form',
    form: {} as Form,
    node: {} as FormNode,
    prefill: true
  }
}

const mockSelectedNode: FormNode = {
  id: '1',
  type: 'form',
  data: {
    component_key: 'test-form',
    component_id: 'form1',
    name: 'Test Form',
    prerequisites: ['2'],
    input_mapping: {}
  },
  position: { x: 0, y: 0 }
}

const mockPrerequisiteNode: FormNode = {
  id: '2',
  type: 'form',
  data: {
    component_key: 'prerequisite-form',
    component_id: 'form2',
    name: 'Prerequisite Form',
    prerequisites: [],
    input_mapping: {}
  },
  position: { x: 0, y: 0 }
}

const mockFieldSchema: FieldSchema = {
  type: 'object',
  properties: {
    field1: { type: 'string' }
  },
  additionalProperties: {},
  required: []
}

const mockSelectedForm: Form = {
  $schema: '',
  created_at: '',
  created_by: '',
  custom_javascript: '',
  custom_javascript_triggering_fields: [],
  description: '',
  dynamic_field_config: {},
  field_schema: mockFieldSchema,
  id: 'form1',
  is_reusable: false,
  name: 'Test Form',
  ui_schema: { type: '', elements: [] },
  updated_at: ''
}

const mockPrerequisiteForm: Form = {
  ...mockSelectedForm,
  id: 'form2',
  name: 'Prerequisite Form',
  field_schema: {
    ...mockFieldSchema,
    properties: {
      prerequisiteField: { type: 'string' }
    }
  }
}

const mockSetters = {
  us_setShowDataMapper: vi.fn(),
  us_setShowEditor: vi.fn()
}

describe('DataMapper Component', () => {
  const renderDataMapper = () => {
    return render(
      <GlobalContext.Provider value={mockGlobalData}>
        <FormContext.Provider value={{ 
          FORM_CONTEXT: mockFormContext, 
          SET_FORM_CONTEXT: vi.fn() 
        }}>
          <DataMapper
            setters={mockSetters}
            selectedNode={mockSelectedNode}
            selectedForm={mockSelectedForm}
            nodes={[mockSelectedNode, mockPrerequisiteNode]}
            forms={[mockSelectedForm, mockPrerequisiteForm]}
            selectedField="field1"
          />
        </FormContext.Provider>
      </GlobalContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the modal with correct title', () => {
    renderDataMapper()
    expect(screen.getByText('Select data element to map')).toBeInTheDocument()
  })

  it('displays global data dropdown', () => {
    renderDataMapper()
    expect(screen.getByText('Global Data')).toBeInTheDocument()
  })

  it('displays prerequisite form dropdown', () => {
    renderDataMapper()
    expect(screen.getByText('Prerequisite Form')).toBeInTheDocument()
  })

  it('handles cancel button click', () => {
    renderDataMapper()
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)
    
    expect(mockSetters.us_setShowDataMapper).toHaveBeenCalledWith(false)
    expect(mockSetters.us_setShowEditor).toHaveBeenCalledWith(true)
  })

  it('handles confirm button click', () => {
    renderDataMapper()
    const confirmButton = screen.getByText('Confirm')
    fireEvent.click(confirmButton)
    
    expect(mockSetters.us_setShowDataMapper).toHaveBeenCalledWith(false)
    expect(mockSetters.us_setShowEditor).toHaveBeenCalledWith(true)
  })

  it('formats dropdown menu titles correctly', () => {
    renderDataMapper()
    // the title should be formatted from "prerequisite_form" to "Prerequisite Form"
    expect(screen.getByText('Prerequisite Form')).toBeInTheDocument()
  })

  it('does not show duplicate data sources', () => {
    const duplicateNode = { ...mockPrerequisiteNode }
    const duplicateForm = { ...mockPrerequisiteForm }
    
    render(
      <GlobalContext.Provider value={mockGlobalData}>
        <FormContext.Provider value={{ 
          FORM_CONTEXT: mockFormContext, 
          SET_FORM_CONTEXT: vi.fn() 
        }}>
          <DataMapper
            setters={mockSetters}
            selectedNode={mockSelectedNode}
            selectedForm={mockSelectedForm}
            nodes={[mockSelectedNode, mockPrerequisiteNode, duplicateNode]}
            forms={[mockSelectedForm, mockPrerequisiteForm, duplicateForm]}
            selectedField="field1"
          />
        </FormContext.Provider>
      </GlobalContext.Provider>
    )

    const prerequisiteForms = screen.getAllByText('Prerequisite Form')
    expect(prerequisiteForms).toHaveLength(1)
  })
})
