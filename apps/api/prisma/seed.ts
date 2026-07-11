import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcryptjs';
import { PERMISSION_CATALOG } from '../src/common/constants/permissions';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const perm of PERMISSION_CATALOG) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { module: perm.module },
      create: perm,
    });
  }
  console.log(`Seeded ${PERMISSION_CATALOG.length} permissions.`);

  const platformAdminEmail = process.env.PLATFORM_ADMIN_EMAIL ?? 'admin@platform.local';
  const platformAdminPassword = process.env.PLATFORM_ADMIN_PASSWORD ?? 'ChangeMe123!';

  const existing = await prisma.user.findUnique({ where: { email: platformAdminEmail } });
  if (!existing) {
    const passwordHash = await bcrypt.hash(platformAdminPassword, 12);
    await prisma.user.create({
      data: {
        email: platformAdminEmail,
        passwordHash,
        fullName: 'Platform Admin',
        isPlatformAdmin: true,
        status: 'active',
      },
    });
    console.log(`Created platform admin: ${platformAdminEmail} / ${platformAdminPassword}`);
    console.log('!! Change this password after first login. !!');
  } else {
    console.log('Platform admin already exists, skipping.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
