const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("test123", 10);

  await prisma.user.create({
    data: {
      name: "div",
      email: "werr@gmail.com",
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log("✅ Admin created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
