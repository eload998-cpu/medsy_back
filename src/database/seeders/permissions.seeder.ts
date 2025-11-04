import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Permission } from 'src/shared/entities/permission.entity';

export default class createPermissionsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(Permission);
    const tablePath = repo.metadata.tablePath;

    await dataSource.query(
      `TRUNCATE TABLE ${tablePath} RESTART IDENTITY CASCADE`,
    );

    const permissions: Partial<Permission>[] = [
      {
        slug: 'manage_users',
        description: 'Create, update, and deactivate tenant users.',
      },
      {
        slug: 'manage_roles',
        description: 'Assign permissions and manage tenant roles.',
      },
      {
        slug: 'view_patients',
        description: 'View patient demographics and clinical data.',
      },
      {
        slug: 'edit_patients',
        description: 'Modify patient demographics and clinical data.',
      },
      {
        slug: 'view_documents',
        description: 'Access clinical documents that belong to the tenant.',
      },
      {
        slug: 'manage_documents',
        description: 'Create, update, and archive clinical documents.',
      },
      {
        slug: 'view_audit_logs',
        description: 'Review audit log entries for compliance purposes.',
      },
      {
        slug: 'send_notifications',
        description: 'Trigger outbound notifications to users.',
      },
    ];

    await repo.insert(permissions);
  }
}
