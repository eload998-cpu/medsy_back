import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUpdateTables1762281809442 implements MigrationInterface {
  name = 'CreateUpdateTables1762281809442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "app"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "citext"`);

    await queryRunner.query(
      `CREATE TABLE "app"."tenants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "settings" jsonb NOT NULL DEFAULT '{}'::jsonb, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "email" citext NOT NULL, "password_hash" text NOT NULL, "full_name" text NOT NULL, "phone" text, "is_active" boolean NOT NULL DEFAULT true, "last_login_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e9f4c2efab52114c4e99e28efb" ON "app"."users" ("tenant_id", "email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid, "name" character varying(255) NOT NULL, "description" text, "is_system" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c555146b304b5f51a7de6e18de" ON "app"."roles" ("tenant_id", "name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."user_roles" ("user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying(255) NOT NULL, "description" text, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d090ad82a0e97ce764c06c7b31" ON "app"."permissions" ("slug") `,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."user_permissions" ("user_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_a537c48b1f80e8626a71cb56589" PRIMARY KEY ("user_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."statuses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "scope" character varying(255) NOT NULL, "code" character varying(255) NOT NULL, "label" character varying(255) NOT NULL, "is_default" boolean NOT NULL DEFAULT true, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2fd3770acdb67736f1a3e3d5399" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_0eb1c78c302b17f072f06e8034" ON "app"."statuses" ("scope", "code") `,
    );
    await queryRunner.query(
      `CREATE TYPE "app"."sex_enum" AS ENUM('female', 'male', 'other', 'unknown')`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "code" text, "first_name" text, "last_name" text, "sex" "app"."sex_enum", "birth_date" date, "identifiers" jsonb NOT NULL DEFAULT '{}'::jsonb, "demographics" jsonb NOT NULL DEFAULT '{}'::jsonb, "portal_user_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_b5583336935c928b505c782f4a" ON "app"."patients" ("tenant_id", "code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."clinicians" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "user_id" uuid, "specialty" text, "license_number" text, "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3eabf027ee5c336c7f106c9cc32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "app"."encounter_type_enum" AS ENUM('consultation', 'control', 'emergency', 'procedure', 'telemedicine')`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."encounters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "patient_id" uuid NOT NULL, "clinician_id" uuid, "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL, "type" "app"."encounter_type_enum" NOT NULL, "notes" jsonb NOT NULL DEFAULT '{}'::jsonb, "status_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b2e596be58aabc4ccc8f8458b53" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "app"."doc_type_enum" AS ENUM('ultrasound', 'exam', 'treatment', 'note', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "patient_id" uuid NOT NULL, "encounter_id" uuid, "type" "app"."doc_type_enum" NOT NULL, "title" text, "mime" text NOT NULL, "storage_key" text NOT NULL, "size_bytes" bigint NOT NULL, "sha256" text NOT NULL, "status_id" uuid, "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."shares" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "document_id" uuid NOT NULL, "shared_with_user_id" uuid, "shared_with_email" text, "scope" text NOT NULL DEFAULT 'view', "expires_at" TIMESTAMP WITH TIME ZONE, "created_by" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b88473409066c43c2ccb1894a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."role_permissions" ("role_id" uuid NOT NULL, "permission_id" uuid NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "user_id" uuid NOT NULL, "channel" text NOT NULL, "payload" jsonb NOT NULL, "status" text NOT NULL DEFAULT 'queued', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "sent_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."consents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "patient_id" uuid NOT NULL, "scope" text NOT NULL, "payload" jsonb NOT NULL DEFAULT '{}'::jsonb, "valid_from" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "valid_to" TIMESTAMP WITH TIME ZONE, "revoked_at" TIMESTAMP WITH TIME ZONE, "status_id" uuid, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_9efc68eb6aba7d638fb6ea034dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "app"."audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenant_id" uuid NOT NULL, "actor_user_id" uuid, "action" text NOT NULL, "resource_type" text NOT NULL, "resource_id" uuid, "ip" inet, "user_agent" text, "details" jsonb NOT NULL DEFAULT '{}'::jsonb, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."users" ADD CONSTRAINT "FK_109638590074998bb72a2f2cf08" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."roles" ADD CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "app"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_permissions" ADD CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_permissions" ADD CONSTRAINT "FK_8145f5fadacd311693c15e41f10" FOREIGN KEY ("permission_id") REFERENCES "app"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."patients" ADD CONSTRAINT "FK_21b4c71c7ab2d8ac04be7691a42" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."patients" ADD CONSTRAINT "FK_7c8bb092c9e63661b42e1162629" FOREIGN KEY ("portal_user_id") REFERENCES "app"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."clinicians" ADD CONSTRAINT "FK_ca120eb23f35e8f6580701c6e33" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."clinicians" ADD CONSTRAINT "FK_7b06c71998a381e8e45f68ab987" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" ADD CONSTRAINT "FK_bd131152589c5e5f0aa9182d0cb" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" ADD CONSTRAINT "FK_bb9694e5661b8635d77020d9529" FOREIGN KEY ("patient_id") REFERENCES "app"."patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" ADD CONSTRAINT "FK_6071eb6bfe33027501552a7eb8d" FOREIGN KEY ("clinician_id") REFERENCES "app"."clinicians"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" ADD CONSTRAINT "FK_51f29a4debd965367f8f56ec44e" FOREIGN KEY ("status_id") REFERENCES "app"."statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" ADD CONSTRAINT "FK_5109a94ccfd3f39bf4a7a1e1fa6" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" ADD CONSTRAINT "FK_f06c282a41ed7987669c9c4e1f5" FOREIGN KEY ("patient_id") REFERENCES "app"."patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" ADD CONSTRAINT "FK_be38fb022450b49a34ed87e023c" FOREIGN KEY ("encounter_id") REFERENCES "app"."encounters"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" ADD CONSTRAINT "FK_ce203df932da7668d9d41196e5a" FOREIGN KEY ("status_id") REFERENCES "app"."statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" ADD CONSTRAINT "FK_14371caaff44d0801b59b284166" FOREIGN KEY ("created_by") REFERENCES "app"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" ADD CONSTRAINT "FK_9d4dac50fa63e9b6c5cccc14bd5" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" ADD CONSTRAINT "FK_2f37b0cb5f3b38e36673c870309" FOREIGN KEY ("document_id") REFERENCES "app"."documents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" ADD CONSTRAINT "FK_8b38997461dcb25b6a77040bdbe" FOREIGN KEY ("shared_with_user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" ADD CONSTRAINT "FK_2f484ad2daff4f054fa99d56d56" FOREIGN KEY ("created_by") REFERENCES "app"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "app"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "app"."permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."notifications" ADD CONSTRAINT "FK_d93ddd7e1b890535ecafbb334ec" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."notifications" ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."consents" ADD CONSTRAINT "FK_949e8b074f10fe283dc754bfb8b" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."consents" ADD CONSTRAINT "FK_8df78e99f52f90e35a3e4748750" FOREIGN KEY ("patient_id") REFERENCES "app"."patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."consents" ADD CONSTRAINT "FK_a66033bb9cd008aabdb2cdda422" FOREIGN KEY ("status_id") REFERENCES "app"."statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."audit_logs" ADD CONSTRAINT "FK_6f18d459490bb48923b1f40bdb7" FOREIGN KEY ("tenant_id") REFERENCES "app"."tenants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."audit_logs" ADD CONSTRAINT "FK_f160d97a931844109de9d04228f" FOREIGN KEY ("actor_user_id") REFERENCES "app"."users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "app"."audit_logs" DROP CONSTRAINT "FK_f160d97a931844109de9d04228f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."audit_logs" DROP CONSTRAINT "FK_6f18d459490bb48923b1f40bdb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."consents" DROP CONSTRAINT "FK_a66033bb9cd008aabdb2cdda422"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."consents" DROP CONSTRAINT "FK_8df78e99f52f90e35a3e4748750"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."consents" DROP CONSTRAINT "FK_949e8b074f10fe283dc754bfb8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."notifications" DROP CONSTRAINT "FK_d93ddd7e1b890535ecafbb334ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" DROP CONSTRAINT "FK_2f484ad2daff4f054fa99d56d56"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" DROP CONSTRAINT "FK_8b38997461dcb25b6a77040bdbe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" DROP CONSTRAINT "FK_2f37b0cb5f3b38e36673c870309"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."shares" DROP CONSTRAINT "FK_9d4dac50fa63e9b6c5cccc14bd5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" DROP CONSTRAINT "FK_14371caaff44d0801b59b284166"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" DROP CONSTRAINT "FK_ce203df932da7668d9d41196e5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" DROP CONSTRAINT "FK_be38fb022450b49a34ed87e023c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" DROP CONSTRAINT "FK_f06c282a41ed7987669c9c4e1f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."documents" DROP CONSTRAINT "FK_5109a94ccfd3f39bf4a7a1e1fa6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" DROP CONSTRAINT "FK_51f29a4debd965367f8f56ec44e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" DROP CONSTRAINT "FK_6071eb6bfe33027501552a7eb8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" DROP CONSTRAINT "FK_bb9694e5661b8635d77020d9529"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."encounters" DROP CONSTRAINT "FK_bd131152589c5e5f0aa9182d0cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."clinicians" DROP CONSTRAINT "FK_7b06c71998a381e8e45f68ab987"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."clinicians" DROP CONSTRAINT "FK_ca120eb23f35e8f6580701c6e33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."patients" DROP CONSTRAINT "FK_7c8bb092c9e63661b42e1162629"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."patients" DROP CONSTRAINT "FK_21b4c71c7ab2d8ac04be7691a42"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_permissions" DROP CONSTRAINT "FK_8145f5fadacd311693c15e41f10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_permissions" DROP CONSTRAINT "FK_3495bd31f1862d02931e8e8d2e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."roles" DROP CONSTRAINT "FK_e59a01f4fe46ebbece575d9a0fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "app"."users" DROP CONSTRAINT "FK_109638590074998bb72a2f2cf08"`,
    );
    await queryRunner.query(`DROP TABLE "app"."audit_logs"`);
    await queryRunner.query(`DROP TABLE "app"."consents"`);
    await queryRunner.query(`DROP TABLE "app"."notifications"`);
    await queryRunner.query(`DROP TABLE "app"."role_permissions"`);
    await queryRunner.query(`DROP TABLE "app"."shares"`);
    await queryRunner.query(`DROP TABLE "app"."documents"`);
    await queryRunner.query(`DROP TYPE "app"."doc_type_enum"`);
    await queryRunner.query(`DROP TABLE "app"."encounters"`);
    await queryRunner.query(`DROP TYPE "app"."encounter_type_enum"`);
    await queryRunner.query(`DROP TABLE "app"."clinicians"`);
    await queryRunner.query(
      `DROP INDEX "app"."IDX_b5583336935c928b505c782f4a"`,
    );
    await queryRunner.query(`DROP TABLE "app"."patients"`);
    await queryRunner.query(`DROP TYPE "app"."sex_enum"`);
    await queryRunner.query(
      `DROP INDEX "app"."IDX_0eb1c78c302b17f072f06e8034"`,
    );
    await queryRunner.query(`DROP TABLE "app"."statuses"`);
    await queryRunner.query(`DROP TABLE "app"."user_permissions"`);
    await queryRunner.query(
      `DROP INDEX "app"."IDX_d090ad82a0e97ce764c06c7b31"`,
    );
    await queryRunner.query(`DROP TABLE "app"."permissions"`);
    await queryRunner.query(`DROP TABLE "app"."user_roles"`);
    await queryRunner.query(
      `DROP INDEX "app"."IDX_c555146b304b5f51a7de6e18de"`,
    );
    await queryRunner.query(`DROP TABLE "app"."roles"`);
    await queryRunner.query(
      `DROP INDEX "app"."IDX_e9f4c2efab52114c4e99e28efb"`,
    );
    await queryRunner.query(`DROP TABLE "app"."users"`);
    await queryRunner.query(`DROP TABLE "app"."tenants"`);
  }
}
