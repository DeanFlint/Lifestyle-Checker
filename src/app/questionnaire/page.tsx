'use client'

import React, { useState } from 'react'
import styles from './page.module.css'

type Props = { age: number | null }

type Answers = {
  q1: '' | 'Yes' | 'No'
  q2: '' | 'Yes' | 'No'
  q3: '' | 'Yes' | 'No'
}

export default function Questionnaire({ age }: Props): React.ReactElement {
  const [answers, setAnswers] = useState<Answers>({ q1: '', q2: '', q3: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<Answers | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setAnswers((prev) => ({ ...prev, [name]: value as Answers[keyof Answers] }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!answers.q1 || !answers.q2 || !answers.q3) {
      setError('Please answer all questions.')
      setSubmitted(null)
      return
    }
    setError(null)
    setSubmitted(answers)
  }

  return (
    <div className={styles.wrapper}>
      <h1>Health Questionnaire</h1>
      <h2>User Age: {age}</h2>

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

      {/* {submitted && (
        <div className={styles.result}>
          <h2>Thanks for completing the questionnaire</h2>
          <p>Drinks on more than 2 days/week: {submitted.q1}</p>
          <p>Smokes: {submitted.q2}</p>
          <p>Exercises more than 1 hour/week: {submitted.q3}</p>
        </div>
      )} */}
    </div>
  )
}
