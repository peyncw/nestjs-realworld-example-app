import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToUser1689101779886 implements MigrationInterface {
    name = 'AddUsernameToUser1689101779886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "username" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "username"`);
    }

}
