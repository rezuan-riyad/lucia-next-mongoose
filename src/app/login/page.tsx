import styles from "../page.module.css";
import { validateRequest } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
	const { user } = await validateRequest();

	if (user) {
		return redirect("/");
	}

	return (

		<div className={styles.page}>
			<main className={styles.main}>
				<h1>Log In</h1>
				<Link href="/api/auth/google" style={{ padding: "2px 4px", border: "1px solid gray"}}>
					Log in with google
				</Link>
			</main>
		</div>

	);
}