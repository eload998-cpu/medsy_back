import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Patient } from './patient.entity';
import { Encounter } from './encounter.entity';
import { Status } from './status.entity';
import { User } from './user.entity';

export enum DocType {
  ULTRASOUND = 'ultrasound',
  EXAM = 'exam',
  TREATMENT = 'treatment',
  NOTE = 'note',
  OTHER = 'other',
}

@Entity({ schema: 'app', name: 'documents' })
export class Document {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ type: 'uuid', name: 'tenant_id' })
  tenantId!: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant?: Tenant;

  @Column({ type: 'uuid', name: 'patient_id' })
  patientId!: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient?: Patient;

  @Column({ type: 'uuid', name: 'encounter_id', nullable: true })
  encounterId?: string | null;

  @ManyToOne(() => Encounter, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'encounter_id' })
  encounter?: Encounter | null;

  @Column({ type: 'enum', enum: DocType, enumName: 'doc_type_enum' })
  type!: string;

  @Column({ type: 'text', nullable: true })
  title?: string | null;

  @Column({ type: 'text' })
  mime!: string;

  @Column({ type: 'text', name: 'storage_key' })
  storageKey!: string;

  @Column({ type: 'bigint', name: 'size_bytes' })
  sizeBytes!: string;

  @Column({ type: 'text' })
  sha256!: string;

  @Column({ type: 'uuid', name: 'status_id', nullable: true })
  statusId?: string | null;

  @ManyToOne(() => Status, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'status_id' })
  status?: Status | null;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdById?: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  metadata!: Record<string, unknown>;
}
