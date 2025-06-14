import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LabeledSwitch } from '../components/helpers/LabeledSwitch'
import { FormContext } from '../components/helpers/Context'
import type { Form, FormNode } from '../i_forms'

// mock the updateContext function
vi.mock('../components/helpers/Utils', () => ({
  updateContext: vi.fn()
}))

describe('LabeledSwitch Component', () => {
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
      properties: {},
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
      name: 'testField',
      prerequisites: [],
      input_mapping: {}
    },
    position: { x: 0, y: 0 }
  }

  const mockFormContext = {
    testField: {
      key: 'testField',
      form: mockForm,
      node: mockSelectedNode,
      prefill: false
    }
  }

  const mockSetFormContext = vi.fn()

  const defaultProps = {
    label: 'Test Switch',
    description: 'Test Description',
    params: {
      selectedForm: mockForm,
      selectedNode: mockSelectedNode
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with label and description', () => {
    render(
      <FormContext.Provider value={{ FORM_CONTEXT: mockFormContext, SET_FORM_CONTEXT: mockSetFormContext }}>
        <LabeledSwitch {...defaultProps} />
      </FormContext.Provider>
    )

    expect(screen.getByText('Test Switch')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('renders without description', () => {
    const propsWithoutDescription = {
      ...defaultProps,
      description: undefined
    }

    render(
      <FormContext.Provider value={{ FORM_CONTEXT: mockFormContext, SET_FORM_CONTEXT: mockSetFormContext }}>
        <LabeledSwitch {...propsWithoutDescription} />
      </FormContext.Provider>
    )

    expect(screen.getByText('Test Switch')).toBeInTheDocument()
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
  })

  it('reflects the correct switch state from form context', () => {
    const contextWithTrueValue = {
      testField: {
        key: 'testField',
        form: mockForm,
        node: mockSelectedNode,
        prefill: true
      }
    }

    render(
      <FormContext.Provider value={{ FORM_CONTEXT: contextWithTrueValue, SET_FORM_CONTEXT: mockSetFormContext }}>
        <LabeledSwitch {...defaultProps} />
      </FormContext.Provider>
    )

    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
