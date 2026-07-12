'use client'

import { useState, useEffect } from 'react'
import { formatearPrecio, enlaceWhatsApp } from '@/lib/utils'
import { IconoPrenda, IconoWhatsApp } from '@/components/Iconos'

export default function DetalleProducto({ producto }) {
  const imagenes = producto.images && producto.images.length > 0 ? producto.images : []
  const [activa, setActiva] = useState(0)
  const [urlActual, setUrlActual] = useState('')

  useEffect(() => {
    // Enlace directo al producto (sirve tanto en el modal como en su página propia).
    setUrlActual(`${window.location.origin}/producto/${producto.id}`)
  }, [producto.id])

  return (
    <div className="detalle">
      {/* Galería */}
      <div>
        <div className="galeria-principal">
          {imagenes.length > 0 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={imagenes[activa]} alt={producto.name} />
          ) : (
            <div className="tarjeta-sin-foto">
              <IconoPrenda size={64} />
            </div>
          )}
        </div>
        {imagenes.length > 1 && (
          <div className="galeria-miniaturas">
            {imagenes.map((img, i) => (
              <button
                key={i}
                className={`miniatura ${i === activa ? 'activa' : ''}`}
                onClick={() => setActiva(i)}
                aria-label={`Ver foto ${i + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={`${producto.name} ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Información */}
      <div className="detalle-info">
        {producto.category && (
          <span className="detalle-categoria">{producto.category}</span>
        )}
        <h1>{producto.name}</h1>
        <div className="detalle-precio">
          {producto.price ? formatearPrecio(producto.price) : 'Consultar precio'}
        </div>

        {producto.description && (
          <p className="detalle-descripcion">{producto.description}</p>
        )}

        {producto.sizes && producto.sizes.length > 0 && (
          <>
            <div className="opciones-titulo">Tallas disponibles</div>
            <div className="opciones">
              {producto.sizes.map((t) => (
                <span key={t} className="opcion">
                  {t}
                </span>
              ))}
            </div>
          </>
        )}

        {producto.colors && producto.colors.length > 0 && (
          <>
            <div className="opciones-titulo">Colores</div>
            <div className="opciones">
              {producto.colors.map((c) => (
                <span key={c} className="opcion">
                  {c}
                </span>
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: 28 }}>
          <a
            href={enlaceWhatsApp(producto, urlActual)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa btn-bloque"
          >
            <IconoWhatsApp size={20} />
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
