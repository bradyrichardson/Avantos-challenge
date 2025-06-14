import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Modal } from '../components/helpers/Modal'

describe('Modal Component', () => {
  const mockClickOff = vi.fn()
  const mockContent = <div data-testid="modal-content">Test Content</div>

  const defaultProps = {
    jsx: mockContent,
    setters: {
      clickOff: mockClickOff
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the provided JSX content', () => {
    render(<Modal {...defaultProps} />)
    expect(screen.getByTestId('modal-content')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('does not call clickOff when clicking inside the modal', () => {
    render(<Modal {...defaultProps} />)
    
    // simulate clicking inside the modal
    fireEvent.mouseDown(screen.getByTestId('modal-content'))
    
    expect(mockClickOff).not.toHaveBeenCalled()
  })

  it('applies the correct z-index to the modal container', () => {
    render(<Modal {...defaultProps} />)
    
    const modalContainer = screen.getByTestId('modal-content').parentElement
    expect(modalContainer).toHaveStyle({ zIndex: 1000 })
  })
})
