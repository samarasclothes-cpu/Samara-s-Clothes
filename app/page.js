import Cabecera from '@/components/Cabecera'
import Pie from '@/components/Pie'
import Catalogo from '@/components/Catalogo'
import InfoSeccion from '@/components/InfoSeccion'
import BotonWhatsAppFlotante from '@/components/BotonWhatsAppFlotante'
import { obtenerProductos } from '@/lib/products'
import { config } from '@/lib/config'
import { enlaceWhatsAppGeneral } from '@/lib/utils'
import { IconoCorazon, IconoWhatsApp } from '@/components/Iconos'

// Refresca el catálogo cada vez que se visita (no lo cachea).
export const dynamic = 'force-dynamic'

export default async function PaginaInicio() {
  const productos = await obtenerProductos()

  return (
    <div className="pagina">
      <Cabecera />
      <section className="hero">
        <div className="hero-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt={config.nombreTienda} className="hero-logo" />
          <h1>{config.nombreTienda}</h1>
          <p className="hero-sub">
            <span>{config.eslogan}</span>
            <IconoCorazon size={18} />
          </p>
          <p className="hero-desc">
            Descubre nuestras novedades y pídelas fácil, directo por WhatsApp.
          </p>
          <div className="hero-cta">
            <a href="#catalogo" className="btn btn-rosa">
              Ver catálogo
            </a>
            <a
              href={enlaceWhatsAppGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-wa"
            >
              <IconoWhatsApp size={18} />
              Escríbenos
            </a>
          </div>
        </div>
      </section>
      <InfoSeccion />
      <Catalogo productos={productos} />
      <Pie />
      <BotonWhatsAppFlotante />
    </div>
  )
}
