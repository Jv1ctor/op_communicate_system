import prisma from "../database/prisma"

export const resetNotifications = async () => {
  await prisma.notification_product.deleteMany({ where: { products: { NOT: { status: "andamento"} }}})
}