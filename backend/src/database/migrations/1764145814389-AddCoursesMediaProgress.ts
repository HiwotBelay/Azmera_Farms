import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCoursesMediaProgress1764145814389 implements MigrationInterface {
    name = 'AddCoursesMediaProgress1764145814389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text, "icon" character varying, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."lessons_type_enum" AS ENUM('VIDEO', 'PDF', 'BOTH')`);
        await queryRunner.query(`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseId" uuid NOT NULL, "title" character varying NOT NULL, "description" text, "type" "public"."lessons_type_enum" NOT NULL DEFAULT 'VIDEO', "videoUrl" character varying, "pdfUrl" character varying, "order" integer NOT NULL DEFAULT '0', "duration" integer, "isPreview" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "enrollments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "courseId" uuid NOT NULL, "progress" numeric(5,2) NOT NULL DEFAULT '0', "isCompleted" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP, "lastLessonOrder" integer NOT NULL DEFAULT '0', "enrolledAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7c0f752f9fb68bf6ed7367ab00f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."courses_status_enum" AS ENUM('DRAFT', 'PENDING', 'PUBLISHED', 'REJECTED')`);
        await queryRunner.query(`CREATE TYPE "public"."courses_level_enum" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED')`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "shortDescription" text, "creatorId" uuid NOT NULL, "categoryId" uuid, "status" "public"."courses_status_enum" NOT NULL DEFAULT 'DRAFT', "level" "public"."courses_level_enum" NOT NULL DEFAULT 'BEGINNER', "price" numeric(10,2) NOT NULL DEFAULT '0', "isFree" boolean NOT NULL DEFAULT false, "thumbnail" character varying, "images" jsonb, "duration" integer NOT NULL DEFAULT '0', "lessonsCount" integer NOT NULL DEFAULT '0', "studentsCount" integer NOT NULL DEFAULT '0', "rating" numeric(3,2) NOT NULL DEFAULT '0', "reviewsCount" integer NOT NULL DEFAULT '0', "tags" jsonb, "language" text, "rejectionReason" character varying, "reviewedBy" character varying, "reviewedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lesson_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "lessonId" uuid NOT NULL, "isCompleted" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP, "watchedDuration" integer NOT NULL DEFAULT '0', "lastPosition" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ad81afae954f3a14766e7bf8106" UNIQUE ("userId", "lessonId"), CONSTRAINT "PK_e6223ebbc5f8f5fce40e0193de1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."media_type_enum" AS ENUM('VIDEO', 'PDF', 'IMAGE', 'AUDIO')`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "filename" character varying NOT NULL, "url" character varying NOT NULL, "type" "public"."media_type_enum" NOT NULL, "size" bigint NOT NULL, "mimeType" character varying, "uploadedBy" uuid, "thumbnailUrl" character varying, "hlsUrl" character varying, "metadata" jsonb, "isProcessed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_de33d443c8ae36800c37c58c929" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "enrollments" ADD CONSTRAINT "FK_60dd0ae4e21002e63a5fdefeec8" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_9db18ef724cf8903bc98d902324" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "courses" ADD CONSTRAINT "FK_c730473dfb837b3e62057cd9447" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_eb4349e70765bb218bb4f833f68" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_progress" ADD CONSTRAINT "FK_df13299d2740b302dd44a368df9" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "media" ADD CONSTRAINT "FK_aa2448683904dc9879c1085ca65" FOREIGN KEY ("uploadedBy") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "media" DROP CONSTRAINT "FK_aa2448683904dc9879c1085ca65"`);
        await queryRunner.query(`ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_df13299d2740b302dd44a368df9"`);
        await queryRunner.query(`ALTER TABLE "lesson_progress" DROP CONSTRAINT "FK_eb4349e70765bb218bb4f833f68"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_c730473dfb837b3e62057cd9447"`);
        await queryRunner.query(`ALTER TABLE "courses" DROP CONSTRAINT "FK_9db18ef724cf8903bc98d902324"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_60dd0ae4e21002e63a5fdefeec8"`);
        await queryRunner.query(`ALTER TABLE "enrollments" DROP CONSTRAINT "FK_de33d443c8ae36800c37c58c929"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_1a9ff2409a84c76560ae8a92590"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TYPE "public"."media_type_enum"`);
        await queryRunner.query(`DROP TABLE "lesson_progress"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TYPE "public"."courses_level_enum"`);
        await queryRunner.query(`DROP TYPE "public"."courses_status_enum"`);
        await queryRunner.query(`DROP TABLE "enrollments"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TYPE "public"."lessons_type_enum"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
