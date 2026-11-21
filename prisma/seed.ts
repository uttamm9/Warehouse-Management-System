import { PrismaClient } from '../desktop/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ROLES = ['ADMIN', 'MANAGER', 'STAFF'];
const MODULES = ['Dashboard', 'Inventory', 'Racks', 'Scanner', 'Reports', 'Billing', 'Users', 'Admin'];

async function main() {
  console.log('Clearing old data...');
  await prisma.permission.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('Seeding Roles...');
  const roleCache: Record<string, string> = {};
  for (const r of ROLES) {
    const role = await prisma.role.create({
      data: { name: r }
    });
    roleCache[r] = role.id;
  }

  console.log('Seeding Modules...');
  const moduleCache: Record<string, string> = {};
  for (const m of MODULES) {
    const mod = await prisma.module.create({
      data: { name: m }
    });
    moduleCache[m] = mod.id;
  }

  console.log('Seeding Categories...');
  const CATEGORIES = {
    'Mechanical': ['Gears', 'Bearings', 'Fasteners'],
    'Electrical': ['Cables', 'Motors', 'Switches'],
    'Electronic': ['Sensors', 'Controllers', 'Relays'],
    'Hydraulic': ['Pumps', 'Valves', 'Hoses'],
    'Pneumatic': ['Actuators', 'Compressors', 'Fittings']
  };

  for (const [catName, subCats] of Object.entries(CATEGORIES)) {
    const category = await prisma.category.create({
      data: { name: catName }
    });
    for (const subName of subCats) {
      await prisma.subCategory.create({
        data: { name: subName, categoryId: category.id }
      });
    }
  }

  console.log('Seeding Permissions...');
  for (const r of ROLES) {
    for (const m of MODULES) {
      const isDashboard = m === 'Dashboard';
      const roleId = roleCache[r];
      const moduleId = moduleCache[m];

      let permissions = { canView: false, canCreate: false, canEdit: false, canDelete: false };

      if (r === 'ADMIN') {
        permissions = { canView: true, canCreate: true, canEdit: true, canDelete: true };
      } else if (r === 'MANAGER') {
        if (['Dashboard', 'Inventory', 'Racks'].includes(m)) {
          permissions = { canView: true, canCreate: true, canEdit: true, canDelete: false };
        } else if (['Reports', 'Scanner'].includes(m)) {
          permissions = { canView: true, canCreate: false, canEdit: false, canDelete: false };
        }
      } else if (r === 'STAFF') {
        if (['Dashboard', 'Inventory', 'Scanner'].includes(m)) {
          permissions = { canView: true, canCreate: true, canEdit: false, canDelete: false };
        }
      }

      // Ensure everyone can see Dashboard
      if (isDashboard) {
         permissions.canView = true;
      }

      await prisma.permission.create({
        data: {
          roleId,
          moduleId,
          ...permissions
        }
      });
    }
  }

  console.log('Seeding Users...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@warehouse.com',
      password: hashedPassword,
      roleId: roleCache['ADMIN']
    }
  });

  await prisma.user.create({
    data: {
      name: 'Test Manager',
      email: 'manager@warehouse.com',
      password: hashedPassword,
      roleId: roleCache['MANAGER']
    }
  });

  await prisma.user.create({
    data: {
      name: 'Test Staff',
      email: 'staff@warehouse.com',
      password: hashedPassword,
      roleId: roleCache['STAFF']
    }
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
