import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1692736845086 implements MigrationInterface {
    name = 'Default1692736845086'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`image\` varchar(255) NULL, \`verified_email\` timestamp NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`accounts\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`account_type\` enum ('ADMIN', 'FREE', 'PAID') NOT NULL DEFAULT 'FREE', \`access_token\` text NULL, \`expires_at\` timestamp NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5a7a02c20412299d198e097a8f\` (\`id\`), UNIQUE INDEX \`REL_3aa23c0a6d107393e8b40e3e2a\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`identifier\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`token_type\` enum ('verify_email', 'reset_password', 'access_token') NOT NULL, \`expires_at\` timestamp NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6a8ca5961656d13c16c04079dd\` (\`token\`), UNIQUE INDEX \`IDX_c600bff222fb94ca9c10ac9bd7\` (\`identifier\`, \`token\`), PRIMARY KEY (\`identifier\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`accounts\` ADD CONSTRAINT \`FK_3aa23c0a6d107393e8b40e3e2a6\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`accounts\` DROP FOREIGN KEY \`FK_3aa23c0a6d107393e8b40e3e2a6\``);
        await queryRunner.query(`DROP INDEX \`IDX_c600bff222fb94ca9c10ac9bd7\` ON \`tokens\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a8ca5961656d13c16c04079dd\` ON \`tokens\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
        await queryRunner.query(`DROP INDEX \`REL_3aa23c0a6d107393e8b40e3e2a\` ON \`accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_5a7a02c20412299d198e097a8f\` ON \`accounts\``);
        await queryRunner.query(`DROP TABLE \`accounts\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
