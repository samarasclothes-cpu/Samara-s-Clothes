import Link from 'next/link'
import { IconoLupa } from '@/components/Iconos'

export default function NoEncontrado() {
  return (
    <div className="pagina" style={{ justifyContent: 'center' }}>
      <div className="vacio">
        <div className="vacio-icono">
          <IconoLupa size={56} />
        </div>
        <h2>Página no encontrada</h2>
        <p>El producto o la página que buscas no existe.</p>
        <Link href="/" className="btn btn-rosa" style={{ marginTop: 12 }}>
          Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
