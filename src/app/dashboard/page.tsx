import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  const rolePath = getDashboardPath(session.user?.role)
  redirect(`/dashboard/${rolePath}`)
}

function getDashboardPath(role?: string) {
  switch (role) {
    case 'CLIENTE': return 'cliente'
    case 'MESERO': return 'mesero'
    case 'CHEF': return 'chef'
    case 'SUPERVISOR': return 'supervisor'
    case 'ADMIN_LOCAL': return 'admin-local'
    case 'SUPER_ADMIN': return 'super-admin'
    default: return 'cliente'
  }
}