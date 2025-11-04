import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RolePermission } from 'src/shared/entities/role-permission.entity';
import { Permission } from 'src/shared/entities/permission.entity';
import { Role } from 'src/shared/entities/role.entity';

export default class createRolePermissionsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const repo = dataSource.getRepository(RolePermission);
    const tablePath = repo.metadata.tablePath;

    await dataSource.query(`TRUNCATE TABLE ${tablePath} CASCADE`);

    const permissionRepo = dataSource.getRepository(Permission);
    const roleRepo = dataSource.getRepository(Role);

    const permissions = await permissionRepo.find();
    const roles = await roleRepo.find();

    const permissionBySlug = new Map(
      permissions.map((permission) => [permission.slug, permission]),
    );
    const roleByName = new Map(roles.map((role) => [role.name, role]));

    const assignments: { role: string; permissions: string[] }[] = [
      {
        role: 'System Administrator',
        permissions: [
          'manage_users',
          'manage_roles',
          'view_patients',
          'edit_patients',
          'view_documents',
          'manage_documents',
          'view_audit_logs',
          'send_notifications',
        ],
      },
      {
        role: 'Clinician',
        permissions: [
          'view_patients',
          'edit_patients',
          'view_documents',
          'manage_documents',
        ],
      },
      {
        role: 'Support Staff',
        permissions: ['view_patients', 'view_documents', 'send_notifications'],
      },
    ];

    const rolePermissions: RolePermission[] = assignments.flatMap(
      ({ role, permissions: rolePermissions }) => {
        const roleEntity = roleByName.get(role);

        if (!roleEntity) {
          throw new Error(`Role with name "${role}" not found.`);
        }

        return rolePermissions.map((slug) => {
          const permission = permissionBySlug.get(slug);

          if (!permission) {
            throw new Error(`Permission with slug "${slug}" not found.`);
          }

          return {
            roleId: roleEntity.id,
            permissionId: permission.id,
          };
        });
      },
    );

    await repo.insert(rolePermissions);
  }
}
