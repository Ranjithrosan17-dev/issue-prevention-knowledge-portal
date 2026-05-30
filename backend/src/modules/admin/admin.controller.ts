import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
  ) {}

  @Get('users')
  getUsers() { return this.usersService.findAll(); }

  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.usersService.update(id, { role });
  }

  @Get('audit-logs')
  @Roles(Role.ADMIN, Role.MANAGER)
  getAuditLogs() { return this.auditService.findAll(); }
}
