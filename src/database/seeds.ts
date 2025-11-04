import dataSource from './data-source';
import createStatusesSeeder from './seeders/status.seeder';
import createPermissionsSeeder from './seeders/permissions.seeder';
import createRolesSeeder from './seeders/roles.seeder';
import createRolePermissionsSeeder from './seeders/role-permissions.seeder';
import { runSeeder } from 'typeorm-extension';

async function bootstrap() {
  await dataSource.initialize();

  try {
    await runSeeder(dataSource, createStatusesSeeder);
    await runSeeder(dataSource, createPermissionsSeeder);
    await runSeeder(dataSource, createRolesSeeder);
    await runSeeder(dataSource, createRolePermissionsSeeder);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

void bootstrap();
