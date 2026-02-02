const { PrismaClient, Role } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const hashedPassword = await hash("senha123", 10); //LEMBRAR DE MUDAR A SENHA

  const pastor = await prisma.user.create({
    data: {
      email: "pastor@ibmd.com", //LEMBRAR DE MUDAR AS CREDENCIAIS
      nome: "Pastor Alexandro",
      cpf: "12345678900",
      cargo: Role.PASTOR,
      senha: hashedPassword,
    },
  });

  console.log("Usuário Pastor criado:", pastor);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
