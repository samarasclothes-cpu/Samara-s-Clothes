// ═══════════════════════════════════════════════════════════════
//  LIMPIAR FOTOS DE SUPABASE
//
//  Sirve para liberar espacio cuando el almacén de fotos se llena.
//  Ejecútalo con doble clic en  limpiar-fotos.bat
//
//  Modos:
//    (sin nada)     → SOLO INFORMA. No borra nada.
//    --huerfanas    → borra las fotos que ningún producto usa.
//    --todas        → borra TODAS las fotos y las quita de los productos.
// ═══════════════════════════════════════════════════════════════

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const RAIZ = path.join(__dirname, '..')
const BUCKET = 'productos'

// ── Leer configuración de .env.local ───────────────────────────
const rutaEnv = path.join(RAIZ, '.env.local')
if (!fs.existsSync(rutaEnv)) {
  console.error('No encuentro el archivo .env.local. Créalo copiando .env.example.')
  process.exit(1)
}
const env = fs.readFileSync(rutaEnv, 'utf8')
const URL = (env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/) || [])[1]?.trim()
const KEY = (env.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.*)/) || [])[1]?.trim()
if (!URL || !KEY) {
  console.error('Faltan datos en .env.local (la URL o la clave de Supabase).')
  process.exit(1)
}

const { createClient } = require(path.join(RAIZ, 'node_modules/@supabase/supabase-js'))
const supabase = createClient(URL, KEY, { auth: { persistSession: false } })

const modo = process.argv.includes('--todas')
  ? 'todas'
  : process.argv.includes('--huerfanas')
    ? 'huerfanas'
    : 'informar'

// ── Utilidades de consola ──────────────────────────────────────
function peso(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function preguntar(texto, ocultar = false) {
  return new Promise((resolver) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    if (!ocultar) {
      rl.question(texto, (r) => {
        rl.close()
        resolver(r.trim())
      })
      return
    }
    // Entrada de contraseña: no se muestra en pantalla.
    process.stdout.write(texto)
    const alEscribir = (char) => {
      if (['\n', '\r', ''].includes(char.toString())) process.stdin.removeListener('data', alEscribir)
      else process.stdout.write('*')
    }
    process.stdin.on('data', alEscribir)
    rl.question('', (r) => {
      process.stdin.removeListener('data', alEscribir)
      rl.close()
      process.stdout.write('\n')
      resolver(r.trim())
    })
  })
}

// ── Listar todo el bucket (de 100 en 100) ──────────────────────
async function listarArchivos() {
  const archivos = []
  let desde = 0
  for (;;) {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .list('', { limit: 100, offset: desde, sortBy: { column: 'name', order: 'asc' } })
    if (error) throw new Error('No pude leer el almacén de fotos: ' + error.message)
    if (!data || data.length === 0) break
    archivos.push(...data.filter((f) => f.id))
    if (data.length < 100) break
    desde += 100
  }
  return archivos
}

// Borra en tandas de 100 (es el máximo que acepta Supabase de una vez).
async function borrarEnTandas(nombres) {
  let borrados = 0
  for (let i = 0; i < nombres.length; i += 100) {
    const tanda = nombres.slice(i, i + 100)
    const { error } = await supabase.storage.from(BUCKET).remove(tanda)
    if (error) throw new Error('Error al borrar fotos: ' + error.message)
    borrados += tanda.length
    process.stdout.write(`\r  Borradas ${borrados} de ${nombres.length}…`)
  }
  process.stdout.write('\n')
  return borrados
}

async function main() {
  console.log('')
  console.log('══════════════════════════════════════════════')
  console.log("  Samara's Clothes · Limpieza de fotos")
  console.log('══════════════════════════════════════════════')
  console.log('  Proyecto:', URL)
  console.log('')

  // 1. Radiografía del almacén
  const archivos = await listarArchivos()
  const total = archivos.reduce((s, f) => s + (f.metadata?.size || 0), 0)

  const { data: productos, error } = await supabase.from('productos').select('id,name,images')
  if (error) throw new Error('No pude leer los productos: ' + error.message)

  const usadas = new Set()
  for (const p of productos) {
    for (const url of p.images || []) usadas.add(decodeURIComponent(url.split('/').pop().split('?')[0]))
  }

  const huerfanas = archivos.filter((f) => !usadas.has(f.name))
  const pesoHuerfanas = huerfanas.reduce((s, f) => s + (f.metadata?.size || 0), 0)

  console.log(`  Fotos guardadas:     ${archivos.length}  (${peso(total)})`)
  console.log(`  Productos:           ${productos.length}`)
  console.log(`  Fotos en uso:        ${archivos.length - huerfanas.length}`)
  console.log(`  Fotos SIN USAR:      ${huerfanas.length}  (${peso(pesoHuerfanas)})`)
  console.log('')

  if (modo === 'informar') {
    console.log('  Esto fue solo un informe: no se borró nada.')
    console.log('')
    console.log('  Para liberar espacio tienes dos opciones:')
    console.log('    1) Borrar solo las fotos sin usar  → limpiar-fotos.bat huerfanas')
    console.log('    2) Borrar TODAS las fotos          → limpiar-fotos.bat todas')
    console.log('')
    return
  }

  // 2. Para borrar hace falta iniciar sesión como administradora
  console.log('  Para borrar necesito tu usuario del panel.')
  const email = await preguntar('  Correo: ')
  const password = await preguntar('  Contraseña: ', true)
  const { error: errorLogin } = await supabase.auth.signInWithPassword({ email, password })
  if (errorLogin) {
    console.error('\n  Correo o contraseña incorrectos.')
    process.exit(1)
  }
  console.log('  Sesión iniciada.\n')

  if (modo === 'huerfanas') {
    if (huerfanas.length === 0) {
      console.log('  No hay fotos sin usar. Nada que borrar.')
      return
    }
    const ok = await preguntar(
      `  ¿Borrar ${huerfanas.length} fotos sin usar (${peso(pesoHuerfanas)})? [s/n]: `
    )
    if (ok.toLowerCase() !== 's') return console.log('  Cancelado.')
    await borrarEnTandas(huerfanas.map((f) => f.name))
    console.log(`\n  Listo. Liberaste ${peso(pesoHuerfanas)}.`)
    return
  }

  // modo === 'todas'
  console.log('  ⚠  ATENCIÓN: esto borra las fotos de TODOS los productos.')
  console.log('     Los productos NO se borran, pero se quedan sin imagen')
  console.log('     y tendrás que volver a subirlas. No se puede deshacer.')
  console.log('')
  const confirmacion = await preguntar('  Escribe  BORRAR TODO  para continuar: ')
  if (confirmacion !== 'BORRAR TODO') return console.log('  Cancelado. No se borró nada.')

  if (archivos.length > 0) {
    await borrarEnTandas(archivos.map((f) => f.name))
  }

  // Quitamos las URLs rotas de los productos.
  const conFotos = productos.filter((p) => (p.images || []).length > 0)
  for (const p of conFotos) {
    const { error: e } = await supabase.from('productos').update({ images: [] }).eq('id', p.id)
    if (e) console.error(`  No pude actualizar "${p.name}": ${e.message}`)
  }

  console.log(`\n  Listo. Borradas ${archivos.length} fotos (${peso(total)}).`)
  console.log(`  ${conFotos.length} producto(s) quedaron sin foto.`)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('\n  ERROR:', e.message)
    process.exit(1)
  })
