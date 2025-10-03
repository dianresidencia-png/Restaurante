import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { redirect } from 'next/navigation'
import { SidebarProvider } from '@/components/templates/sidebar'
import { AppSidebar } from './app-sidebar'
import { Header } from './components/header-rol'
import type { UserRole } from '@/lib/utils/rol-style'

export default async function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  const userRole = session.user?.role as UserRole
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar userRole={userRole} />
        <main className="flex-1 overflow-y-auto">
          <Header/>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}