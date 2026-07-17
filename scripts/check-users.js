const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  const users = await prisma.user.findMany({ take: 5, select: { id: true, email: true, role: true, clerkId: true } });
  console.log(JSON.stringify(users, null, 2));
  await prisma.$disconnect();
})();
