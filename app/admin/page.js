import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminPanel from '@/components/AdminPanel'

export const dynamic = 'force-dynamic'

export default async function PaginaAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { data: productos } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminPanel productosIniciales={productos || []} emailAdmin={user.email} />
}
