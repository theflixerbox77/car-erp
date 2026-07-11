import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { CrmModule } from './crm/crm.module';
import { LeadsModule } from './leads/leads.module';
import { SalesModule } from './sales/sales.module';
import { ExpensesModule } from './expenses/expenses.module';
import { EmployeesModule } from './employees/employees.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TenantContextMiddleware } from './common/tenancy/tenant-context.middleware';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({}),
    PrismaModule,
    StorageModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    VehiclesModule,
    CrmModule,
    LeadsModule,
    SalesModule,
    ExpensesModule,
    EmployeesModule,
    SchedulingModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TenantContextMiddleware,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware).forRoutes('*');
  }
}
