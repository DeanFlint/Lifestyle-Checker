import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../src/app/page'

jest.mock('../src/app/login/page', () => {
  const MockLogin: React.FC<{ onLoginSuccess?: (age: number) => void }> = (props) => (
    <button onClick={() => props.onLoginSuccess?.(30)}>Mock Login</button>
  )
  MockLogin.displayName = 'MockLogin'
  return { __esModule: true, default: MockLogin }
})

jest.mock('../src/app/questionnaire/page', () => {
  const MockQuestionnaire: React.FC<Record<string, unknown>> = () => <div>Health Questionnaire</div>
  MockQuestionnaire.displayName = 'MockQuestionnaire'
  return { __esModule: true, default: MockQuestionnaire }
})

describe('Home page flow', () => {
  it('shows questionnaire after login success', () => {
    render(<Home />)
    fireEvent.click(screen.getByText(/Mock Login/i))
    expect(screen.getByText(/Health Questionnaire/i)).toBeInTheDocument()
  })
})
