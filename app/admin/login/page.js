'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { config } from '@/lib/config'

export default function PaginaLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function entrar(e) {
    e.preventDefault()
    setError('')
    setCargando(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos.')
      setCargando(false)
      return
    }
    // Navegación "dura" para que el servidor lea la nueva sesión y entre al panel.
    window.location.href = '/admin'
  }

  return (
    <div className="login-caja">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt={config.nombreTienda} />
      <h2>Panel de {config.nombreTienda}</h2>
      {error && <div className="aviso aviso-error">{error}</div>}
      <form onSubmit={entrar}>
        <div className="campo">
          <label>Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>
        <div className="campo">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        <button type="submit" className="btn btn-rosa btn-bloque" disabled={cargando}>
          {cargando ? (
            <>
              <span className="spinner" />
              Entrando…
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>
    </div>
  )
}
