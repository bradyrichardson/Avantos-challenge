import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Dropdown } from '../components/helpers/Dropdown'
import type { DataSource, Form, FormNode } from '../i_forms'

// mock data for testing
const mockDataSources: DataSource[] = [
  {
    title: 'Source1',
    options: ['Option1', 'Option2']
  },
  {
    title: 'Source2',
    options: ['Option3', 'Option4']
  }
]

const mockSelectedNode: FormNode = {
  data: {
    input_mapping: {}
  }
} as FormNode

const mockSelectedForm: Form = {} as Form

const mockSetters = {
  us_setUpdateValue: vi.fn()
}

describe('Dropdown Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the dropdown component with initial state', () => {
    render(
      <Dropdown
        selectedNode={mockSelectedNode}
        selectedForm={mockSelectedForm}
        selectedField="testField"
        dataSources={mockDataSources}
        setters={mockSetters}
      />
    )

    expect(screen.getByText('Available Data')).toBeInTheDocument()
    expect(screen.getByText('No item selected')).toBeInTheDocument()
    expect(screen.getByText('Source1')).toBeInTheDocument()
    expect(screen.getByText('Source2')).toBeInTheDocument()
  })

  it('expands data source when clicked', () => {
    render(
      <Dropdown
        selectedNode={mockSelectedNode}
        selectedForm={mockSelectedForm}
        selectedField="testField"
        dataSources={mockDataSources}
        setters={mockSetters}
      />
    )

    // click on Source1
    fireEvent.click(screen.getByText('Source1'))

    // check if options are displayed
    expect(screen.getByText('Option1')).toBeInTheDocument()
    expect(screen.getByText('Option2')).toBeInTheDocument()
  })

  it('selects an item and updates the value', () => {
    render(
      <Dropdown
        selectedNode={mockSelectedNode}
        selectedForm={mockSelectedForm}
        selectedField="testField"
        dataSources={mockDataSources}
        setters={mockSetters}
      />
    )

    // expand Source1
    fireEvent.click(screen.getByText('Source1'))

    // select Option1
    fireEvent.click(screen.getByText('Option1'))

    // check if the value was updated
    expect(screen.getByText('Selected value: Source1.Option1')).toBeInTheDocument()
    expect(mockSetters.us_setUpdateValue).toHaveBeenCalledWith('Source1.Option1')
  })

  it('collapses data source when clicked again', () => {
    render(
      <Dropdown
        selectedNode={mockSelectedNode}
        selectedForm={mockSelectedForm}
        selectedField="testField"
        dataSources={mockDataSources}
        setters={mockSetters}
      />
    )

    // click on Source1 to expand
    fireEvent.click(screen.getByText('Source1'))
    expect(screen.getByText('Option1')).toBeInTheDocument()

    // click again to collapse
    fireEvent.click(screen.getByText('Source1'))
    expect(screen.queryByText('Option1')).not.toBeInTheDocument()
  })
})
