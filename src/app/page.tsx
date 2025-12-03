import Login from "./login/page";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>T2 Lifestyle Checker</h1>
        <p>Welcome to the T2 Lifestyle Checker application.</p>
        <Login />
      </main>
    </div>
  );
}
