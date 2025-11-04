import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Status } from '../shared/entities/status.entity';
import { Permission } from '../shared/entities/permission.entity';
import { Role } from '../shared/entities/role.entity';
import { RolePermission } from '../shared/entities/role-permission.entity';
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'medsy',
  entities: [Status, Permission, Role, RolePermission],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});

export default dataSource;
