import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1692755481309 implements MigrationInterface {
    name = 'Default1692755481309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` ON \`accounts\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_ee66de6cdc53993296d1ceb8aa\` ON \`accounts\` (\`email\`)`);
    }

}
