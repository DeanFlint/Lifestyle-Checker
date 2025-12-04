import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from '../src/app/login/page'

function fillForm() {
  fireEvent.change(screen.getByLabelText(/NHS Number/i), { target: { value: '111222333' } })
  fireEvent.change(screen.getByLabelText(/Surname/i), { target: { value: 'Doe' } })
  fireEvent.change(screen.getByLabelText(/Date of birth/i), { target: { value: '2007-01-14' } })
}

describe('Login', () => {
  it('validates required fields', () => {
    render(<Login />)
    fireEvent.click(screen.getByText(/Submit/i))
    expect(screen.getByText(/NHS Number is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Surname is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Date of birth is required/i)).toBeInTheDocument()
  })

  it('calls API and shows welcome on match', async () => {
    const onLoginSuccess = jest.fn()
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ nhsnumber: '111222333', name: 'Doe, John', born: '14-01-2007' }),
    } as Response)

    render(<Login onLoginSuccess={onLoginSuccess} />)
    fillForm()
    fireEvent.click(screen.getByText(/Submit/i))

    await waitFor(() => expect(screen.getByText(/Welcome John Doe/i)).toBeInTheDocument())
    expect(onLoginSuccess).toHaveBeenCalledWith(expect.any(Number))
  })
})