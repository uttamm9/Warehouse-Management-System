const { prisma } = require('./desktop/db.js');

const MODULE_NAMES = [
  'Dashboard',
  'Scan Barcode',
  'Warehouse Layout',
  'Rack Monitoring',
  'Inbound Inventory',
  'Outbound Inventory',
  'SKU Management',
  'Conveyor Control',
  'Reports',
  'Billing',
  'System Logs',
  'Settings',
  'Roles & Permissions',
  'User Management'
];

async function main() {
  console.log('Clearing old permissions and modules...');
  await prisma.permission.deleteMany();
  await prisma.module.deleteMany();

  console.log('Recreating system modules...');
  const moduleCache = {};
  for (const name of MODULE_NAMES) {
    const mod = await prisma.module.create({
      data: { name }
    });
    moduleCache[name] = mod.id;
  }
  console.log(`Recreated ${MODULE_NAMES.length} modules.`);

  console.log('Ensuring default roles exist...');
  const roleNames = ['ADMIN', 'MANAGER', 'STAFF'];
  const roleCache = {};
  for (const name of roleNames) {
    let role = await prisma.role.findUnique({ where: { name } });
    if (!role) {
      role = await prisma.role.create({ data: { name } });
      console.log(`Created missing role: ${name}`);
    } else {
      console.log(`Found existing role: ${name}`);
    }
    roleCache[name] = role.id;
  }

  console.log('Seeding default permissions for roles...');
  
  // ADMIN permissions
  for (const m of MODULE_NAMES) {
    await prisma.permission.create({
      data: {
        roleId: roleCache['ADMIN'],
        moduleId: moduleCache[m],
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true
      }
    });
  }
  console.log('Seeded ADMIN full permissions.');

  // MANAGER permissions
  const managerWriteModules = [
    'Dashboard',
    'Warehouse Layout',
    'Rack Monitoring',
    'Conveyor Control',
    'Inbound Inventory',
    'Outbound Inventory',
    'SKU Management'
  ];
  const managerReadModules = [
    'Scan Barcode',
    'Reports'
  ];

  for (const m of MODULE_NAMES) {
    let canView = false;
    let canCreate = false;
    let canEdit = false;
    let canDelete = false;

    if (managerWriteModules.includes(m)) {
      canView = true;
      canCreate = true;
      canEdit = true;
    } else if (managerReadModules.includes(m)) {
      canView = true;
    }

    await prisma.permission.create({
      data: {
        roleId: roleCache['MANAGER'],
        moduleId: moduleCache[m],
        canView,
        canCreate,
        canEdit,
        canDelete
      }
    });
  }
  console.log('Seeded MANAGER permissions.');

  // STAFF permissions
  const staffWriteModules = [
    'Dashboard',
    'Inbound Inventory',
    'Outbound Inventory',
    'SKU Management',
    'Scan Barcode'
  ];

  for (const m of MODULE_NAMES) {
    let canView = false;
    let canCreate = false;
    let canEdit = false;
    let canDelete = false;

    if (staffWriteModules.includes(m)) {
      canView = true;
      canCreate = true;
    }

    await prisma.permission.create({
      data: {
        roleId: roleCache['STAFF'],
        moduleId: moduleCache[m],
        canView,
        canCreate,
        canEdit,
        canDelete
      }
    });
  }
  console.log('Seeded STAFF permissions.');

  console.log('Default modules and permissions successfully restored!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
