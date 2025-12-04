'use client'

import { useState } from 'react'
import Login from "./login/page";
import Questionnaire from "./questionnaire/page"
import styles from "./page.module.css";

export default function Home() {
  const [age, setAge] = useState<number | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <h1>T2 Lifestyle Checker</h1>
        </div>
        <Login
          onLoginSuccess={(userAge) => {
            setAge(userAge)
            setIsLoggedIn(true)
          }}
          onLogout={() => {
            setAge(null)
            setIsLoggedIn(false)
          }}
        />

        {isLoggedIn && age !== null && <Questionnaire age={age} />}
      </main>
    </div>
  );
}
