import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Status } from '../shared/entities/status.entity';
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'medsy',
  entities: [Status, 'src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['src/database/migrations/*.ts', 'dist/database/migrations/*.js'],
  synchronize: false,
});

export default dataSource;
