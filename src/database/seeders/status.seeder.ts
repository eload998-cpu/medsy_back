import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Status } from 'src/shared/entities/status.entity';

export default class createStatusesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Status);
    const tablePath = repo.metadata.tablePath;

    await dataSource.query(
      `TRUNCATE TABLE ${tablePath} RESTART IDENTITY CASCADE`,
    );

    const statuses: Partial<Status>[] = [
      {
        scope: 'consent',
        code: 'revoked',
        label: 'Revoked',
        is_default: false,
        is_active: true,
      },
      {
        scope: 'document',
        code: 'draft',
        label: 'Draft',
        is_default: true,
        is_active: true,
      },
      {
        scope: 'document',
        code: 'signed',
        label: 'Signed',
        is_default: false,
        is_active: true,
      },
      {
        scope: 'encounter',
        code: 'open',
        label: 'Open',
        is_default: true,
        is_active: true,
      },
      {
        scope: 'consent',
        code: 'valid',
        label: 'Valid',
        is_default: true,
        is_active: true,
      },
      {
        scope: 'user',
        code: 'active',
        label: 'Active',
        is_default: true,
        is_active: true,
      },
      {
        scope: 'document',
        code: 'archived',
        label: 'Archived',
        is_default: false,
        is_active: true,
      },
      {
        scope: 'user',
        code: 'inactive',
        label: 'Inactive',
        is_default: false,
        is_active: true,
      },
      {
        scope: 'encounter',
        code: 'closed',
        label: 'Closed',
        is_default: false,
        is_active: true,
      },
    ];

    await repo.insert(statuses);
  }
}
