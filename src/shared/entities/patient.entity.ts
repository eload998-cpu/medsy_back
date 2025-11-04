import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Entity({ schema: 'app', name: 'patients' })
@Index(['tenantId', 'code'], { unique: true })
export class Patient {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ type: 'text', nullable: true })
  code?: string | null;

  @Column({ type: 'text', name: 'first_name', nullable: true })
  firstName?: string | null;

  @Column({ type: 'text', name: 'last_name', nullable: true })
  lastName?: string | null;

  @Column({ type: 'enum', enumName: 'sex_enum', nullable: true })
  sex?: string | null;

  @Column({ type: 'date', name: 'birth_date', nullable: true })
  birthDate?: string | null;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  identifiers!: Record<string, unknown>;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  demographics!: Record<string, unknown>;

  @Column({ type: 'uuid', name: 'portal_user_id', nullable: true })
  portalUserId?: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'portal_user_id' })
  portalUser?: User | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
