import Link from 'next/link'
import { notFound } from 'next/navigation'
import Cabecera from '@/components/Cabecera'
import Pie from '@/components/Pie'
import DetalleProducto from '@/components/DetalleProducto'
import BotonWhatsAppFlotante from '@/components/BotonWhatsAppFlotante'
import { obtenerProducto } from '@/lib/products'
import { config } from '@/lib/config'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const producto = await obtenerProducto(params.id)
  if (!producto) return { title: `Producto · ${config.nombreTienda}` }
  return {
    title: `${producto.name} · ${config.nombreTienda}`,
    description: producto.description || config.eslogan,
  }
}

export default async function PaginaProducto({ params }) {
  const producto = await obtenerProducto(params.id)
  if (!producto) notFound()

  return (
    <div className="pagina">
      <Cabecera />
      <div className="contenedor">
        <Link href="/" className="volver">
          ← Volver al catálogo
        </Link>
        <DetalleProducto producto={producto} />
      </div>
      <Pie />
      <BotonWhatsAppFlotante />
    </div>
  )
}
