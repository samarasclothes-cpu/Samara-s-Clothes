// Sección de Información reutilizable (importante, entregas, contacto).
export default function InfoSeccion() {
  return (
    <section id="informacion" className="contenedor info-wrap">
      <h2 className="seccion-titulo">Información</h2>

      {/* Información importante */}
      <div className="info-card">
        <h2>Información importante</h2>
        <p>
          Estimada clientela, su comodidad es nuestra prioridad, por eso aclaramos este
          punto: <strong>somos fabricantes</strong> y nuestro método de trabajo es{' '}
          <strong>bajo pedido</strong>. Cada prenda se confecciona después de
          encargarla, por lo que necesitamos unos días para tenerla lista. Al solicitar
          nuestro servicio se debe indicar <strong>talla y color</strong> de la prenda.
        </p>
        <p>
          Recibimos <strong>pagos en dos partes</strong>: la mitad del pago del producto
          para apartar, y la otra parte el día de la entrega. Los precios no cambian si se
          paga en divisas.
        </p>
        <div className="info-destacado">
          No aceptamos pedidos de un día para otro: cada prenda se fabrica a la medida
          de tu encargo.
        </div>
        <div className="info-destacado">
          Los colores mostrados son solo de referencia: tenemos una amplia variedad de
          colores.
        </div>
      </div>

      {/* Entregas */}
      <div className="info-card">
        <h2>Entregas</h2>
        <p>
          El día de la entrega se acuerda con tiempo; si hay algún contratiempo se puede
          agendar para otro día. Las entregas se realizan los{' '}
          <strong>fines de semana</strong>. Delivery a partir de <strong>2$</strong>.
        </p>
        <div className="info-cols">
          <div>
            <h3>Entregas personales en Caracas</h3>
            <ul>
              <li>Plaza Venezuela</li>
            </ul>
          </div>
          <div>
            <h3>Entregas personales en Miranda</h3>
            <ul>
              <li>Nueva Casarapa — C.C. San Nicolás de Bari</li>
              <li>Guarenas — C.C. Miranda</li>
              <li>Guatire — C.C. Castillejo</li>
            </ul>
          </div>
        </div>
        <div className="info-destacado">Hacemos envíos a todo el país.</div>
      </div>

      {/* Contacto */}
      <div className="info-card">
        <h2>Contacto</h2>
        <ul className="info-contacto">
          <li>
            <strong>Horario:</strong> Lunes a Sábado de 8:30 AM a 10:00 PM
          </li>
          <li>
            <strong>Teléfono / WhatsApp:</strong> (0412) 704-2242
          </li>
          <li>
            <strong>Ubicación:</strong> Guarenas, Nueva Casarapa
          </li>
        </ul>
        <p className="info-nota">
          Todos nuestros precios están a tasa del Banco Central de Venezuela.
        </p>
      </div>
    </section>
  )
}
