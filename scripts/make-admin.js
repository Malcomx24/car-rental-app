const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
(async () => {
  const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!user) { console.log("No users found. Sign up first."); await prisma.$disconnect(); return; }
  await prisma.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  console.log("Done! " + user.email + " is now ADMIN.");
  await prisma.$disconnect();
})();
