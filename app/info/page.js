import Cabecera from '@/components/Cabecera'
import Pie from '@/components/Pie'
import InfoSeccion from '@/components/InfoSeccion'
import BotonWhatsAppFlotante from '@/components/BotonWhatsAppFlotante'
import { config } from '@/lib/config'

export const metadata = {
  title: `Información · ${config.nombreTienda}`,
  description: 'Método de trabajo, pagos, entregas y contacto de Samara\'s Clothes.',
}

export default function PaginaInfo() {
  return (
    <div className="pagina">
      <Cabecera />
      <InfoSeccion />
      <Pie />
      <BotonWhatsAppFlotante />
    </div>
  )
}
