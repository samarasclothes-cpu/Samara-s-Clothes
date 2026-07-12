import Link from 'next/link'
import { config } from '@/lib/config'
import { enlaceWhatsAppGeneral } from '@/lib/utils'
import { IconoWhatsApp } from '@/components/Iconos'

export default function Cabecera() {
  return (
    <header className="cabecera">
      <div className="cabecera-inner">
        <Link href="/" className="marca">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt={config.nombreTienda} />
          <span className="marca-texto">
            <strong>{config.nombreTienda}</strong>
            <span>{config.eslogan}</span>
          </span>
        </Link>
        <div className="cabecera-acciones">
          <Link href="/#informacion" className="btn btn-claro cabecera-info">
            Información
          </Link>
          <a
            href={enlaceWhatsAppGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-wa"
          >
            <IconoWhatsApp size={18} />
            <span className="solo-grande">Escríbenos</span>
          </a>
        </div>
      </div>
    </header>
  )
}
