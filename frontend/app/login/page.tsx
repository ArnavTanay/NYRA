"use client"

import { supabase } from "@/lib/supabaseClient"

import { useState } from "react"

import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleAuth = async () => {
      console.log("handleAuth called", email, password)
  if (isLogin) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(error.message)
    else {
        console.log("Login successful, redirecting...")
        window.location.href = "/"
}
  } else {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
  }
}

  return (
    <div>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
<button onClick={handleAuth}>
  {isLogin ? "Login" : "Sign Up"}
</button>
<button onClick={() => setIsLogin(!isLogin)}>
  {isLogin ? "Need an account? Sign Up" : "Have an account? Login"}
</button>
    </div>
  )
}