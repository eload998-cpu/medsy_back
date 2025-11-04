import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['slug'], { unique: true })
@Entity({ schema: 'app', name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;
}
