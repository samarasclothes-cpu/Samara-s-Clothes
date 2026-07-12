import { createClient } from '@/lib/supabase/server'

// Trae todos los productos disponibles (para el catálogo público).
export async function obtenerProductos() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('disponible', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al obtener productos:', error.message)
    return []
  }
  return data || []
}

// Trae un producto por su id.
export async function obtenerProducto(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error al obtener producto:', error.message)
    return null
  }
  return data
}
