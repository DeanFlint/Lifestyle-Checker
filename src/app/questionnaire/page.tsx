'use client'

import React, { useState } from 'react'
import styles from './page.module.css'

type Props = { 
  age: number 
}

type Answers = {
  q1: '' | 'Yes' | 'No'
  q2: '' | 'Yes' | 'No'
  q3: '' | 'Yes' | 'No'
}

type Result = {
  score: number
  answers: Answers
}

type ScoreRow = {
  min: number
  max: number
  q1: number
  q2: number
  q3: number
}

const SCORE_TABLE: ScoreRow[] = [
  { min: 16, max: 21, q1: 1, q2: 2, q3: 1 },
  { min: 22, max: 40, q1: 2, q2: 2, q3: 3 },
  { min: 41, max: 65, q1: 3, q2: 2, q3: 2 },
  { min: 66, max: 1201, q1: 3, q2: 3, q3: 1 },
]

function getScoreRow(age: number | null) {
  if (age === null) return null
  return SCORE_TABLE.find((row) => age >= row.min && age <= row.max) ?? null
}

function calculateScore(age: number, answers: Answers) {
  const row = getScoreRow(age)
  if (!row) return null

  let total = 0
  if (answers.q1 === 'Yes') total += row.q1
  if (answers.q2 === 'Yes') total += row.q2
  if (answers.q3 === 'No') total += row.q3

  return total
}

export default function Questionnaire({ age }: Props): React.ReactElement {
  const [answers, setAnswers] = useState<Answers>({ q1: '', q2: '', q3: '' })
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setAnswers((prev) => ({ ...prev, [name]: value as Answers[keyof Answers] }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answers.q1 || !answers.q2 || !answers.q3) {
      setError('Please answer all questions')
      setResult(null)
      return
    }

    const score = calculateScore(age, answers)
    if (score === null) {
      setError('Unable to calculate score for the given age')
      setResult(null)
      return
    }

    setError(null)
    setResult({ score, answers })
  }

  return (
    <div className={styles.wrapper}>
      <h2>Health Questionnaire</h2>

      {!result && (
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <fieldset className={styles.fieldset}>
          <legend>Q1. Do you drink on more than 2 days a week?</legend>
          <label>
            <input
              type="radio"
              name="q1"
              value="Yes"
              checked={answers.q1 === 'Yes'}
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="q1"
              value="No"
              checked={answers.q1 === 'No'}
              onChange={handleChange}
              required
            />
            No
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Q2. Do you smoke?</legend>
          <label>
            <input
              type="radio"
              name="q2"
              value="Yes"
              checked={answers.q2 === 'Yes'}
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="q2"
              value="No"
              checked={answers.q2 === 'No'}
              onChange={handleChange}
              required
            />
            No
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Q3. Do you exercise more than 1 hour per week?</legend>
          <label>
            <input
              type="radio"
              name="q3"
              value="Yes"
              checked={answers.q3 === 'Yes'}
              onChange={handleChange}
              required
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="q3"
              value="No"
              checked={answers.q3 === 'No'}
              onChange={handleChange}
              required
            />
            No
          </label>
        </fieldset>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.submit}>
          Submit
        </button>
      </form>
      )}

      {result && (
        <div className={styles.result}>
          <h3>Thanks for completing the questionnaire</h3>
          <p>
            {result.score <= 3
              ? "Thank you for answering our questions, we don't need to see you at this time. Keep up the good work!"
              : 'We think there are some simple things you could do to improve your quality of life, please phone to book an appointment.'}
          </p>
        </div>
      )}
    </div>
  )
}
