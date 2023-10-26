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
    const adminRole = await prisma.userAdm.upsert({
      where: { fk_id_user_adm: admin.id },
      update: {},
      create: {
        fk_id_user_adm: admin.id,
      },
    })
    console.log(
      "---------USER ADMIN---------\n",
      "USUARIO CRIADO:\n",
      admin,
      "\nPERMISSÕES:\n",
      adminRole,
    )
  }

  const reactors = await prisma.$transaction([
    prisma.reactors.deleteMany({ where: { fk_user_adm: admin.id } }),
    prisma.reactors.createMany({
      data: [
        { name_reactor: "R10", fk_user_adm: admin.id },
        { name_reactor: "R11", fk_user_adm: admin.id },
        { name_reactor: "R12", fk_user_adm: admin.id },
        { name_reactor: "R13", fk_user_adm: admin.id },
        { name_reactor: "R15", fk_user_adm: admin.id },
        { name_reactor: "R20", fk_user_adm: admin.id },
        { name_reactor: "R21", fk_user_adm: admin.id },
      ],
    }),
  ])

  if (reactors) {
    console.log(
      "\n---------REACTORS---------\n",
      "DELETADOS:",
      reactors[0],
      "CRIADOS:",
      reactors[1],
    )
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
