import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Status } from '../shared/entities/status.entity';
import { Permission } from '../shared/entities/permission.entity';
import { Role } from '../shared/entities/role.entity';
import { RolePermission } from '../shared/entities/role-permission.entity';
import { Tenant } from '../shared/entities/tenant.entity';
import { User } from '../shared/entities/user.entity';
import { Patient } from '../shared/entities/patient.entity';
import { Clinician } from '../shared/entities/clinician.entity';
import { Consent } from '../shared/entities/consent.entity';
import { Encounter } from '../shared/entities/encounter.entity';
import { Document } from '../shared/entities/document.entity';
import { Notification } from '../shared/entities/notification.entity';
import { Share } from '../shared/entities/share.entity';
import { AuditLog } from '../shared/entities/audit-log.entity';
import { UserPermission } from '../shared/entities/user-permission.entity';
import { UserRole } from '../shared/entities/user-role.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'medsy',
  entities: [
    Status,
    Permission,
    Role,
    RolePermission,
    Tenant,
    User,
    Patient,
    Clinician,
    Consent,
    Encounter,
    Document,
    Notification,
    Share,
    AuditLog,
    UserPermission,
    UserRole,
  ],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});

export default dataSource;
