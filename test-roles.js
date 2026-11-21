const { prisma } = require('./desktop/db.js');
async function test() {
  const modules = await prisma.module.findMany();
  console.log("Modules:", modules.map(m => m.name));
}
test().catch(e => console.error(e)).finally(async () => { await prisma.$disconnect(); });
