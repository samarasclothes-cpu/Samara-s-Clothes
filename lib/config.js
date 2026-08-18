// ═══════════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE TU TIENDA
//  Este es el único archivo que necesitas editar a mano.
//  Cambia los valores entre comillas y guarda.
// ═══════════════════════════════════════════════════════════════

export const config = {
  // Nombre de tu marca (aparece en la cabecera y el título del sitio)
  nombreTienda: "Samara's Clothes",

  // Frase corta debajo del nombre
  eslogan: "Ropa y accesorios para mujer",

  // ── WhatsApp ──────────────────────────────────────────────
  // Tu número CON código de país, SIN "+", espacios ni guiones.
  // Ejemplo México: "5215512345678"  |  Colombia: "573001112233"
  // Venezuela: "584121234567"  |  Perú: "51987654321"
  whatsapp: "584127042242",

  // ── Moneda ────────────────────────────────────────────────
  // Símbolo que se muestra antes del precio
  simboloMoneda: "$",

  // ── Categorías del catálogo ───────────────────────────────
  // Estas son las opciones que aparecen como filtros y en el panel.
  // Agrega o quita las que quieras (respeta las comillas y las comas).
  categorias: [
    "Tops",
    "Vestidos",
    "Conjuntos",
    "Faldas",
    "Bragas",
    "Bodys",
    "Trajes de baño",
  ],

  // ── Límites de la tienda ──────────────────────────────────
  // Sirven para no llenar el espacio gratis de Supabase (1 GB).
  // Hoy tienes 203 productos ocupando 191 MB (fotos sin optimizar).
  // Con la optimización activada, 250 productos ocupan ~50 MB.

  // Cuántos productos puedes tener publicados como máximo.
  maxProductos: 250,

  // Cuántas fotos puede tener cada producto.
  maxFotosPorProducto: 5,

  // ── Optimización de fotos ─────────────────────────────────
  // Las fotos se achican y comprimen solas en el navegador antes
  // de subirlas. Una foto de celular de 4 MB queda en ~200 KB.
  imagenes: {
    // Lado más largo de la foto, en píxeles. Más alto = más nítido y más pesado.
    // 1400 se ve perfecto en el catálogo y en pantallas grandes.
    ladoMaximo: 1400,

    // Calidad de 0 a 1. Baja este número si quieres fotos aún más livianas.
    //   0.90 = casi idéntica al original   |   0.82 = recomendado (no se nota)
    //   0.70 = liviana, se nota un poco    |   0.60 = se nota bastante
    calidad: 0.82,
  },

  // ── Redes sociales (opcional) ─────────────────────────────
  // Deja "" (vacío) para ocultar el ícono.
  instagram: "", // ejemplo: "https://instagram.com/samarasclothes"
  tiktok: "",    // ejemplo: "https://tiktok.com/@samarasclothes"
}
