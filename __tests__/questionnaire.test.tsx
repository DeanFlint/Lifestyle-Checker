import { render, screen, fireEvent } from '@testing-library/react'
import Questionnaire from '../src/app/questionnaire/page'

function answerAll(q1: 'Yes' | 'No', q2: 'Yes' | 'No', q3: 'Yes' | 'No') {
  fireEvent.click(screen.getByLabelText(q1, { selector: 'input[name="q1"]' }))
  fireEvent.click(screen.getByLabelText(q2, { selector: 'input[name="q2"]' }))
  fireEvent.click(screen.getByLabelText(q3, { selector: 'input[name="q3"]' }))
}

// /string/i -> ignore case
describe('Questionnaire scoring', () => {
  it('requires all answers', () => {
    render(<Questionnaire age={30} />)
    fireEvent.click(screen.getByText(/Submit/i))
    expect(screen.getByText(/Please answer all questions/i)).toBeInTheDocument()
  })

  it('calculates score and shows advice message', async () => {
    render(<Questionnaire age={30} />)
    answerAll('Yes', 'Yes', 'No')
    fireEvent.click(screen.getByText(/Submit/i))

    expect(
      await screen.findByText(/We think there are some simple things you could do to improve your quality of life, please phone to book an appointment./i)
    ).toBeInTheDocument()
  })
})
