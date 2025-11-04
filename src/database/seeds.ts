import dataSource from './data-source';
import createStatusesSeeder from './seeders/status.seeder';
import { runSeeder } from 'typeorm-extension';

async function bootstrap() {
  await dataSource.initialize();

  try {
    await runSeeder(dataSource, createStatusesSeeder);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

bootstrap();
