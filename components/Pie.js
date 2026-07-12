import Link from 'next/link'
import { config } from '@/lib/config'

export default function Pie() {
  const anio = 2026
  return (
    <footer className="pie">
      <strong>{config.nombreTienda}</strong>
      <div>{config.eslogan}</div>
      <div className="pie-contacto">
        <span>Lun a Sáb · 8:30 AM – 10:00 PM</span>
        <span>(0412) 704-2242 · Guarenas, Nueva Casarapa</span>
      </div>
      <div className="pie-redes">
        <Link href="/#catalogo">Catálogo</Link>
        <Link href="/#informacion">Información</Link>
        {config.instagram && (
          <a href={config.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        )}
        {config.tiktok && (
          <a href={config.tiktok} target="_blank" rel="noopener noreferrer">
            TikTok
          </a>
        )}
      </div>
      <small>
        © {anio} {config.nombreTienda}. Todos los derechos reservados.
      </small>
    </footer>
  )
}
