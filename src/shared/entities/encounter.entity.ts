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
import { Clinician } from './clinician.entity';
import { Status } from './status.entity';

@Entity({ schema: 'app', name: 'encounters' })
export class Encounter {
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

  @Column({ type: 'uuid', name: 'clinician_id', nullable: true })
  clinicianId?: string | null;

  @ManyToOne(() => Clinician, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clinician_id' })
  clinician?: Clinician | null;

  @Column({ type: 'timestamptz', name: 'occurred_at' })
  occurredAt!: Date;

  @Column({ type: 'enum', enumName: 'encounter_type_enum' })
  type!: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  notes!: Record<string, unknown>;

  @Column({ type: 'uuid', name: 'status_id', nullable: true })
  statusId?: string | null;

  @ManyToOne(() => Status, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'status_id' })
  status?: Status | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
