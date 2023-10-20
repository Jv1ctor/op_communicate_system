import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
const prisma = new PrismaClient()

const main = async () => {
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)
  const hashPassword = await bcrypt.hash("1234admin", salt)

  const admin = await prisma.users.upsert({
    where: { first_name: "teste", last_name: "admin" },
    update: {},
    create: {
      first_name: "teste",
      last_name: "admin",
      password: hashPassword,
    },
  })

  if (admin) {
    const adminRole = await prisma.userAdm.create({
      data: {
        fk_id_user_adm: admin.id,
      },
    })
    console.log(admin, adminRole)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
