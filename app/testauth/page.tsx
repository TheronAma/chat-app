"use client";
import { useSession, signOut} from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  while (status === undefined) {}

  if (status === "authenticated") {
    return <>
        <button onClick={() => signOut()}>Sign out</button>
    <p>Signed in as {session.user?.email}</p>
    </>
  }

  return <a href="/api/auth/signin">Sign in</a>
}