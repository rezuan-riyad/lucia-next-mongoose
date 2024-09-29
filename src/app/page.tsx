import styles from "./page.module.css";
import { validateRequest } from "@/auth";
import { logout } from "@/actions";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Hello World</h1>
        {user ? (
          <div className="w-[100px]">
            <h3>Welcome</h3>
            <p>{JSON.stringify(user)}</p>
            <form action={logout}>
              <button type="submit">Logout</button>
            </form>
          </div>
        ) : null}
      </main>
    </div>
  );
}
