// seed-users.js
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Creando usuarios de ejemplo...')
  
  const hashedPassword = await bcrypt.hash('Password123!', 12)
  
  const users = await prisma.user.createMany({
    
    data: [
      {
        email: 'cliente@ejemplo.com',
        name: 'Cliente Demo',
        password: hashedPassword,
        role: 'CLIENTE'
      },
      {
        email: 'mesero@restaurante.com',
        name: 'Mesero Demo', 
        password: hashedPassword,
        role: 'MESERO'
      },
      {
        email: 'chef@restaurante.com',
        name: 'Chef Demo',
        password: hashedPassword,
        role: 'CHEF'
      },
      {
        email: 'supervisor@restaurante.com',
        name: 'Supervisor Demo',
        password: hashedPassword,
        role: 'SUPERVISOR'
      },
      {
        email: 'gerente@restaurante.com',
        name: 'Gerente Demo',
        password: hashedPassword,
        role: 'ADMIN_LOCAL'
      },
      {
        email: 'superadmin@sistema.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN'
      }
    ]
  })

  console.log('✅', users.count, 'usuarios creados exitosamente!')
  console.log('🔑 Contraseña para todos: Password123!')
  
  // Mostrar lista de usuarios creados
  const userList = await prisma.user.findMany({
    select: { email: true, role: true, name: true }
  })
  
  console.log('\n📋 Lista de usuarios:')
  userList.forEach(user => {
    console.log(`   👤 ${user.role}: ${user.email} (${user.name})`)
  })
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })