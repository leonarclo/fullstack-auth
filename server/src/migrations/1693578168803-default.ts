import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1693578168803 implements MigrationInterface {
    name = 'Default1693578168803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`image\` \`image\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`verified_email\` \`verified_email\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`access_token\` \`access_token\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`access_token_expires_at\` \`access_token_expires_at\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`tokens\` CHANGE \`expires_at\` \`expires_at\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tokens\` CHANGE \`expires_at\` \`expires_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()`);
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`access_token_expires_at\` \`access_token_expires_at\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`accounts\` CHANGE \`access_token\` \`access_token\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`verified_email\` \`verified_email\` timestamp NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`image\` \`image\` varchar(255) NULL DEFAULT 'NULL'`);
    }

}
