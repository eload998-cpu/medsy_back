import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from 'src/shared/entities/role.entity';

export default class createRolesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Role);
    const tablePath = repo.metadata.tablePath;

    await dataSource.query(
      `TRUNCATE TABLE ${tablePath} RESTART IDENTITY CASCADE`,
    );

    const roles: Partial<Role>[] = [
      {
        tenantId: null,
        name: 'System Administrator',
        description: 'Full access to all tenant resources and settings.',
        isSystem: true,
      },
      {
        tenantId: null,
        name: 'Clinician',
        description: 'Manages patient encounters and related clinical data.',
        isSystem: false,
      },
      {
        tenantId: null,
        name: 'Support Staff',
        description: 'Provides operational assistance and communication.',
        isSystem: false,
      },
    ];

    await repo.insert(roles);
  }
}
