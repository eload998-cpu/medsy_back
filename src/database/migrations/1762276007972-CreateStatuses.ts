import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStatuses1762276007972 implements MigrationInterface {
  name = 'CreateStatuses1762276007972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" DROP CONSTRAINT "statuses_scope_code_key"`,
    );
    await queryRunner.query(`ALTER TABLE "app"."statuses" DROP COLUMN "scope"`);
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ADD "scope" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "app"."statuses" DROP COLUMN "code"`);
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ADD "code" character varying(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "app"."statuses" DROP COLUMN "label"`);
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ADD "label" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "is_default" SET DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "created_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "created_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "updated_at" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "updated_at" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0eb1c78c302b17f072f06e8034" ON "app"."statuses" ("scope", "code") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "app"."IDX_0eb1c78c302b17f072f06e8034"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "updated_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "updated_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "created_at" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "created_at" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ALTER COLUMN "is_default" SET DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "app"."statuses" DROP COLUMN "label"`);
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ADD "label" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "app"."statuses" DROP COLUMN "code"`);
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ADD "code" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "app"."statuses" DROP COLUMN "scope"`);
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ADD "scope" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."statuses" ADD CONSTRAINT "statuses_scope_code_key" UNIQUE ("scope", "code")`,
    );
  }
}
