import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../src/app/page'

jest.mock('../src/app/login/page', () => (props: any) => (
  <button onClick={() => props.onLoginSuccess?.(30)}>Mock Login</button>
))
jest.mock('../src/app/questionnaire/page', () => (props: any) => (
  <div>Health Questionnaire</div>
))

describe('Home page flow', () => {
  it('shows questionnaire after login success', () => {
    render(<Home />)
    fireEvent.click(screen.getByText(/Mock Login/i))
    expect(screen.getByText(/Health Questionnaire/i)).toBeInTheDocument()
  })
})