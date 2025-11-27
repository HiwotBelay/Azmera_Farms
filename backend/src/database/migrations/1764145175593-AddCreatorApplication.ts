import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatorApplication1764145175593 implements MigrationInterface {
    name = 'AddCreatorApplication1764145175593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."creator_applications_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED')`);
        await queryRunner.query(`CREATE TABLE "creator_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "status" "public"."creator_applications_status_enum" NOT NULL DEFAULT 'PENDING', "motivation" text, "experience" text, "documents" jsonb, "reviewedBy" character varying, "rejectionReason" character varying, "submittedAt" TIMESTAMP, "reviewedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d1b7eb7218323d0fd1de08c70c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "creator_applications" ADD CONSTRAINT "FK_c6e096b78a50c305e2dcfab6eb5" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "creator_applications" DROP CONSTRAINT "FK_c6e096b78a50c305e2dcfab6eb5"`);
        await queryRunner.query(`DROP TABLE "creator_applications"`);
        await queryRunner.query(`DROP TYPE "public"."creator_applications_status_enum"`);
    }

}
