# 🌸 Samara's Clothes — Catálogo web

Catálogo de ropa y accesorios para mujer, con **panel de administración** para
agregar productos y **botón de WhatsApp** para recibir pedidos. Todo con
herramientas **gratuitas**.

- **Hosting:** Vercel (plan gratis)
- **Fotos + base de datos + login:** Supabase (plan gratis, 1 GB de fotos)
- **Tecnología:** Next.js + React

---

## 🚀 Puesta en marcha (sigue los pasos en orden)

### Paso 1 — Crear tu proyecto en Supabase (guarda las fotos y los productos)

1. Entra a **https://supabase.com** y crea una cuenta gratis (puedes usar tu Google).
2. Clic en **New project**. Ponle un nombre (ej. `samaras-clothes`), elige una
   contraseña para la base de datos (guárdala) y la región más cercana. Espera
   ~2 minutos a que se cree.
3. En el menú izquierdo entra a **SQL Editor → New query**.
4. Abre el archivo **`supabase-configuracion.sql`** de este proyecto, copia
   **todo** su contenido, pégalo en el editor y presiona **Run**.
   Esto crea la tabla de productos, el almacén de fotos y la seguridad.
5. Crea tu usuario de administrador: menú **Authentication → Users → Add user →
   Create new user**. Escribe tu **correo** y una **contraseña**, marca
   **Auto Confirm User** y guarda. (Con esos datos entrarás al panel).

### Paso 2 — Conectar el proyecto con Supabase

1. En Supabase ve a **Project Settings (⚙️) → API**.
2. Copia dos valores:
   - **Project URL**
   - **Publishable key** (también llamada `anon public`)
3. En la carpeta del proyecto, duplica el archivo **`.env.example`** y renómbralo
   a **`.env.local`**. Ábrelo y pega tus valores:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publica
   ```

### Paso 3 — Personalizar tu tienda

Abre **`lib/config.js`** y cambia:
- Tu **número de WhatsApp** (con código de país, sin `+` ni espacios).
- La **moneda** (`$`, etc.).
- Las **categorías** que quieras.

### Paso 4 — Probarlo en tu computadora

En una terminal, dentro de la carpeta del proyecto:

```bash
npm install      # solo la primera vez
npm run dev
```

Abre **http://localhost:3000** → verás el catálogo.
Abre **http://localhost:3000/admin** → inicia sesión con el correo y contraseña
del Paso 1.5 y empieza a **agregar productos y fotos**. 🎉

---

## ☁️ Subirlo a internet con Vercel (gratis)

1. Sube este proyecto a **GitHub** (crea un repositorio y sube la carpeta).
   > 💡 Si no sabes usar GitHub, puedes instalar **GitHub Desktop** (gratis) y
   > arrastrar la carpeta. El archivo `.env.local` **no** se sube (está protegido),
   > eso es correcto.
2. Entra a **https://vercel.com**, crea cuenta gratis y conéctala con GitHub.
3. Clic en **Add New → Project** y elige tu repositorio.
4. Antes de dar **Deploy**, abre **Environment Variables** y agrega las **dos**
   variables del Paso 2 (mismos nombres y valores de tu `.env.local`).
5. Clic en **Deploy**. En ~1 minuto tendrás tu tienda en una dirección
   `https://tu-tienda.vercel.app` 🌐

> Cada vez que agregues productos desde `/admin`, aparecen al instante en la web:
> no necesitas volver a publicar nada. Solo necesitas re-publicar si cambias el
> código o el archivo `config.js`.

---

## ❓ Preguntas frecuentes

**¿Cuánto cuesta?**
Nada. Vercel (Hobby) y Supabase (Free) son gratis. El plan gratis de Supabase da
**1 GB de fotos**, suficiente para cientos de productos si las optimizas.

**¿Cómo agrego productos?**
Entra a `tudominio.vercel.app/admin`, inicia sesión y usa el formulario. Puedes
subir varias fotos por producto, poner precio, tallas, colores y categoría.

**¿Tengo que achicar las fotos antes de subirlas?**
No. La web las optimiza sola: las achica a 1400 px y les baja un poco la calidad
justo antes de subirlas. Una foto de celular de 4 MB queda en ~200 KB sin que se
note. Puedes elegirlas directo de la galería del teléfono.

**¿Cuántos productos y fotos puedo tener?**
Por defecto **250 productos** y **5 fotos por producto**. Con la optimización
activada eso ocupa ~50 MB, muy lejos del límite de 1 GB de Supabase. Puedes
cambiar esos números en `lib/config.js` (`maxProductos` y `maxFotosPorProducto`),
junto con la calidad de las fotos (`imagenes.calidad`, de 0 a 1).

**Mi tienda dejó de funcionar de un día para otro.**
Lo más probable es que Supabase **pausara el proyecto por inactividad** (lo hace
en el plan gratis tras ~1 semana sin uso). No perdiste nada: entra a
https://supabase.com/dashboard y pulsa **Restore**. En un par de minutos vuelve
con todos los productos y fotos intactos. Ojo: si lo dejas pausado **90 días**,
ahí sí lo borran definitivamente.

**Se me llenó el espacio de fotos, ¿cómo lo libero?**
Doble clic en **`limpiar-fotos.bat`**. Primero te muestra un informe sin borrar
nada: cuántas fotos hay, cuánto ocupan y cuántas están **sin usar** (subidas y
luego descartadas). Después puedes:
- `limpiar-fotos.bat huerfanas` → borra solo las que ningún producto usa. **Seguro.**
- `limpiar-fotos.bat todas` → borra **todas** las fotos. Los productos se quedan
  sin imagen y hay que volver a subirlas. Te pide escribir `BORRAR TODO` para confirmar.

**¿Puedo cambiar los colores o el logo?**
El logo está en `public/logo.svg`. Los colores de la marca están arriba del
archivo `app/globals.css` (`--rosa` y `--rosa-claro`).

**Olvidé mi contraseña del panel.**
En Supabase → Authentication → Users, puedes editar tu usuario o crear uno nuevo.
