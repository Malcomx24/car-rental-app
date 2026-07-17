import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({ orderBy: { createdAt: "asc" } });
  if (!user) {
    console.log("No users found. Sign up at /sign-up first, then run this again.");
    return;
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "ADMIN" },
  });
  console.log(`Done! ${user.email} is now an ADMIN.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
