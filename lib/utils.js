import { config } from '@/lib/config'

// Da formato al precio con separador de miles. Ej: 12500 -> "$12.500"
export function formatearPrecio(precio) {
  if (precio === null || precio === undefined || precio === '') return ''
  const numero = Number(precio)
  if (Number.isNaN(numero)) return ''
  return config.simboloMoneda + numero.toLocaleString('es-ES')
}

// Construye el enlace de WhatsApp con un mensaje ya escrito para un producto.
export function enlaceWhatsApp(producto, urlProducto) {
  const precio = formatearPrecio(producto.price)
  let mensaje = `¡Hola ${config.nombreTienda}! 👋 Me interesa este producto:\n\n`
  mensaje += `*${producto.name}*`
  if (precio) mensaje += `\nPrecio: ${precio}`
  if (urlProducto) mensaje += `\n${urlProducto}`
  mensaje += `\n\n¿Está disponible?`
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensaje)}`
}

// Enlace genérico de WhatsApp (botón de contacto general).
export function enlaceWhatsAppGeneral() {
  const mensaje = `¡Hola ${config.nombreTienda}! 👋 Quisiera más información.`
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(mensaje)}`
}
