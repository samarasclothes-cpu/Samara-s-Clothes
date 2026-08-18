import { config } from '@/lib/config'

// ═══════════════════════════════════════════════════════════════
//  OPTIMIZACIÓN DE FOTOS (se hace en el navegador, antes de subir)
//
//  Achica la foto y le baja un poco la calidad para que ocupe
//  mucho menos espacio en Supabase, sin que se note a simple vista.
//  Los valores se ajustan en lib/config.js → config.imagenes
// ═══════════════════════════════════════════════════════════════

const AJUSTES = config.imagenes || {}
const LADO_MAXIMO = AJUSTES.ladoMaximo || 1400
const CALIDAD = AJUSTES.calidad ?? 0.82

// Formatos que no tiene sentido recomprimir (los GIF se animan, los SVG son texto).
const SIN_TOCAR = ['image/gif', 'image/svg+xml']

// ¿El navegador sabe guardar en WebP? (pesa ~30% menos que JPG con la misma calidad)
let cacheWebP = null
function soportaWebP() {
  if (cacheWebP !== null) return cacheWebP
  try {
    const lienzo = document.createElement('canvas')
    lienzo.width = 1
    lienzo.height = 1
    cacheWebP = lienzo.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    cacheWebP = false
  }
  return cacheWebP
}

// Carga el archivo como imagen, respetando la rotación de las fotos de celular.
async function cargarImagen(archivo) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(archivo, { imageOrientation: 'from-image' })
    } catch {
      // Algunos navegadores no aceptan las opciones: seguimos con el método clásico.
    }
  }
  return await new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(archivo)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolver(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      rechazar(new Error('No se pudo leer la imagen'))
    }
    img.src = url
  })
}

// Muestra un peso en KB o MB. Ej: 1536000 -> "1,5 MB"
export function formatearPeso(bytes) {
  if (!bytes && bytes !== 0) return ''
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0).replace('.', ',') + ' KB'
  return (bytes / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB'
}

/**
 * Optimiza una foto antes de subirla.
 * Devuelve { archivo, pesoOriginal, pesoFinal }.
 * Si la foto ya estaba liviana, devuelve la original sin tocarla.
 */
export async function optimizarImagen(archivo) {
  if (!archivo.type.startsWith('image/')) {
    throw new Error(`"${archivo.name}" no es una imagen.`)
  }
  if (SIN_TOCAR.includes(archivo.type)) {
    return { archivo, pesoOriginal: archivo.size, pesoFinal: archivo.size }
  }

  const imagen = await cargarImagen(archivo)
  const anchoOriginal = imagen.width
  const altoOriginal = imagen.height
  if (!anchoOriginal || !altoOriginal) {
    return { archivo, pesoOriginal: archivo.size, pesoFinal: archivo.size }
  }

  // Solo achicamos: nunca agrandamos una foto pequeña.
  const escala = Math.min(1, LADO_MAXIMO / Math.max(anchoOriginal, altoOriginal))
  const ancho = Math.max(1, Math.round(anchoOriginal * escala))
  const alto = Math.max(1, Math.round(altoOriginal * escala))

  const tipo = soportaWebP() ? 'image/webp' : 'image/jpeg'

  const lienzo = document.createElement('canvas')
  lienzo.width = ancho
  lienzo.height = alto
  const ctx = lienzo.getContext('2d')
  // El JPG no admite transparencia: pintamos fondo blanco para que no salga negro.
  if (tipo === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, ancho, alto)
  }
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(imagen, 0, 0, ancho, alto)
  if (typeof imagen.close === 'function') imagen.close()

  const blob = await new Promise((resolver) => lienzo.toBlob(resolver, tipo, CALIDAD))

  // Si el resultado no pesa menos, nos quedamos con la foto original.
  if (!blob || blob.size >= archivo.size) {
    return { archivo, pesoOriginal: archivo.size, pesoFinal: archivo.size }
  }

  const extension = tipo === 'image/webp' ? 'webp' : 'jpg'
  const nombre = archivo.name.replace(/\.[^.]+$/, '') + '.' + extension
  const optimizada = new File([blob], nombre, { type: tipo })

  return { archivo: optimizada, pesoOriginal: archivo.size, pesoFinal: optimizada.size }
}
