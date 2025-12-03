'use client'

import React, { useState } from 'react'
import styles from "./page.module.css";

type FormData = {
  nhsnumber: string // Keep as string to preserve leading zeros
  surname: string
  dob: string // YYYY-MM-DD
}

function Login(): React.ReactElement {
  const [form, setForm] = useState<FormData>({ nhsnumber: '', surname: '', dob: '' })
  const [submitted, setSubmitted] = useState<FormData | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function validate(data: FormData) {
    const err: Partial<FormData> = {}
    if (!data.nhsnumber) err.nhsnumber = 'NHS Number is required'
    if (!data.surname) err.surname = 'Surname is required'
    if (!data.dob) err.dob = 'Date of birth is required'
    return err
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length !== 0) return

    // Set submitted locally for UX whilst we call the API
    setSubmitted(form);
  }

  return (
    <div className="Login">
      {!submitted &&
        <form onSubmit={handleSubmit} className={styles.formCard} noValidate>
          <div className={styles.formRow}>
            <label htmlFor="nhsnumber">NHS Number</label>
            <input
              id="nhsnumber"
              name="nhsnumber"
              value={form.nhsnumber}
              onChange={handleChange}
              placeholder="NHS Number"
              type="text"
              required
            />
            {errors.nhsnumber && <small className={styles.error}>{errors.nhsnumber}</small>}
          </div>

          <div className={styles.formRow}>
            <label htmlFor="surname">Surname</label>
            <input
              id="surname"
              name="surname"
              value={form.surname}
              onChange={handleChange}
              placeholder="Surname"
              type="text"
              required
            />
            {errors.surname && <small className={styles.error}>{errors.surname}</small>}
          </div>

          <div className={styles.formRow}>
            <label htmlFor="dob">Date of birth</label>
            <input
              id="dob"
              name="dob"
              value={form.dob}
              onChange={handleChange}
              type="date"
              required
            />
            {errors.dob && <small className={styles.error}>{errors.dob}</small>}
          </div>

          <div className={styles.formActions}>
            <button type="submit">Submit</button>
          </div>
        </form>
      }
    </div>
  )
}
export default Login
