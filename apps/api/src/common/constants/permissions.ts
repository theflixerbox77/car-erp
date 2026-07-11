/**
 * Central permission catalog. Every module's guards reference codes from here via
 * @Permissions(...). Extend this list (never repurpose an existing code) as new
 * modules land in M2+.
 */
export const PERMISSION_CATALOG: { code: string; module: string }[] = [
  { code: 'inventory.view', module: 'inventory' },
  { code: 'inventory.create', module: 'inventory' },
  { code: 'inventory.update', module: 'inventory' },
  { code: 'inventory.delete', module: 'inventory' },

  { code: 'sales.view', module: 'sales' },
  { code: 'sales.create', module: 'sales' },
  { code: 'sales.update', module: 'sales' },

  { code: 'crm.view', module: 'crm' },
  { code: 'crm.manage', module: 'crm' },

  { code: 'expenses.view', module: 'expenses' },
  { code: 'expenses.create', module: 'expenses' },
  { code: 'expenses.approve', module: 'expenses' },

  { code: 'employees.view', module: 'employees' },
  { code: 'employees.manage', module: 'employees' },

  { code: 'reports.view', module: 'reports' },

  { code: 'settings.manage', module: 'settings' },
  { code: 'team.manage', module: 'settings' },
];

export const SYSTEM_ROLE_TEMPLATES: { name: string; permissions: string[] }[] =
  [
    {
      name: 'Owner',
      permissions: PERMISSION_CATALOG.map((p) => p.code),
    },
    {
      name: 'Manager',
      permissions: [
        'inventory.view',
        'inventory.create',
        'inventory.update',
        'sales.view',
        'sales.create',
        'sales.update',
        'crm.view',
        'crm.manage',
        'expenses.view',
        'expenses.create',
        'expenses.approve',
        'employees.view',
        'employees.manage',
        'reports.view',
      ],
    },
    {
      name: 'Sales',
      permissions: [
        'inventory.view',
        'sales.view',
        'sales.create',
        'sales.update',
        'crm.view',
        'crm.manage',
      ],
    },
    {
      name: 'Accountant',
      permissions: [
        'expenses.view',
        'expenses.create',
        'expenses.approve',
        'reports.view',
        'sales.view',
      ],
    },
    {
      name: 'Mechanic',
      permissions: ['inventory.view', 'inventory.update'],
    },
    {
      name: 'Driver',
      permissions: ['inventory.view'],
    },
    {
      name: 'Reception',
      permissions: ['inventory.view', 'crm.view', 'crm.manage'],
    },
  ];
