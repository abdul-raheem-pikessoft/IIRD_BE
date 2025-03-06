import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';
import { INestApplicationContext } from '@nestjs/common';

async function runSeeder(): Promise<void> {
  const appContext: INestApplicationContext = await NestFactory.createApplicationContext(SeederModule);
  const seeder: SeederService = appContext.get(SeederService);

  await seeder.addRoles();
  await seeder.addPermissions();
  await seeder.addUsers();
  await seeder.assignPermissionsToRoles();

  console.log('seeder endpoint...');
}

runSeeder()
  .then(() => process.exit(0))
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  });
