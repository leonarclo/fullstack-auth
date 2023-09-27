import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1695837745230 implements MigrationInterface {
    name = 'Default1695837745230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`clients\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b48860677afe62cd96e1265948\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_b48860677afe62cd96e1265948\` ON \`clients\``);
        await queryRunner.query(`DROP TABLE \`clients\``);
    }

}
