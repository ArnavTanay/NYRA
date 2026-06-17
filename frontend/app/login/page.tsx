"use client"

import { useRouter } from 'next/navigation'
import { supabase } from "@/lib/supabaseClient"
import { useState } from "react"

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleAuth = async () => {
    console.log("handleAuth called", email, password)
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else router.push('/')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) alert(error.message)
      else alert("Check your email to confirm your account!")
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0d0d14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: "2rem"
    }}>

      {/* Logo + branding */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          border: "1px solid #3d2a6e", backgroundColor: "#1a1030",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1rem", fontSize: "2rem"
        }}>✦</div>
        <h1 style={{ color: "#c4a8f5", fontSize: "2rem", fontWeight: "700", margin: "0 0 0.25rem" }}>NYRA</h1>
      
        <p style={{ color: "#4a3d6b", fontSize: "0.85rem", margin: 0 }}>NYRA remembers so you don't have to. 🤍</p>
      </div>

      {/* Card */}
      <div style={{
        backgroundColor: "#13111f",
        border: "1px solid #2a1f4e",
        borderRadius: "16px",
        padding: "2rem",
        width: "100%",
        maxWidth: "420px"
      }}>
        <h2 style={{ color: "#ffffff", fontSize: "1.4rem", fontWeight: "600", margin: "0 0 0.5rem", textAlign: "center" }}>
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p style={{ color: "#6b5a8e", fontSize: "0.9rem", textAlign: "center", margin: "0 0 1.75rem" }}>
          {isLogin ? "Log in to continue your journey" : "Start your journey with NYRA"}
        </p>

        {/* Email */}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6b5a8e", fontSize: "1rem" }}>✉</span>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%", padding: "0.85rem 1rem 0.85rem 2.75rem",
              backgroundColor: "#0d0d14", border: "1px solid #2a1f4e",
              borderRadius: "10px", color: "#ffffff", fontSize: "0.95rem",
              outline: "none", boxSizing: "border-box"
            }}
          />
        </div>

        {/* Password */}
        <div style={{ position: "relative", marginBottom: "1.5rem" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#6b5a8e", fontSize: "1rem" }}>🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", padding: "0.85rem 3rem 0.85rem 2.75rem",
              backgroundColor: "#0d0d14", border: "1px solid #2a1f4e",
              borderRadius: "10px", color: "#ffffff", fontSize: "0.95rem",
              outline: "none", boxSizing: "border-box"
            }}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#6b5a8e", cursor: "pointer", fontSize: "1rem"
            }}
          >{showPassword ? "🙈" : "👁"}</button>
        </div>

        {/* Submit */}
        <button
          onClick={handleAuth}
          style={{
            width: "100%", padding: "0.9rem",
            backgroundColor: "#7c3aed", border: "none",
            borderRadius: "10px", color: "#ffffff",
            fontSize: "1rem", fontWeight: "600", cursor: "pointer"
          }}
        >
          {isLogin ? "Log in" : "Sign up"}
        </button>

        {/* Toggle */}
        <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#6b5a8e", fontSize: "0.9rem" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: "#c4a8f5", cursor: "pointer", fontWeight: "500" }}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  )
}