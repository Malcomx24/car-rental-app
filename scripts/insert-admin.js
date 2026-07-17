const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to DB");
    const user = await prisma.user.create({
      data: {
        clerkId: "user_3GYswQAlku4zbEkEvbHvydCvkSW",
        email: "zeussan1973@gmail.com",
        firstName: "Anas",
        lastName: "Hargoug",
        role: "ADMIN",
        isEmailVerified: true,
        lastLoginAt: new Date(),
      },
    });
    console.log("Created admin:", user.email, user.role);
  } catch (e) {
    if (e.code === "P2002") {
      const user = await prisma.user.update({
        where: { clerkId: "user_3GYswQAlku4zbEkEvbHvydCvkSW" },
        data: { role: "ADMIN" },
      });
      console.log("Updated to admin:", user.email, user.role);
    } else {
      console.error("Error:", e.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
