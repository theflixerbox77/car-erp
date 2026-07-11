import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { StorefrontService } from './storefront.service';
import { RegisterCustomerDto, LoginCustomerDto } from './dto/customer-auth.dto';

export interface CustomerTokenPayload {
  sub: string; // customer_account id
  tenantId: string;
  type: 'storefront';
}

@Injectable()
export class StorefrontAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storefrontService: StorefrontService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private sign(payload: CustomerTokenPayload) {
    return this.jwt.signAsync(payload, { secret: this.config.get<string>('STOREFRONT_JWT_SECRET'), expiresIn: '30d' });
  }

  async register(slug: string, dto: RegisterCustomerDto) {
    const tenant = await this.storefrontService.resolveTenant(slug);
    const db = this.prisma.raw;

    const existing = await db.customerAccount.findUnique({ where: { tenantId_email: { tenantId: tenant.id, email: dto.email.toLowerCase() } } });
    if (existing) throw new ConflictException('An account with that email already exists');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const account = await db.customerAccount.create({
      data: { tenantId: tenant.id, email: dto.email.toLowerCase(), passwordHash, fullName: dto.fullName, phone: dto.phone },
    });

    const accessToken = await this.sign({ sub: account.id, tenantId: tenant.id, type: 'storefront' });
    return { accessToken, account: { id: account.id, fullName: account.fullName, email: account.email } };
  }

  async login(slug: string, dto: LoginCustomerDto) {
    const tenant = await this.storefrontService.resolveTenant(slug);
    const account = await this.prisma.raw.customerAccount.findUnique({ where: { tenantId_email: { tenantId: tenant.id, email: dto.email.toLowerCase() } } });
    if (!account) throw new UnauthorizedException('Invalid email or password');

    const matches = await bcrypt.compare(dto.password, account.passwordHash);
    if (!matches) throw new UnauthorizedException('Invalid email or password');

    const accessToken = await this.sign({ sub: account.id, tenantId: tenant.id, type: 'storefront' });
    return { accessToken, account: { id: account.id, fullName: account.fullName, email: account.email } };
  }
}
