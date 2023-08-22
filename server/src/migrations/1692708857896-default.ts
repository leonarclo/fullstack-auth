import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1692708857896 implements MigrationInterface {
  name = "Default1692708857896";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`emailVerified\` \`verified_email\` timestamp NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`image\` \`image\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`verified_email\` \`verified_email\` timestamp NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`accounts\` CHANGE \`access_token\` \`access_token\` text NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`accounts\` CHANGE \`expires_at\` \`expires_at\` timestamp NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`token_type\` \`token_type\` enum ('verify_email', 'reset_password', 'access_token') NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`expires_at\` \`expires_at\` timestamp NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`expires_at\` \`expires_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`
    );
    await queryRunner.query(
      `ALTER TABLE \`tokens\` CHANGE \`token_type\` \`token_type\` enum ('verify_email', 'reset_password', 'assess_token') NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`accounts\` CHANGE \`expires_at\` \`expires_at\` timestamp NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`accounts\` CHANGE \`access_token\` \`access_token\` text NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`verified_email\` \`verified_email\` timestamp NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`image\` \`image\` varchar(255) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`verified_email\` \`emailVerified\` timestamp NULL`
    );
  }
}
