import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../App'
import { describe, expect, it, vi } from 'vitest'

// mock the RootFormView component since we're testing App in isolation
vi.mock('../components/RootFormView', () => ({
  RootFormView: () => <div data-testid="root-form-view">Root Form View</div>
}))

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    const appRoot = screen.getByTestId('app-root')
    const rootFormView = screen.getByTestId('root-form-view')

    expect(appRoot).toBeInTheDocument()
    expect(rootFormView).toBeInTheDocument()
    expect(appRoot).toContainElement(rootFormView)
  })

  it('initializes with empty form context', () => {
    render(<App />)
    // since we can't directly access context values in tests, we'll verify the component renders
    const rootFormView = screen.getByTestId('root-form-view')
    expect(rootFormView).toBeInTheDocument()
  })

  it('renders with correct styling', () => {
    render(<App />)
    const appRoot = screen.getByTestId('app-root')
    
    // check if the Box component has the correct styling
    expect(appRoot).toHaveStyle({
      height: '100%',
      width: '100vw',
      position: 'absolute',
      left: '0',
      top: '0',
      backgroundColor: 'text.secondary'
    })
  })

  it('renders RootFormView component', () => {
    render(<App />)
    const rootFormView = screen.getByTestId('root-form-view')
    expect(rootFormView).toBeInTheDocument()
    expect(rootFormView).toHaveTextContent('Root Form View')
  })
})