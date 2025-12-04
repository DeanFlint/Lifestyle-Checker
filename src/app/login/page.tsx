'use client'

import React, { useState } from 'react'
import styles from "./page.module.css";

type LoginProps = {
  onLoginSuccess?: (age: number) => void
  onLogout?: () => void
}

type FormData = {
  nhsnumber: string // Keep as string to preserve leading zeros
  surname: string
  dob: string // YYYY-MM-DD
}

type ApiPatient = {
  nhsnumber: string;
  name: string; // Surname, Firstname
  born: string; // defaults to DD-MM-YYYY
}

function validate(data: FormData) {
  const err: Partial<FormData> = {}
  if (!data.nhsnumber) err.nhsnumber = 'NHS Number is required'
  if (!data.surname) err.surname = 'Surname is required'
  if (!data.dob) err.dob = 'Date of birth is required'
  return err
}

function surnameFromResponse(rawName: unknown) {
  if (typeof rawName !== 'string') return '';
  return rawName.split(',')[0]?.trim() ?? '';
}

function formatName(rawName: string) {
  const [last, first] = rawName.split(',').map((part) => part.trim());
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return `${cap(first)} ${cap(last)}`;
}

function normalise(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function formatDateYMD(value: string) {
  if (!value) return '';
  const [d, m, y] = value.split('-');
  return [y, m, d].join('-');
}

function getAge(dob: string) {
  // Check dob is present
  if (!dob) return null;
  // Parse date, check if valid
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  // Calculate age = difference between current year and birth year
  let age = today.getFullYear() - birth.getFullYear();

  // Check if birthday has occurred this year, if not, subtract a year
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

export default function Login({ onLoginSuccess, onLogout }: LoginProps): React.ReactElement {
  const [form, setForm] = useState<FormData>({ nhsnumber: '', surname: '', dob: '' })
  const [submitted, setSubmitted] = useState<FormData | null>(null)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [apiResult, setApiResult] = useState<Record<string, unknown> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length !== 0) return

    // Set submitted locally for UX whilst we call the API
    setSubmitted(form);
    setIsLoading(true)

    const res = await fetch(`/api/login?nhsnum=${encodeURIComponent(form.nhsnumber)}`, { cache: 'no-store' });
    const data = await res.json();
    if (!res.ok) setApiError(data.error || 'Login failed');

    const patient = data as ApiPatient;
    const surnameFromApi = surnameFromResponse(data.name);
    const nhsMatch = normalise(patient.nhsnumber ?? data.nhsNumber) === normalise(form.nhsnumber);
    const surnameMatch = normalise(surnameFromApi ?? data.name) === normalise(form.surname);
    const dobMatch = formatDateYMD(patient.born) === form.dob;

    setApiResult({ ...patient, nhsMatch, surnameMatch, dobMatch });

    if (!nhsMatch || !surnameMatch || !dobMatch) {
      setApiError("Your details could not be found")
      setApiResult(null)
    } else if (getAge(form.dob) !== null && getAge(form.dob)! < 18) {
      setApiError("You are not eligible for this service")
      setApiResult(null)
    }
    else if (nhsMatch && surnameMatch && dobMatch) {
      const age = getAge(form.dob)
      if (age !== null) onLoginSuccess?.(age)
      setApiResult(data)
    }

    setIsLoading(false)
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

      {submitted && (
        <section>
          {isLoading && <p>Checking NHS number…</p>}

          {apiError && (
            <div>
              <h3 className={styles.error}>{apiError}</h3>
              <button
                type="button"
                onClick={() => {
                  setForm({ nhsnumber: '', surname: '', dob: '' })
                  setErrors({})
                  setSubmitted(null)
                  setApiError(null)
                }}
              >
                Back to login
              </button>
            </div>
          )}

          {apiResult && (
            <div className={styles.welcomeHeader}>
              <h3>Welcome {formatName(String(apiResult.name))}!</h3>
              <button
                type="button"
                onClick={() => {
                  setForm({ nhsnumber: '', surname: '', dob: '' })
                  setErrors({})
                  setSubmitted(null)
                  setApiError(null)
                  setApiResult(null)
                  onLogout?.()
                }}
              >
                Logout
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
