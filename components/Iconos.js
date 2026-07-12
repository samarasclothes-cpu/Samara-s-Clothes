// Íconos SVG reutilizables (estilo línea). Heredan el color con "currentColor".
// Uso: <IconoBolsa size={48} />

function Base({ size = 24, fill = 'none', stroke = 'currentColor', children, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

// Bolsa de compras (estado vacío)
export function IconoBolsa(props) {
  return (
    <Base {...props}>
      <path d="M6 2 L3 6 v14 a2 2 0 0 0 2 2 h14 a2 2 0 0 0 2 -2 V6 l-3 -4 z" />
      <path d="M3 6 h18" />
      <path d="M16 10 a4 4 0 0 1 -8 0" />
    </Base>
  )
}

// Prenda / camisa (placeholder de producto sin foto)
export function IconoPrenda(props) {
  return (
    <Base {...props}>
      <path d="M20.38 3.46 16 2a4 4 0 0 1 -8 0 L3.62 3.46 a2 2 0 0 0 -1.34 2.23 l.58 3.47 a1 1 0 0 0 .99 .84 H6 v10 c0 1.1 .9 2 2 2 h8 a2 2 0 0 0 2 -2 V10 h2.15 a1 1 0 0 0 .99 -.84 l.58 -3.47 a2 2 0 0 0 -1.34 -2.23 z" />
    </Base>
  )
}

// Lupa (búsqueda / 404)
export function IconoLupa(props) {
  return (
    <Base {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21 l-4.35 -4.35" />
    </Base>
  )
}

// Lápiz (editar)
export function IconoLapiz(props) {
  return (
    <Base {...props}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5 a2.12 2.12 0 0 1 3 3 L7 19 l-4 1 1 -4 z" />
    </Base>
  )
}

// Más (agregar)
export function IconoMas(props) {
  return (
    <Base {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Base>
  )
}

// Check (éxito)
export function IconoCheck(props) {
  return (
    <Base {...props}>
      <path d="M20 6 L9 17 l-5 -5" />
    </Base>
  )
}

// Imagen (subir fotos)
export function IconoImagen(props) {
  return (
    <Base {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15 l-5 -5 L5 21" />
    </Base>
  )
}

// Corazón (relleno)
export function IconoCorazon(props) {
  return (
    <Base fill="currentColor" stroke="none" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0 -7.78 0 L12 5.67 l-1.06 -1.06 a5.5 5.5 0 1 0 -7.78 7.78 L12 21.23 l8.84 -8.84 a5.5 5.5 0 0 0 0 -7.78 z" />
    </Base>
  )
}

// WhatsApp (logo relleno)
export function IconoWhatsApp(props) {
  return (
    <svg
      width={props.size || 24}
      height={props.size || 24}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.8.97h.01a7.94 7.94 0 0 0 5.59-13.54Zm-5.55 12.2a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.43-.16-.25a6.59 6.59 0 1 1 12.22-3.5 6.6 6.6 0 0 1-6.63 6.59Zm3.62-4.94c-.2-.1-1.17-.58-1.35-.64s-.31-.1-.44.1-.51.64-.63.77-.23.15-.43.05a5.4 5.4 0 0 1-1.59-.98 6 6 0 0 1-1.1-1.37c-.11-.2 0-.3.09-.4l.3-.35c.1-.12.13-.2.2-.34a.37.37 0 0 0-.02-.35c-.05-.1-.44-1.07-.6-1.46-.16-.38-.32-.33-.44-.34h-.38a.72.72 0 0 0-.52.24 2.18 2.18 0 0 0-.68 1.62 3.79 3.79 0 0 0 .8 2.02 8.7 8.7 0 0 0 3.33 2.94c.47.2.83.32 1.11.41.47.15.9.13 1.23.08.38-.06 1.17-.48 1.33-.94s.16-.86.11-.94-.18-.13-.38-.23Z" />
    </svg>
  )
}
