import { PrismaClient } from "../prisma/generated/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("Admin2024", 10);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@stylestore.com",
      password: hash,
      role: "admin",
    },
  });
  console.log("Admin oluşturuldu!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());