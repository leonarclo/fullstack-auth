import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1696126487241 implements MigrationInterface {
    name = 'Default1696126487241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD \`refresh_token\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP COLUMN \`refresh_token\``);
    }

}
