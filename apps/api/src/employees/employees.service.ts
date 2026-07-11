import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { CreateLeaveRequestDto } from './dto/create-leave-request.dto';

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, dto: CreateEmployeeDto) {
    return this.prisma.client.employee.create({
      data: { ...dto, tenantId, hireDate: dto.hireDate ? new Date(dto.hireDate) : undefined },
      include: { role: true },
    });
  }

  findAll() {
    return this.prisma.client.employee.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const employee = await this.prisma.client.employee.findUnique({
      where: { id },
      include: {
        role: true,
        attendance: { orderBy: { date: 'desc' }, take: 30 },
        leaveRequests: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  private async requireEmployee(id: string) {
    const employee = await this.prisma.client.employee.findUnique({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async checkIn(tenantId: string, employeeId: string) {
    await this.requireEmployee(employeeId);
    const today = startOfToday();
    return this.prisma.client.attendance.upsert({
      where: { employeeId_date: { employeeId, date: today } },
      update: { checkInTime: new Date(), status: 'present' },
      create: { tenantId, employeeId, date: today, checkInTime: new Date(), status: 'present' },
    });
  }

  async checkOut(employeeId: string) {
    const today = startOfToday();
    const record = await this.prisma.client.attendance.findUnique({ where: { employeeId_date: { employeeId, date: today } } });
    if (!record) throw new BadRequestException('Employee has not checked in today');
    return this.prisma.client.attendance.update({ where: { id: record.id }, data: { checkOutTime: new Date() } });
  }

  listAttendance(employeeId?: string) {
    return this.prisma.client.attendance.findMany({
      where: employeeId ? { employeeId } : undefined,
      include: { employee: { select: { id: true, fullName: true } } },
      orderBy: { date: 'desc' },
      take: 200,
    });
  }

  async createLeaveRequest(tenantId: string, employeeId: string, dto: CreateLeaveRequestDto) {
    await this.requireEmployee(employeeId);
    return this.prisma.client.leaveRequest.create({
      data: {
        tenantId,
        employeeId,
        type: dto.type ?? 'other',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
      },
    });
  }

  listLeaveRequests(status?: string) {
    return this.prisma.client.leaveRequest.findMany({
      where: status ? { status } : undefined,
      include: { employee: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async reviewLeaveRequest(id: string, userId: string, status: 'approved' | 'rejected') {
    const request = await this.prisma.client.leaveRequest.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Leave request not found');
    if (request.status !== 'pending') throw new BadRequestException('This request has already been reviewed');
    return this.prisma.client.leaveRequest.update({ where: { id }, data: { status, approvedBy: userId } });
  }
}
