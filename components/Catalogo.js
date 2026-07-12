'use client'

import { useState, useMemo, useEffect } from 'react'
import { config } from '@/lib/config'
import { formatearPrecio } from '@/lib/utils'
import { IconoBolsa, IconoPrenda } from '@/components/Iconos'
import DetalleProducto from '@/components/DetalleProducto'

export default function Catalogo({ productos }) {
  const [categoria, setCategoria] = useState('Todos')
  const [productoActivo, setProductoActivo] = useState(null)

  // Solo mostramos filtros de categorías que realmente tienen productos.
  const categoriasConProductos = useMemo(() => {
    const usadas = new Set(productos.map((p) => p.category).filter(Boolean))
    return ['Todos', ...config.categorias.filter((c) => usadas.has(c))]
  }, [productos])

  const visibles = useMemo(() => {
    if (categoria === 'Todos') return productos
    return productos.filter((p) => p.category === categoria)
  }, [productos, categoria])

  // Cerrar el modal con la tecla Escape y bloquear el scroll del fondo.
  useEffect(() => {
    if (!productoActivo) return
    function onKey(e) {
      if (e.key === 'Escape') setProductoActivo(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [productoActivo])

  return (
    <section id="catalogo" className="contenedor">
      <h2 className="seccion-titulo">Catálogo</h2>

      {categoriasConProductos.length > 1 && (
        <div className="filtros">
          {categoriasConProductos.map((c) => (
            <button
              key={c}
              className={`chip ${categoria === c ? 'activo' : ''}`}
              onClick={() => setCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {visibles.length === 0 ? (
        <div className="vacio">
          <div className="vacio-icono">
            <IconoBolsa size={56} />
          </div>
          <h3>Aún no hay productos en esta categoría</h3>
          <p>¡Muy pronto agregaremos novedades!</p>
        </div>
      ) : (
        <div className="rejilla">
          {visibles.map((p) => (
            <button key={p.id} className="tarjeta" onClick={() => setProductoActivo(p)}>
              <div className="tarjeta-foto">
                {p.category && <span className="tarjeta-etiqueta">{p.category}</span>}
                {p.images && p.images.length > 0 ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.images[0]} alt={p.name} loading="lazy" />
                ) : (
                  <div className="tarjeta-sin-foto">
                    <IconoPrenda size={48} />
                  </div>
                )}
              </div>
              <div className="tarjeta-cuerpo">
                <h3>{p.name}</h3>
                {p.price ? (
                  <span className="tarjeta-precio">{formatearPrecio(p.price)}</span>
                ) : (
                  <span className="tarjeta-precio">Consultar</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal con el detalle del producto */}
      {productoActivo && (
        <div className="modal-fondo" onClick={() => setProductoActivo(null)}>
          <div className="modal-caja" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-cerrar"
              onClick={() => setProductoActivo(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <DetalleProducto producto={productoActivo} />
          </div>
        </div>
      )}
    </section>
  )
}
