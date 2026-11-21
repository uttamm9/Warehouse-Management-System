const { PrismaClient } = require('./desktop/prisma');
const prisma = new PrismaClient();

async function main() {
    const moduleName = 'Scan Page Access';
    let mod = await prisma.module.findUnique({ where: { name: moduleName } });
    if (!mod) {
        mod = await prisma.module.create({ data: { name: moduleName } });
        console.log('Created module:', mod);

        // Add permissions for all roles
        const roles = await prisma.role.findMany();
        for (const role of roles) {
            await prisma.permission.create({
                data: {
                    roleId: role.id,
                    moduleId: mod.id,
                    canView: role.name === 'ADMIN',
                    canCreate: false,
                    canEdit: false,
                    canDelete: false
                }
            });
        }
        console.log('Added permissions for all roles');
    } else {
        console.log('Module already exists');
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
