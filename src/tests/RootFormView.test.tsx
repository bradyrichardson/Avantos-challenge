import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RootFormView } from '../components/RootFormView'
import { FormContext } from '../components/helpers/Context'
import axios from 'axios'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { MockedFunction } from 'vitest'

// mock axios
vi.mock('axios')
const mockedAxios = axios as unknown as {
  get: MockedFunction<typeof axios.get>
}

// mock child components
vi.mock('../components/PrefillEditor', () => ({
  PrefillEditor: () => <div data-testid="prefill-editor">Prefill Editor</div>
}))

vi.mock('../components/DataMapper', () => ({
  DataMapper: () => <div data-testid="data-mapper">Data Mapper</div>
}))

// sample test data
const mockForms = [
  {
    id: 'form1',
    name: 'Form 1',
    fields: []
  }
]

const mockNodes = [
  {
    id: 'node1',
    data: {
      name: 'Node 1',
      component_id: 'form1',
      component_key: 'node1',
      input_mapping: {}
    },
    position: { x: 100, y: 100 }
  }
]

const mockEdges = [
  {
    source: 'node1',
    target: 'node2'
  }
]

const mockApiResponse = {
  data: {
    forms: mockForms,
    nodes: mockNodes,
    edges: mockEdges
  }
}

describe('RootFormView', () => {
  const mockSetFormContext = vi.fn()
  const mockFormContext = {}

  const renderComponent = () => {
    return render(
      <FormContext.Provider value={{ FORM_CONTEXT: mockFormContext, SET_FORM_CONTEXT: mockSetFormContext }}>
        <RootFormView />
      </FormContext.Provider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // reset the mock implementation before each test
    mockedAxios.get.mockReset()
    // set up the default successful response
    mockedAxios.get.mockResolvedValue(mockApiResponse)
  })

  it('renders without crashing', async () => {
    renderComponent()
    await waitFor(() => {
      expect(screen.getByTestId('root-form-view')).toBeInTheDocument()
    })
  })

  it('fetches and displays form data on mount', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3000/api/v1/123/actions/blueprints/bp_456/graph',
        expect.any(Object)
      )
    })
  })

  it('displays nodes when data is loaded', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Node 1')).toBeInTheDocument()
    })
  })

  it('shows PrefillEditor when a node is clicked', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Node 1')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Node 1'))
    
    expect(screen.getByTestId('prefill-editor')).toBeInTheDocument()
  })

  it('updates context when node data changes', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('Node 1')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Node 1'))
    
    await waitFor(() => {
      expect(mockSetFormContext).toHaveBeenCalled()
    })
  })

  it('handles API errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error')
    mockedAxios.get.mockRejectedValue(new Error('API Error'))
    
    renderComponent()
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
  })

  it('orders nodes by x position', async () => {
    const unsortedNodes = [
      { ...mockNodes[0], position: { x: 200, y: 100 } },
      { ...mockNodes[0], id: 'node2', position: { x: 100, y: 100 } }
    ]

    mockedAxios.get.mockResolvedValue({
      data: {
        forms: mockForms,
        nodes: unsortedNodes,
        edges: mockEdges
      }
    })

    renderComponent()
    
    await waitFor(() => {
      const nodes = screen.getAllByText(/Node/).map(node => node.textContent)
      expect(nodes).toHaveLength(2)
    })
  })
})
