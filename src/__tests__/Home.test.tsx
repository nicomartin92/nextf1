import { render } from '@testing-library/react'
import Home from '../app/page'

describe('Home', () => {
  it('renders without crashing', () => {
    render(<Home />)
    // Add your assertions here based on what should be present on your home page
    // For example:
    // expect(screen.getByRole('heading')).toBeInTheDocument()
  })
})
