// src/components/App.test.tsx
import { test, expect, vi } from 'vitest'
import { updateContext } from '../components/helpers/Utils'
import type { Form, FormNode } from '../i_forms'
import type { BlueprintContext } from '../components/helpers/Context'

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

const mockNode: FormNode = {
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

const mockFullContext: BlueprintContext = {
  'Test Node': {
    key: 'Test Node',
    form: mockForm,
    node: mockNode,
    prefill: false
  }
}

describe('updateContext', () => {
  const mockSetter = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('successfully updates context with full context object', () => {
    updateContext(null, null, null, null, mockSetter, mockFullContext)
    
    expect(mockSetter).toHaveBeenCalledWith({...mockFullContext})
  })

  test('successfully updates context with individual parameters', () => {
    const key = 'Test Node'
    const prefill = true
    
    updateContext(mockForm, mockNode, prefill, key, mockSetter)
    
    expect(mockSetter).toHaveBeenCalledWith(expect.any(Function))
    
    // get the function that was passed to setter
    const setterFunction = mockSetter.mock.calls[0][0]
    
    // call the function with an empty previous context
    const result = setterFunction({})
    
    expect(result).toEqual({
      [key]: {
        key,
        form: mockForm,
        node: mockNode,
        prefill
      }
    })
  })

  test('preserves existing context when updating with individual parameters', () => {
    const key = 'Test Node'
    const prefill = true
    const existingContext = {
      'Other Node': {
        key: 'Other Node',
        form: mockForm,
        node: mockNode,
        prefill: false
      }
    }
    
    updateContext(mockForm, mockNode, prefill, key, mockSetter)
    
    // get the function that was passed to setter
    const setterFunction = mockSetter.mock.calls[0][0]
    
    // call the function with existing context
    const result = setterFunction(existingContext)
    
    expect(result).toEqual({
      ...existingContext,
      [key]: {
        key,
        form: mockForm,
        node: mockNode,
        prefill
      }
    })
  })

  test('does not update context when required parameters are missing', () => {
    // test with missing form
    updateContext(null, mockNode, true, 'Test Node', mockSetter)
    expect(mockSetter).not.toHaveBeenCalled()

    // test with missing node
    updateContext(mockForm, null, true, 'Test Node', mockSetter)
    expect(mockSetter).not.toHaveBeenCalled()

    // test with missing prefill
    updateContext(mockForm, mockNode, null, 'Test Node', mockSetter)
    expect(mockSetter).not.toHaveBeenCalled()

    // test with missing key
    updateContext(mockForm, mockNode, true, null, mockSetter)
    expect(mockSetter).not.toHaveBeenCalled()
  })

  test('handles empty context object correctly', () => {
    const key = 'Test Node'
    const prefill = true
    
    updateContext(mockForm, mockNode, prefill, key, mockSetter)
    
    // get the function that was passed to setter
    const setterFunction = mockSetter.mock.calls[0][0]
    
    // call the function with undefined
    const result = setterFunction(undefined)
    
    expect(result).toEqual({
      [key]: {
        key,
        form: mockForm,
        node: mockNode,
        prefill
      }
    })
  })
})
