'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { config } from '@/lib/config'
import { formatearPrecio } from '@/lib/utils'
import { optimizarImagen, formatearPeso } from '@/lib/imagen'
import { IconoPrenda, IconoImagen, IconoLapiz, IconoMas } from '@/components/Iconos'

const BUCKET = 'productos'
const MAX_PRODUCTOS = config.maxProductos || Infinity
const MAX_FOTOS = config.maxFotosPorProducto || Infinity

// Estado vacío de un producto nuevo.
const productoVacio = {
  id: null,
  name: '',
  description: '',
  price: '',
  category: config.categorias[0] || '',
  sizesRaw: '',
  colorsRaw: '',
  images: [],
  disponible: true,
}

// Extrae la ruta interna de storage a partir de una URL pública.
function rutaDesdeUrl(url) {
  const marca = `/${BUCKET}/`
  const i = url.indexOf(marca)
  return i === -1 ? null : url.substring(i + marca.length)
}

export default function AdminPanel({ productosIniciales, emailAdmin }) {
  const router = useRouter()
  const supabase = createClient()
  const inputFotos = useRef(null)

  const [productos, setProductos] = useState(productosIniciales)
  const [form, setForm] = useState(productoVacio)
  const [subiendo, setSubiendo] = useState(false)
  const [progreso, setProgreso] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [aviso, setAviso] = useState(null) // {tipo:'ok'|'error', texto}

  const editando = form.id !== null
  const fotosLibres = MAX_FOTOS - form.images.length
  const limiteAlcanzado = !editando && productos.length >= MAX_PRODUCTOS

  function mostrarAviso(tipo, texto) {
    setAviso({ tipo, texto })
    if (tipo === 'ok') setTimeout(() => setAviso(null), 3500)
  }

  function cambiar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }))
  }

  function nuevoProducto() {
    setForm(productoVacio)
    setAviso(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function editarProducto(p) {
    setForm({
      id: p.id,
      name: p.name || '',
      description: p.description || '',
      price: p.price ?? '',
      category: p.category || config.categorias[0] || '',
      sizesRaw: (p.sizes || []).join(', '),
      colorsRaw: (p.colors || []).join(', '),
      images: p.images || [],
      disponible: p.disponible ?? true,
    })
    setAviso(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Subir fotos a Supabase Storage (optimizándolas antes) ───
  async function subirFotos(e) {
    let archivos = Array.from(e.target.files || [])
    if (inputFotos.current) inputFotos.current.value = ''
    if (archivos.length === 0) return

    // Respetamos el máximo de fotos por producto.
    if (archivos.length > fotosLibres) {
      if (fotosLibres <= 0) {
        mostrarAviso(
          'error',
          `Este producto ya tiene el máximo de ${MAX_FOTOS} fotos. Quita alguna para agregar otra.`
        )
        return
      }
      mostrarAviso(
        'error',
        `Solo caben ${fotosLibres} foto(s) más en este producto (máximo ${MAX_FOTOS}). Se subirán las primeras.`
      )
      archivos = archivos.slice(0, fotosLibres)
    }

    setSubiendo(true)
    let pesoAntes = 0
    let pesoDespues = 0
    try {
      const nuevas = []
      for (let i = 0; i < archivos.length; i++) {
        setProgreso(`Optimizando foto ${i + 1} de ${archivos.length}…`)
        const { archivo, pesoOriginal, pesoFinal } = await optimizarImagen(archivos[i])
        pesoAntes += pesoOriginal
        pesoDespues += pesoFinal

        setProgreso(`Subiendo foto ${i + 1} de ${archivos.length}…`)
        const ext = archivo.name.split('.').pop()
        const nombre = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(nombre, archivo, {
            cacheControl: '3600',
            upsert: false,
            contentType: archivo.type,
          })
        if (error) throw error
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(nombre)
        nuevas.push(data.publicUrl)
      }
      setForm((f) => ({ ...f, images: [...f.images, ...nuevas] }))
      const ahorro = pesoAntes - pesoDespues
      mostrarAviso(
        'ok',
        ahorro > 0
          ? `${nuevas.length} foto(s) lista(s). Optimizadas de ${formatearPeso(pesoAntes)} a ${formatearPeso(pesoDespues)}.`
          : `${nuevas.length} foto(s) lista(s).`
      )
    } catch (err) {
      mostrarAviso('error', 'No se pudieron subir las fotos: ' + err.message)
    } finally {
      setSubiendo(false)
      setProgreso('')
    }
  }

  async function quitarFoto(url) {
    setForm((f) => ({ ...f, images: f.images.filter((u) => u !== url) }))
    const ruta = rutaDesdeUrl(url)
    if (ruta) await supabase.storage.from(BUCKET).remove([ruta])
  }

  // ── Guardar (crear o actualizar) ────────────────────────────
  async function guardar(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      mostrarAviso('error', 'El producto necesita un nombre.')
      return
    }
    if (limiteAlcanzado) {
      mostrarAviso(
        'error',
        `Llegaste al máximo de ${MAX_PRODUCTOS} productos. Elimina alguno de la lista de abajo para poder agregar otro.`
      )
      return
    }
    setGuardando(true)

    const datos = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price === '' ? null : Number(form.price),
      category: form.category,
      sizes: form.sizesRaw.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colorsRaw.split(',').map((s) => s.trim()).filter(Boolean),
      images: form.images,
      disponible: form.disponible,
    }

    try {
      if (editando) {
        const { data, error } = await supabase
          .from('productos')
          .update(datos)
          .eq('id', form.id)
          .select()
          .single()
        if (error) throw error
        setProductos((lista) => lista.map((p) => (p.id === data.id ? data : p)))
        mostrarAviso('ok', '¡Producto actualizado!')
      } else {
        const { data, error } = await supabase
          .from('productos')
          .insert(datos)
          .select()
          .single()
        if (error) throw error
        setProductos((lista) => [data, ...lista])
        mostrarAviso('ok', '¡Producto agregado!')
      }
      setForm(productoVacio)
      router.refresh()
    } catch (err) {
      mostrarAviso('error', 'No se pudo guardar: ' + err.message)
    } finally {
      setGuardando(false)
    }
  }

  // ── Eliminar ────────────────────────────────────────────────
  async function eliminar(p) {
    if (!confirm(`¿Seguro que quieres eliminar "${p.name}"? Esta acción no se puede deshacer.`)) {
      return
    }
    try {
      const { error } = await supabase.from('productos').delete().eq('id', p.id)
      if (error) throw error
      // Borra también las fotos del almacenamiento.
      const rutas = (p.images || []).map(rutaDesdeUrl).filter(Boolean)
      if (rutas.length > 0) await supabase.storage.from(BUCKET).remove(rutas)
      setProductos((lista) => lista.filter((x) => x.id !== p.id))
      if (form.id === p.id) setForm(productoVacio)
      mostrarAviso('ok', 'Producto eliminado.')
      router.refresh()
    } catch (err) {
      mostrarAviso('error', 'No se pudo eliminar: ' + err.message)
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div>
      <div className="admin-top">
        <div className="admin-top-inner">
          <h2>Panel · {config.nombreTienda}</h2>
          <div className="cabecera-acciones">
            <a href="/" target="_blank" className="btn btn-claro">
              Ver tienda
            </a>
            <button className="btn btn-fantasma" onClick={cerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="admin-main">
        {aviso && <div className={`aviso aviso-${aviso.tipo}`}>{aviso.texto}</div>}

        {/* Medidor de cuántos productos llevas */}
        <div className="medidor">
          <div className="medidor-texto">
            <span>Productos publicados</span>
            <strong>
              {productos.length} de {MAX_PRODUCTOS}
            </strong>
          </div>
          <div className="medidor-barra">
            <div
              className={`medidor-relleno ${limiteAlcanzado ? 'lleno' : ''}`}
              style={{ width: `${Math.min(100, (productos.length / MAX_PRODUCTOS) * 100)}%` }}
            />
          </div>
          {limiteAlcanzado && (
            <div className="medidor-nota">
              Llegaste al máximo. Elimina algún producto para poder agregar otro.
            </div>
          )}
        </div>

        {/* Formulario */}
        <div className="panel">
          <h3 className="panel-titulo">
            {editando ? <IconoLapiz size={20} /> : <IconoMas size={20} />}
            {editando ? 'Editar producto' : 'Agregar producto'}
          </h3>
          <form onSubmit={guardar}>
            <div className="campo">
              <label>Nombre del producto *</label>
              <input
                value={form.name}
                onChange={(e) => cambiar('name', e.target.value)}
                placeholder="Ej: Blusa floral manga larga"
                required
              />
            </div>

            <div className="fila">
              <div className="campo">
                <label>Precio</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={form.price}
                  onChange={(e) => cambiar('price', e.target.value)}
                  placeholder="Ej: 12500"
                />
              </div>
              <div className="campo">
                <label>Categoría</label>
                <select
                  value={form.category}
                  onChange={(e) => cambiar('category', e.target.value)}
                >
                  {config.categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="campo">
              <label>Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => cambiar('description', e.target.value)}
                placeholder="Material, detalles, medidas, etc."
              />
            </div>

            <div className="fila">
              <div className="campo">
                <label>Tallas</label>
                <input
                  value={form.sizesRaw}
                  onChange={(e) => cambiar('sizesRaw', e.target.value)}
                  placeholder="S, M, L, XL"
                />
                <div className="campo-ayuda">Sepáralas con comas</div>
              </div>
              <div className="campo">
                <label>Colores</label>
                <input
                  value={form.colorsRaw}
                  onChange={(e) => cambiar('colorsRaw', e.target.value)}
                  placeholder="Rosa, Negro, Blanco"
                />
                <div className="campo-ayuda">Sepáralos con comas</div>
              </div>
            </div>

            <div className="campo">
              <label>
                Fotos del producto ({form.images.length} de {MAX_FOTOS})
              </label>
              <div className="subir-fotos">
                {form.images.map((url) => (
                  <div className="foto-preview" key={url}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="foto" />
                    <button
                      type="button"
                      className="foto-quitar"
                      onClick={() => quitarFoto(url)}
                      aria-label="Quitar foto"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {fotosLibres > 0 && (
                  <label className={`dropzone ${subiendo ? 'ocupada' : ''}`}>
                    <IconoImagen size={26} />
                    {subiendo ? progreso || 'Subiendo…' : 'Agregar fotos'}
                    <input
                      ref={inputFotos}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={subirFotos}
                      style={{ display: 'none' }}
                      disabled={subiendo}
                    />
                  </label>
                )}
              </div>
              <div className="campo-ayuda">
                La primera foto será la portada. Se optimizan solas al subirlas, así
                que puedes elegirlas directo del celular sin achicarlas antes.
              </div>
            </div>

            <div className="campo">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={form.disponible}
                  onChange={(e) => cambiar('disponible', e.target.checked)}
                  style={{ width: 'auto' }}
                />
                Visible en la tienda (desmarca para ocultarlo sin borrarlo)
              </label>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                type="submit"
                className="btn btn-rosa"
                disabled={guardando || subiendo || limiteAlcanzado}
              >
                {guardando ? (
                  <>
                    <span className="spinner" />
                    Guardando…
                  </>
                ) : editando ? (
                  'Guardar cambios'
                ) : (
                  'Agregar producto'
                )}
              </button>
              {editando && (
                <button type="button" className="btn btn-claro" onClick={nuevoProducto}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista */}
        <div className="panel">
          <h3>
            Productos ({productos.length} de {MAX_PRODUCTOS})
          </h3>
          {productos.length === 0 ? (
            <p style={{ color: 'var(--texto-suave)' }}>
              Todavía no has agregado productos. ¡Usa el formulario de arriba!
            </p>
          ) : (
            <div className="admin-lista">
              {productos.map((p) => (
                <div className="admin-item" key={p.id}>
                  {p.images && p.images[0] ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img className="admin-item-foto" src={p.images[0]} alt={p.name} />
                  ) : (
                    <div className="admin-item-foto" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--rosa)' }}>
                      <IconoPrenda size={26} />
                    </div>
                  )}
                  <div className="admin-item-info">
                    <strong>{p.name}</strong>
                    <small>
                      {p.category} · {p.price ? formatearPrecio(p.price) : 'Sin precio'}
                      {!p.disponible && ' · (oculto)'}
                    </small>
                  </div>
                  <div className="admin-item-acciones">
                    <button className="btn btn-claro" onClick={() => editarProducto(p)}>
                      Editar
                    </button>
                    <button className="btn btn-peligro" onClick={() => eliminar(p)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
